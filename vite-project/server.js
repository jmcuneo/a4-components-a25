import express from 'express'
import { parse } from 'svelte/compiler';
import ViteExpress from 'vite-express'

const port = process.env.PORT || 4000
const app = express()
const appdata = []

app.use( express.static('public'));
app.use( express.json() );
app.use(express.urlencoded({ extended: true }));


app.get( '/showMe', (req, res) =>{
  res.writeHead( 200, { "Content-Type": 'application/json' })
  res.end( JSON.stringify(appdata) )
})

const middleware_post = async (req, res, next) => {
  //open up the client
  let parsedString = req.body
  let currentRank = 1;
  let removedRank = 0;
  //go through appdata, check to see if the new entry already exists, and at the same time, update rankings
  appdata.forEach(entry =>{
    if ((entry.movieName == parsedString.movieName) && (entry.releaseYear == parsedString.releaseYear)){
       removedRank = entry.ranking
      let index = appdata.indexOf(entry)
      appdata.splice(index, 1)
      //update the rankings. since we're only removing one thing at a time, any entry below that ranking will be bumped
      appdata.forEach(entry =>{
        if (entry.ranking > removedRank){
          entry.ranking--;
      }
    })
    }
  })
  appdata.forEach(entry =>{
    //rank the new entry based on its stars
    if (+parsedString.numStars >= +entry.numStars){
      entry.ranking++;
    }
    else{
      currentRank++;
    }
  })
  parsedString.ranking = currentRank;
  appdata.push(parsedString);
  req.json = JSON.stringify(appdata);
  next()
}

app.post( '/submit',  middleware_post, (req, res) =>{
  res.writeHead( 200, { "Content-Type": 'application/json' })
  res.end( req.json )
});


const middleware_delete = async (req, res, next) =>{
  let parsedString = req.body;
  let removedRank = 0;
  appdata.forEach(entry =>{
    //if we found match, remove it from appdata
    if ((entry.movieName == parsedString.movieName) && (entry.releaseYear == parsedString.releaseYear)){
        removedRank = entry.ranking
        let index = appdata.indexOf(entry)
        appdata.splice(index, 1)
    }
  })
  //update the rankings. since we're only removing one thing at a time, any entry below that ranking will be bumped
  appdata.forEach(entry =>{
    if (entry.ranking > removedRank){
      entry.ranking--;
    }
  })
  req.json = JSON.stringify(appdata);
  next()
}

app.post( '/delete',  middleware_delete, (req, res) =>{
  res.writeHead( 200, { "Content-Type": 'application/json' })
  res.end( req.json )
});


ViteExpress.listen(app, port)

