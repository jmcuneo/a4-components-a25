require("dotenv").config();

const express = require('express')
const session = require('express-session')
const bcrypt = require('bcrypt');

const { ObjectId, MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USERNM}:${process.env.PASS}@${process.env.HOST}/?retryWrites=true&w=majority&appName=Webware-Assignment-Three-A`;
const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true, }});

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(express.static('public'))
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

let reviewCollection = null
let userCollection = null

const run = async function(){
    try {
        await client.connect(error => {
            console.log("Error :", error);
            client.close();
        });
        reviewCollection = client.db("webware-assignment-a-three").collection("reviews");
        userCollection = client.db("webware-assignment-a-three").collection("users");

        await reviewCollection.createIndex({ userId: 1 })
        await userCollection.createIndex({ username: 1 }, { unique: true });

        await client.db("webware-assignment-a-three").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
}

function authorisation(request, response, next){
    if (request.session.user){
        next();
    } else {
        return response.status(500).json({ error: "Authentication Error" });
    }
}

app.get('/user', (request, response) => {
    if (request.session.user){
        response.json({ user: request.session.user, status: true })
    } else {
        response.json({ status: false })
    }
})

app.get('/reviews', authorisation, async (request, response) => {
    try {
        const username = request.session.user.username;
        response.json(await reviewCollection.find({ username }).toArray());
    } catch (error){
        console.error("Error Fetching Data: ", error);
        response.status(500).json({ error: "Failed To Fetch Data" });
    }
})

app.post('/register', async (request, response) => {
    // console.log("Attempting Register");
    try {
        const { username, password } = request.body;

        if (!username || !password )
            return response.status(500).json({ error: "Invalid Credentials - Username or Password Not Found"});

        const userCheck = await userCollection.findOne({ username });
        if (userCheck)
            return response.status(500).json({ error: "Invalid Credentials - Username Already In Use"});

        const hashword = await bcrypt.hash(password, 10);
        const newUser = await userCollection.insertOne({
            username: username,
            password: hashword
        })

        request.session.user = {
            id: newUser._id,
            username: username
        }

        response.json({ success: true, user: { username: username } });
        // console.log("Registration Successful");
    } catch (error){
        console.error("Error Regitering: ", error);
        response.status(500).json({ error: "Failed To Register Account"});
    }
})

app.post('/login', async (request, response) => {
    // console.log("Attempting Login");
    try {
        const { username, password } = request.body;

        if (!username || !password )
            return response.status(500).json({ error: "Invalid Credentials - Username or Password Not Found"});

        const user = await userCollection.findOne({ username });
        if (!user)
            return response.status(500).json({ error: "Invalid Credentials - Username Not Found"});

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck)
            return response.status(500).json({ error: "Invalid Credentials - Password Not Correct"});

        request.session.user = {
            id: user._id,
            username: username
        }

        response.json({ success: true, user: { username: username } });
        // console.log("Login Successful");
    } catch (error){
        console.error("Error Logging In: ", error);
        response.status(500).json({ error: "Failed To Login"});
    }
})

app.post('/logout', (request, response) => {
    // console.log("Logging out");
    request.session.destroy(() => response.json({ success: true }));
})

app.post('/submit', authorisation, async (request, response) => {
    // console.log("Submission");
    try {
        const data = request.body;

        const review = {
            ...data,
            datePosted: new Date().toLocaleString(),
            overallRating: (parseFloat((data["gameplayRating"] + data["storyRating"] + data["visualsRating"] + data["musicRating"])) / 4).toFixed(2),
            username: request.session.user.username
        };

        await reviewCollection.insertOne(review);
        response.json({ success: true })
    } catch (error){
        console.error("Error Submitting Review Data: ", error);
        response.status(500).json({ error: "Failed To Submit New Data" });
    }
})

app.put("/edit/:id", authorisation, async (request, response) => {
    try {
        // console.log("Editing Post " + request.params.id);
        const { blurb, gameplayRating, storyRating, visualsRating, musicRating } = request.body;
        // console.log(editedReview);
        const overallRating = (parseFloat((gameplayRating + storyRating + visualsRating + musicRating)) / 4).toFixed(2);
        reviewCollection.updateOne(
            { _id: new ObjectId(request.params.id), username: request.session.user.username },
            { $set: { blurb, gameplayRating, storyRating, visualsRating, musicRating, overallRating }}
        )
        response.json({ success: true })
    } catch (error){
        console.error("Error Updating Review Data: ", error);
        response.status(500).json({ error: "Failed To Update Data" });
    }
})

app.post('/delete', authorisation, async (request, response) => {
    try {
        const { id } = request.body;
        await reviewCollection.deleteOne({ _id: new ObjectId(id), username: request.session.user.username })

        const data = await reviewCollection.find({ username: request.session.username }).toArray();
        response.json({ data });
    } catch (error){
        console.error("Error Deleting Review Data: ", error);
        response.status(500).json({ error: "Failed To Delete Data" });
    }
})

const startup = async function(){
    await run();
    app.listen(process.env.PORT || 3000, () => {
        console.log("Server Up")
    })
}

startup().catch(console.error)