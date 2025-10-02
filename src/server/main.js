import express from  'express'
import ViteExpress from 'vite-express'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from "url";
import { MongoClient, ServerApiVersion } from 'mongodb';

const app = express()

dotenv.config()

let username = ""
let password = ""

const __filename = fileURLToPath(import.meta.url);
const __tempDirc = path.dirname(__filename);
const __dirname = path.join(path.join(__tempDirc, '..'), '..')

app.use(express.json())
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'src/client')));

const uri = `mongodb+srv://${process.env.USERNM}:${process.env.PASS}@${process.env.HOST}/?retryWrites=true&w=majority&appName=WebwareA3`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection = null

async function run() {
  try {
    await client.connect();  
    collection = client.db("a3Data").collection("users");
    // Send a ping to confirm a successful connection
    await client.db("a3Data").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
 } catch (err){
  console.log("error : ", err)
 }
}

app.get("/:all(*)", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.post('/login', async(req, res) => {
  const user = await collection.findOne({username : req.body.username})
  if (user){
    const userAndPass = await collection.findOne({
        username : req.body.username,
        password : req.body.password  
    })
    if (userAndPass){
      res.json({ success: true });
      username = req.body.username
      password = req.body.password 
    }
    else 
      res.json({ success: false, msg: "Wrong password. Please try again" })
  }
  else {
    const document = {username : req.body.username, password : req.body.password}
    await collection.insertOne(document)
    res.json({ success: false, msg: "Account created. Please log in again." });
  }
});

app.get("/table", async (req, res)=> {
  const data = await collection.findOne({
    username : username,
    password : password 
  })
  res.end(JSON.stringify(data));
})

app.get('/fields', async (req, res) =>{
 const doc = await collection.findOne({username : username})
  const fields = Object.keys(doc)
  res.end(JSON.stringify(fields));
})


app.post( '/add', async (req,res) => { 
    const field = req.body.field
    const toAdd = req.body.toAdd
    const result = await collection.updateOne( {username : username},
                                                {$set: {[field] : toAdd}}
     );
    res.json( result )
})

app.post( '/remove', async (req,res) => {
    const field = req.body.field
    const doc = await collection.findOne({username : username})
    const allFields = Object.keys(doc)
    if (!allFields.includes(field)){
      res.status(400).json({success : false})
      return;
    }
    else{
    const result = await collection.updateOne( {username : username},
                                                {$unset: {[field] : ""}}
     );
    res.status(200).json({success : true})
    }
})

app.post( '/update', async (req,res) => {
    const field = req.body.field
    const toUpdate = req.body.toUpdate
    const doc = await collection.findOne({username : username})
    const allFields = Object.keys(doc)
    if (!allFields.includes(field)){
      res.status(400).json({success : false})
      return;
    }
    else{
    const result = await collection.updateOne( {username : username},
                                                {$set: {[field] : toUpdate}}
     );
    res.status(200).json({success : true})
    }
})

async function startServer() {
  console.log(uri);
  await run();
  app.listen(process.env.PORT || 3000,);
}

startServer().catch(console.dir);