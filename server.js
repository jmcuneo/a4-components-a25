require("dotenv").config()

const express    = require('express'),
      app        = express(),
      info     = [],
      path = require("path");

//app.use(express.static(path.join(__dirname, "public")));
app.use( express.static( 'views'  ) )
app.use( express.static( 'public'  ) )

app.use(express.urlencoded({ extended: true }));

// Allows us to handle JSON in certain ways on the server side
// If JSON is sent by the client, just tack it on to the request body
// Allows us to do req.body.newdream farther down
// Only want to use it for JSON data
app.use( express.json() )

var username;
var password;

app.get('/data', async (req, res) =>{

    const col = client.db("myDatabase").collection("myCollection");
    const docs = await col.find({}).toArray();

    var compiled = [];
    console.log("compiling");

    for (let i = 0; i < docs.length; i++){
        if (docs[i].username == username){
            if (docs[i].title){
                compiled.push(docs[i]);
            }
        }
    }

    res.json(compiled);
});

app.post( '/submit', async (req, res) => {
    const insertTitle = req.body.title;
    const insertThoughts = req.body.thoughts;
    const insertRating = req.body.rating;
    const insertDate = req.body.date;

    //info.push({ title, thoughts, rating }); // store them together in an object
    //res.json(info);
    //console.log(info);

    const col = client.db("myDatabase").collection("myCollection");
    //await col.insertOne({message: "Hello World!"});
    //await col.insertOne({title: insertTitle, thoughts: insertThoughts, rating: insertRating});

    await col.insertOne({
        username: username,
        title: insertTitle,
        thoughts: insertThoughts,
        date: insertDate,
        rating: insertRating
    });
    
    const docs = await col.find({}).toArray();
    console.log("docs in collection", docs);
    res.json({message: "Received."});
});

app.post('/login', async (req, res) =>{
    const col = client.db("myDatabase").collection("myCollection");
    username = req.body.username;
    password = req.body.password;

    var userCheck = await col.findOne({username: username});
    
    //If username is in database
    if (userCheck){
        //Find account with that same username and password
        var info = await col.findOne({username: username, password: password});

        if (!info){
            //Password incorrect
            console.log("Password incorrect");
            return res.json({message: "Password incorrect, try again.", success: false, status: "tryAgain"});
        }
        else{
            console.log("Welcome user:", username, password);
            return res.json({message: "Success!", success: true, status: "allGood"});
        }

    }
    //Username not in database, create new username and password
    else{
        console.log("Created new user:", username, password);
        res.json({message: "Created new user with those credentials. Please re-log in!", success: false, status: "newUser"});
        await col.insertOne({username: username, password: password});
    }
    
});

app.patch('/change', async (req, res) =>{
    console.log("change data");
    const title = req.body.changeTitle;
    const rating = req.body.changeRating;

    const col = client.db("myDatabase").collection("myCollection");

    try{
        const result = await col.updateOne(
            {title: { $regex: new RegExp(`^${title}$`, "i")}},
            { $set: {rating: rating}}
        );

        if (result.matchedCount === 0){
            res.json({message: "Could not find movie" + title});
        }
        else{
            res.json({message: "Updated"});
        }
    }
    catch (err){
        console.error(err);
    }
})

app.delete('/delete', async (req,res) =>{
    console.log("deleting...");
    const delTitle = req.body.title;

    const col = client.db("myDatabase").collection("myCollection");
    const docs = await collection.find({}).toArray();

    const filter = { title : delTitle};

    const result = await col.deleteOne(filter);

    if (result.deletedCount === 1){
        console.log("Deleted!");
        res.json({success: true});
    }
    else{
        console.log("Nothing was deleted");
        res.json({success: false});
    }

})


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USERNM}:${process.env.PASS}@${process.env.HOST}/?retryWrites=true&w=majority&appName=Cluster0`;
//const uri = `mongodb+srv://test:test@cluster0.ur8phwm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
//`mongodb+srv://<db_username>:<db_password>@cluster0.ur8phwm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
//console.log(uri);

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
    // Connect the client to the server	(optional starting in v4.7)
    // Anonymous function will print errors to the console related to that database
    await client.connect(
	err => {
		console.log("err :", err);
		client.close();
	}

    );  
    collection = client.db("myDatabase").collection("myCollection");
    // Send a ping to confirm a successful connection
    await client.db("myDatabase").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    }
    catch(err){
        alert("Could not ping");
    }

    app.get("/docs", async (req, res) => {
        if (collection !== null) {
            const docs = await collection.find({}).toArray()
            res.json( docs )
        }
    })
}
run().catch(console.dir);

app.listen( process.env.PORT || 3000)	