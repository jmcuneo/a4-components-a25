import express from "express";
import ViteExpress from "vite-express";
import 'dotenv/config';
import {ObjectId, MongoClient, ServerApiVersion } from 'mongodb';
import session from 'express-session';

const uri = `mongodb+srv://${process.env.USERNM}:${process.env.PASS}@${process.env.HOST}/?retryWrites=true&w=majority&appName=Cluster0`;
const app = express()

app.use( express.json() )
app.use( express.urlencoded({ extended:true }) )

app.use(session({
  secret: 'wwewewe',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 }
}));

app.use( (req,res,next) => {
    if( collection !== null ) {
        next()
    } else {
        res.status( 503 ).send()
    }
})

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection = null
let userCollection = null

async function run() {
  const dbName = 'a3-webware';

  try {
    await client.connect(
    err => {
      console.log("err :", err);
      client.close();
    }

    );  

    // Send a ping to confirm a successful connection
    await client.db("a3-webware").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const db = client.db(dbName);
    collection = db.collection('documents');
    userCollection = db.collection('users');

    // await collection.insertOne( { name: 'Superman', year: 2025, plotRating: 9, actingRating: 9, musicRating: 10, overallRating: 9.33} )
    // await collection.insertOne( { name: 'Little Women', year: 2019, plotRating: 9, actingRating: 9, musicRating: 10, overallRating: 9.33} )
    // await collection.insertOne( { name: 'Knives Out', year: 2019, plotRating: 9, actingRating: 9, musicRating: 10, overallRating: 9.33} )

 } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

app.post('/login', async (req, res) => {
  const username = req.body.username;
  console.log(req.body)
  //get username and pass stored in DB from given username 
  const result = await userCollection.find({username}).toArray();
  const user = result[0]

  if ( user && req.body.password === user.password) {
    req.session.login = true;
    req.session.userId = user._id.toString();
    req.session.username = req.body.username;
    
    return res.json({
        success: true,
        userId: user._id.toString(),
        username: req.body.username,
        isNewUser: false,
    });
  }
  else if (!user && req.body.password !== null && req.body.username !== null && req.body.doCreateUser) {
    try {
      //create user in DB
      const newUser = { username: req.body.username, password: req.body.password}
      const result = await userCollection.insertOne( newUser )

      req.session.login = true;
      req.session.userId = result.insertedId.toString();
      req.session.username = req.body.username;
      req.session.isNewUser = true;
      
      return res.json({
        success: true,
        userId: result.insertedId.toString(),
        username: req.body.username,
        isNewUser: true,
      });
    }
    catch (e) {
      console.log(e)
      return res.status(500).json({ success: false, error: 'serverError' });
    }
  }
  else {
     return res.status(401).json({ success: false, error: 'incorrectCreds' });
  }
})

app.get('/userDetails', (req, res) => {
  if (req.session.login) {
    const details = {
      username: req.session.username,
      isNewUser: req.session.isNewUser || false
    }

    res.json(details)
  }
  else {
    console.log("user not logged in!")
    res.status(401).json({ error: 'Not logged in' });
  }
})

app.get('/results', async (req, res) => {
  //check if session has a user id 
  if (req.session.userId === null) {
    return res.status(401).send('Not authorized');
  }

  if (collection !== null) {
    const findResult = await collection.find({
      userId: req.session.userId
    }).toArray();

    res.json(findResult)
  }
})

app.post( '/add', async (req,res) => {
  //check if session has a user id 
  if (req.session.userId === null) {
    return res.status(401).send('Not authorized');
  }

  req.body = addDerivedField(req.body)
  req.body.userId = req.session.userId
  console.log("req body:", req.body)

  const result = await collection.insertOne( req.body )
    
  res.json( result )
})

app.post( '/remove', async (req,res) => {
  console.log("req body:", req.body)

  //check if session has a user id 
  if (req.session.userId === null) {
    return res.status(401).send('Not authorized');
  }

  const result = await collection.deleteOne({ 
      _id:new ObjectId( req.body._id ),
      userId: req.session.userId 
  })
  
  res.json( result )
})

app.post( '/update', async (req,res) => {
  console.log("req body:", req.body)

  //check if session has a user id 
  if (req.session.userId === null) {
    return res.status(401).send('Not authorized');
  }

  const total = req.body.plotRating + req.body.actingRating + req.body.musicRating
  const overallRating = Math.round((total / 3) * 100) / 100

  const result = await collection.updateOne(
        { _id: new ObjectId( req.body._id ), userId: req.session.userId },
        { $set:{ plotRating: req.body.plotRating, actingRating: req.body.actingRating, musicRating: req.body.musicRating, overallRating: overallRating} }
  )

  res.json( result )
})

run().catch(console.dir)

const addDerivedField = function( data ) {
  let total = data["plotRating"] + data["actingRating"] + data["musicRating"]

  let newObject = { 
      name: data["name"], 
      year: data["year"], 
      plotRating: data["plotRating"], 
      actingRating: data["actingRating"], 
      musicRating: data["musicRating"], 
      overallRating: Math.round((total / 3) * 100) / 100}

  return newObject
}

const PORT = process.env.PORT || 3000;

ViteExpress.listen(app, PORT, () =>
  console.log(`Server is listening on port ${PORT}...`),
);
