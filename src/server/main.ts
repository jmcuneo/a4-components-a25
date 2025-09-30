import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import {fileURLToPath} from "url";
import {MongoClient, ServerApiVersion, Collection} from "mongodb";
import pkg from "express-openid-connect";
const { auth, requiresAuth } = pkg;

// --- Types ---
interface Task {
    text: string;
    done: boolean;
}

interface Checklist {
    _id?: string;
    name: string;
    userId: string;
    tasks: Task[];
}

// --- Express app ---
const app = express();
const port = Number(process.env.PORT) || 3000;

// --- CORS ---
app.use(cors({origin: "http://localhost:5173", credentials: true}));

// --- Auth0 config ---
const authConfig = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_DOMAIN,
};
app.use(auth(authConfig));

// --- Middleware ---
app.use(express.json());

// --- Fix __dirname in ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// --- MongoDB ---
const client = new MongoClient(process.env.MONGO_URI!, {
    serverApi: {version: ServerApiVersion.v1, strict: true, deprecationErrors: true},
});
let checklistsCollection: Collection<Checklist>;

async function connectDB() {
    await client.connect();
    console.log("Connected to MongoDB!");
    const db = client.db("bucketdb");
    checklistsCollection = db.collection<Checklist>("checklists");
}

connectDB().catch(err => console.error("Mongo connection failed:", err));

// --- Routes ---

// Serve frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Get current Auth0 user
app.get("/api/me", (req, res) => {
    if (!req.oidc.isAuthenticated()) return res.status(401).json({error: "Not logged in"});
    res.json({user: req.oidc.user});
});

app.get("/logout", (req, res) => {
  res.oidc.logout({ returnTo: "http://localhost:5137" }); // frontend URL
});

// --- Checklists CRUD ---

// Get all checklists for logged-in user
app.get("/api/checklists", requiresAuth(), async (req, res) => {
    try {
        if (!req.oidc.user) return res.status(401).json({error: "Not logged in"});
        const userId = req.oidc.user.sub;
        const checklists = await checklistsCollection.find({userId}).toArray();
        res.json(checklists);
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
});

// Create new checklist
app.post("/api/checklists", requiresAuth(), async (req, res) => {
    const {name} = req.body;
    if (!name) return res.status(400).json({error: "Checklist name required"});

    if (!req.oidc.user) return res.status(401).json({ error: "Not logged in" });
    const newChecklist: Checklist = {name, userId: req.oidc.user.sub, tasks: []};
    try {
        await checklistsCollection.insertOne(newChecklist);
        res.json(newChecklist);
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
});

// Update checklist name
app.put("/api/checklists/:name", requiresAuth(), async (req, res) => {
    const {name} = req.params;
    const {newName} = req.body;
    if (!newName) return res.status(400).json({error: "New name required"});

    if (!req.oidc.user) return res.status(401).json({error: "Not logged in"});
    const userId = req.oidc.user.sub;
    try {
        await checklistsCollection.updateOne({name, userId}, {$set: {name: newName}});
        const updated = await checklistsCollection.findOne({name: newName, userId});
        res.json(updated);
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
});

// Delete checklist
app.delete("/api/checklists/:name", requiresAuth(), async (req, res) => {
    const {name} = req.params;
    if (!req.oidc.user) return res.status(401).json({error: "Not logged in"});
    const userId = req.oidc.user.sub;
    try {
        await checklistsCollection.deleteOne({name, userId});
        res.json({success: true});
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
});

// --- Task CRUD ---

// Add a task
app.post("/api/checklists/:name/tasks", requiresAuth(), async (req, res) => {
    const {name} = req.params;
    const {text} = req.body;
    if (!text) return res.status(400).json({error: "Task text required"});

    if (!req.oidc.user) return res.status(401).json({error: "Not logged in"});
    const userId = req.oidc.user.sub;
    try {
        await checklistsCollection.updateOne(
            {name, userId},
            {$push: {tasks: {text, done: false}}}
        );
        const updated = await checklistsCollection.findOne({name, userId});
        res.json(updated);
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
});

// Edit task text
app.put("/api/checklists/:name/tasks/:index/edit", requiresAuth(), async (req, res) => {
    const {name, index} = req.params;
    const idx = Number(index);
    const {text} = req.body;
    if (!req.oidc.user) return res.status(401).json({ error: "Not logged in" });
    const userId = req.oidc.user.sub;

    if (!text) return res.status(400).json({error: "Task text required"});

    try {
        const checklist = await checklistsCollection.findOne({name, userId});
        if (!checklist || !checklist.tasks[idx]) return res.status(404).json({error: "Task not found"});

        checklist.tasks[idx].text = text;
        await checklistsCollection.updateOne({name, userId}, {$set: {tasks: checklist.tasks}});
        res.json(checklist);
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
});

// Delete task
app.delete("/api/checklists/:name/tasks/:index", requiresAuth(), async (req, res) => {
    const {name, index} = req.params;
    const idx = Number(index);
    if (!req.oidc.user) return res.status(401).json({error: "Not logged in"});
    const userId = req.oidc.user.sub;

    try {
        const checklist = await checklistsCollection.findOne({name, userId});
        if (!checklist || !checklist.tasks[idx]) return res.status(404).json({error: "Task not found"});

        checklist.tasks.splice(idx, 1);
        await checklistsCollection.updateOne({name, userId}, {$set: {tasks: checklist.tasks}});
        res.json(checklist);
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
});

// Toggle task done/undone
app.put("/api/checklists/:name/tasks/:index", requiresAuth(), async (req, res) => {
    const {name, index} = req.params;
    const idx = Number(index);
    if (!req.oidc.user) return res.status(401).json({error: "Not logged in"});
    const userId = req.oidc.user.sub;

    try {
        const checklist = await checklistsCollection.findOne({name, userId});
        if (!checklist || !checklist.tasks[idx]) return res.status(404).json({error: "Task not found"});

        checklist.tasks[idx].done = !checklist.tasks[idx].done;
        await checklistsCollection.updateOne({name, userId}, {$set: {tasks: checklist.tasks}});
        res.json(checklist);
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
});

// --- Start server ---
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});
