// db.js
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = `mongodb+srv://${process.env.USERNM}:${process.env.PASS}@${process.env.HOST}/?retryWrites=true&w=majority&appName=cluster-muah`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db = null;

async function connectDB() {
  if (db) return db; // Return existing connection if already connected
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    db = client.db("tasks");
    return db;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

function getCollection(collectionName) {
  if (!db) throw new Error("Database not connected yet");
  return db.collection(collectionName);
}

export { connectDB, getCollection, client };
// server/db.js