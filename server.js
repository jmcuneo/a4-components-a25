import dotenv from 'dotenv'
dotenv.config()

// import ViteExpress from 'vite-express'
import express from 'express'
import passport from 'passport'
import session from 'express-session'
import { Strategy as GitHubStrategy } from 'passport-github'

import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) )
app.use( express.json() )

app.use(session({
    secret: '0hRU9tuVmf0h7cFkKTFE6z9dKvV6Nu',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

app.use( passport.initialize() )
app.use( passport.session() )

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((obj, done) => {
    done(null, obj)
})

passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL}/auth/github/callback`
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log("GitHub profile:", profile)
        cb(null, profile)
    }
));

const uri = `mongodb+srv://${process.env.USERNM}:${process.env.PASS}@${process.env.HOST}/?retryWrites=true&w=majority&appName=Cluster0`;
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
        collection = client.db("loanData").collection("assignmentThree");
        // Send a ping to confirm a successful connection
        await client.db("loanData").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error(error);
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"))
})

app.get("/home", (req, res) => {
    if (!req.user) return res.redirect('/')
    res.sendFile(path.join(__dirname, "dist", "index.html"))
})

app.use(express.static(path.join(__dirname, "dist")))

app.get('/auth/github', passport.authenticate('github'))
app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/home');
    })

app.get("/results", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not logged in" });

    const docs = await collection.find({ githubId: req.user.id }).toArray();
    res.json(docs);
})

app.post("/add", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not logged in" });

    const dataWithUser = {
        ...req.body,
        githubId: req.user.id,
        githubUsername: req.user.username,
    };

    const result = await collection.insertOne( dataWithUser )
    res.json( result )
})

app.post("/delete", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not logged in" });

    const idx = req.body.index
    const docs = await collection.find({ githubId: req.user.id }).toArray()

    if (idx >= 0 && idx < docs.length) {
        const idToDelete = docs[idx]._id
        await collection.deleteOne({ _id: idToDelete, githubId: req.user.id })
    }

    const updated = await collection.find({ githubId: req.user.id }).toArray()
    res.json(updated)
})

app.put("/update/:index", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not logged in" });

    const idx = parseInt(req.params.index, 10)
    const docs = await collection.find({ githubId: req.user.id }).toArray()

    if (isNaN(idx) || idx < 0 || idx >= docs.length) {
        return res.status(404).json({ error: "Invalid index" })
    }

    const idToUpdate = docs[idx]._id

    const result = await collection.updateOne(
        { _id: new ObjectId( idToUpdate ), githubId: req.user.id },
        { $set: req.body },
    )

    res.json( result )
})

app.get(/^\/(?!auth|results|add|delete|update).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"))
})

app.use((req, res) => {
    res.status(404).send("404 Error: File Not Found")
})

app.listen(3000, () => console.log(`Server running on port 3000`));