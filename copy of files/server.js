import express from  'express'
import ViteExpress from 'vite-express'
import {MongoClient, ServerApiVersion} from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

const uri = `mongodb+srv://${process.env.USERNM}:${process.env.PASS}@${process.env.HOST}/?retryWrites=true&w=majority&appName=leaderboard`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use( express.static( 'public' ) )

const start_connection = async (req, res, next) => {
  await client.connect(
    err => {
      console.log("err :", err);
      client.close();
    }
  );  

  let db = client.db("lb")
  let collection = db.collection("entries");
  let leaderboard = collection.find().toArray()

  req.lb = await leaderboard
  req.collection = await collection
  next()
}

const getDataString = async (req, res, next) => {
  if(req.method === 'POST'){
    let dataString = ''

    req.on( 'data', function( data ) {
      dataString += data 
    })

    req.on( 'end', async function() {
      req.json = await JSON.parse( dataString )
      if( req.url != "/login"){
        req.json.grade = gradeScore(req.json.score)
      }
      next()
    })

  } else {
    next()
  }
}

const updateLeaderboard = async (req, res, next) => {
  let foundEntry = false

  if(req.url === "/entry"){
    // Search for the existing entry.
    for(let entry of req.lb){
      if(entry.username == req.json.username){
        if(entry.password == req.json.password){
          // If player name and password match, update with new data.
          foundEntry = true
          await req.collection.updateOne(
            {username: req.json.username},
            {$set:{score: req.json.score,
              grade: req.json.grade,
              combo: req.json.combo,
              complete: req.json.complete}}
          )
          entry.score = await req.json.score
          entry.grade = await req.json.grade
          entry.combo = await req.json.combo
          entry.complete = await req.json.complete
          next()
        } else {
          // If password doesn't match, cancel the whole operation
          console.log("Incorrect Password!")
          next()
        }
      }
    }
    if(!foundEntry){
      // Create and add new entry
      await req.collection.insertOne(req.json)
      await req.lb.push(req.json)
      next()
    }
  } else if(req.url === "/delete") {
    // Search for an existing entry
    let foundEntry = false
    for(let i = 0 ; i < req.lb.length; i++){
      if(req.lb[i].username == req.json.username){
        foundEntry = true
        if(req.lb[i].password == req.json.password){
          // Remove entry if password is correct
          await req.collection.deleteOne({
            username:req.json.username
          })
          await req.lb.splice(i, 1)
          next()
        } else {
          console.log("Incorrect Password!")
          next()
        }
      }
    }
    if(!foundEntry){
      console.log("User not found")
      next()
    }
  } else {
    next()
  }
}

const constructLeaderboard = async (req, res, next) => {
  try{
    if(req.url != "/login"){
      if(req.url == "/entry" || req.url == "/delete" || req.url == "/load"){
        req.sortedlb = req.lb.sort((a, b) => b.score - a.score)
      }
    }
  } finally {
    next()
  }
}

const loginUser = async (req, res, next) => {
  if(req.url == "/login"){
    let json = {
      username: req.json.username,
      password: req.json.password
    }
    let foundEntry = false
    for(let entry of req.lb){
      if(entry.username == req.json.username){
        foundEntry = true
        if(entry.password == req.json.password){
          json.success = true
          res.write(JSON.stringify(json))
          next()
        } else {
          console.log("Incorrect Password!")
          json.success = false
          next()
        }
      }
    }
    if(!foundEntry){
      json.success = true
      res.write(JSON.stringify(json))
      next()
    }
  } else {
    if(req.url == "/load"){
      res.json(req.sortedlb)
    } else if(req.url == "/entry" || req.url == "/delete"){
      res.sendStatus(200)
    } else {
      next()
    }
  }
}

app.use(start_connection)
app.use(getDataString)
app.use(updateLeaderboard)
app.use(constructLeaderboard)
app.use(loginUser)

app.post("/entry", async ( req, res ) => {
  res.json(req.sortedlb)
})

app.post("/delete", async (req, res) => {
  res.json(req.sortedlb)
})

app.get("/load", async ( req, res ) => {
  res.json(req.sortedlb)
})

app.post("/login", async (req, res) => {
  res.end()
})

// Determine "completion grade" based on score
const gradeScore = function( score ) {
  switch(true){
    case(score == 1000000):
      return "MASTER"
    case(score >= 990000):
      return "SSS+"
    case(score >= 980000):
      return "SSS"
    case(score >= 970000):
      return "SS+"
    case(score >= 950000):
      return "SS"
    case(score >= 930000):
      return "S+"
    case(score >= 900000):
      return "S"
    case(score >= 850000):
      return "AAA"
    case(score >= 800000):
      return "AA"
    case(score >= 700000):
      return "A"
    case(score > 0):
      return "B"
    case(score == 0):
      return "D"
  }
}

ViteExpress.listen( app, 3000 )