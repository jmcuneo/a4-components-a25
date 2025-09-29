import "dotenv/config";
import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import pkg from "express-openid-connect";
const { auth, requiresAuth } = pkg;
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

// --- Auth0 config ---
const config = {
  authRequired: false,       // don't force redirect to login
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
};

// --- Middleware ---
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(auth(config));

// --- MongoDB ---
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: { version: ServerApiVersion.v1 },
});

let db, checklistsCollection;

async function connectDB() {
  await client.connect();
  db = client.db("bucketdb");
  checklistsCollection = db.collection("checklists");
  console.log("Connected to MongoDB!");
}

connectDB().catch(console.error);

// --- API routes ---

app.get("/api/me", (req, res) => {
  if (!req.oidc.isAuthenticated()) return res.status(401).json({ error: "Not logged in" });
  res.json({ user: req.oidc.user });
});

app.get("/api/checklists", requiresAuth(), async (req, res) => {
  const userId = req.oidc.user.sub;
  const checklists = await checklistsCollection.find({ userId }).toArray();
  res.json(checklists);
});

app.post("/api/checklists", requiresAuth(), async (req, res) => {
  const { name } = req.body;
  const userId = req.oidc.user.sub;
  const newChecklist = { name, userId, tasks: [] };
  await checklistsCollection.insertOne(newChecklist);
  res.json(newChecklist);
});

// Add your other routes here similarly...

// --- Start server ---
app.listen(port, () => console.log(`Server running on port ${port}`));
