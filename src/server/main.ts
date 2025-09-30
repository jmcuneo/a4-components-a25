import "dotenv/config";
import express from "express";
import cors from "cors";
import { MongoClient, Collection } from "mongodb";

interface Task {
    text: string;
    done: boolean;
}

interface Checklist {
    _id?: string;
    name: string;
    user: string; // username
    tasks: Task[];
}

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI!);
let checklistsCollection: Collection<Checklist>;

async function connectDB() {
    await client.connect();
    console.log("Connected to MongoDB!");
    const db = client.db("bucketdb");
    checklistsCollection = db.collection<Checklist>("checklists");
}

connectDB().catch(err => console.error("MongoDB connection failed:", err));

// --- Routes ---

// Fetch all checklists for a user
app.get("/api/checklists", async (req, res) => {
    const username = req.query.user as string;
    if (!username) return res.status(400).json({ error: "User required" });

    try {
        const checklists = await checklistsCollection.find({ user: username }).toArray();
        res.json(checklists);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new checklist
app.post("/api/checklists", async (req, res) => {
    const { name, user } = req.body;
    if (!name || !user) return res.status(400).json({ error: "Name and user required" });

    const newChecklist: Checklist = { name, user, tasks: [] };
    try {
        await checklistsCollection.insertOne(newChecklist);
        res.json(newChecklist);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// Rename a checklist
app.put("/api/checklists/:name/rename", async (req, res) => {
    const { name } = req.params;
    const { newName, user } = req.body;
    if (!newName || !user) return res.status(400).json({ error: "New name and user required" });

    try {
        await checklistsCollection.updateOne({ name, user }, { $set: { name: newName } });
        const updated = await checklistsCollection.findOne({ name: newName, user });
        res.json(updated);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a checklist
app.delete("/api/checklists/:name", async (req, res) => {
    const { name } = req.params;
    const { user } = req.body;
    if (!user) return res.status(400).json({ error: "User required" });

    try {
        await checklistsCollection.deleteOne({ name, user });
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// Add a task
app.post("/api/checklists/:name/tasks", async (req, res) => {
    const { name } = req.params;
    const { text, user } = req.body;
    if (!text || !user) return res.status(400).json({ error: "Task text and user required" });

    try {
        await checklistsCollection.updateOne({ name, user }, { $push: { tasks: { text, done: false } } });
        const updated = await checklistsCollection.findOne({ name, user });
        res.json(updated);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// Edit a task
app.put("/api/checklists/:name/tasks/:index/edit", async (req, res) => {
    const { name, index } = req.params;
    const idx = Number(index);
    const { text, user } = req.body;
    if (!text || !user) return res.status(400).json({ error: "Text and user required" });

    try {
        const checklist = await checklistsCollection.findOne({ name, user });
        if (!checklist || !checklist.tasks[idx]) return res.status(404).json({ error: "Task not found" });

        checklist.tasks[idx].text = text;
        await checklistsCollection.updateOne({ name, user }, { $set: { tasks: checklist.tasks } });
        res.json(checklist);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a task
app.delete("/api/checklists/:name/tasks/:index", async (req, res) => {
    const { name, index } = req.params;
    const idx = Number(index);
    const { user } = req.body;
    if (!user) return res.status(400).json({ error: "User required" });

    try {
        const checklist = await checklistsCollection.findOne({ name, user });
        if (!checklist || !checklist.tasks[idx]) return res.status(404).json({ error: "Task not found" });

        checklist.tasks.splice(idx, 1);
        await checklistsCollection.updateOne({ name, user }, { $set: { tasks: checklist.tasks } });
        res.json(checklist);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// Toggle a task done/undone
app.put("/api/checklists/:name/tasks/:index", async (req, res) => {
    const { name, index } = req.params;
    const idx = Number(index);
    const { user } = req.body;
    if (!user) return res.status(400).json({ error: "User required" });

    try {
        const checklist = await checklistsCollection.findOne({ name, user });
        if (!checklist || !checklist.tasks[idx]) return res.status(404).json({ error: "Task not found" });

        checklist.tasks[idx].done = !checklist.tasks[idx].done;
        await checklistsCollection.updateOne({ name, user }, { $set: { tasks: checklist.tasks } });
        res.json(checklist);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
