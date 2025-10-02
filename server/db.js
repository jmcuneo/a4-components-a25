const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000
});

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db();
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

function getDatabase() {
  if (!db) {
    throw new Error('Database not connected.');
  }
  return db;
}

module.exports = {
  connectToDatabase,
  getDatabase,
  get db() {
    return db;
  }
};