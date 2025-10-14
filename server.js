require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

app.use(express.static("public"));
app.use(express.json());

// Serve robots.txt
app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.sendFile(__dirname + '/robots.txt');
});

// Session setup
app.use(
    session({
        secret: process.env.SESSION_SECRET || "keyboard cat",
        resave: false,
        saveUninitialized: false,
    })
);

// MongoDB setup
const uri = `mongodb+srv://${process.env.USERNM}:${process.env.PASS}@${process.env.HOST}/?retryWrites=true&w=majority&appName=A3Cluster`;
const client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

let collection = null;
async function connectDB() {
    await client.connect();
    const db = client.db("myFavoriteDatabase");
    collection = db.collection("myCollection");
    console.log("Connected to MongoDB");
}
connectDB();

// Middleware to require login
function requireLogin(req, res, next) {
    if (!req.session.loggedIn) return res.redirect("/login");
    next();
}

// Serve pages
app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});

app.get("/library", requireLogin, (req, res) => {
    res.sendFile(__dirname + "/public/library.html");
});

// Handle login/logout
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.LOGIN_USER && password === process.env.LOGIN_PASS) {
        req.session.loggedIn = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

app.post("/logout", (req, res) => {
    req.session.destroy(() => res.json({ message: "Logged out" }));
});

// Protect all following routes
app.use(requireLogin);

// ===== CRUD API =====

// Get all data
app.get("/getdata", async (req, res) => {
    const docs = await collection.find({}).toArray();
    res.json(docs);
});

// Add a new book
app.post("/submit", async (req, res) => {
    const newBook = req.body;
    const result = await collection.insertOne(newBook);
    res.json(result);
});

// Delete by ID
app.post("/delete", async (req, res) => {
    const { _id } = req.body;
    const result = await collection.deleteOne({ _id: new ObjectId(_id) });
    res.json(result);
});

// Update by ID
app.post("/update", async (req, res) => {
    const { _id, name, btitle, checkeddate, returndate } = req.body;
    const result = await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { name, btitle, checkeddate, returndate } }
    );
    res.json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
