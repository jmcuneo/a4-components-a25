import ViteExpress from 'vite-express'

import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt'; // if you used bcryptjs: import bcrypt from 'bcryptjs';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

const app  = express(); 

// globals so routes can use them after connect()
let client;
let db;
let Users;
let Orders;

// middleware
app.use(express.static('../../dist'));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'devsecret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true }, // consider maxAge/sameSite/secure in prod
  })
);

// MongoDB connection
const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOST}/?retryWrites=true&w=majority&appName=ClusterA3`;

client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

async function run() {
  await client.connect();
  await client.db('admin').command({ ping: 1 });
  console.log('Pinged your deployment. You successfully connected to MongoDB!');

  const dbName = process.env.MONGO_DB || 'a3';
  db = client.db(dbName);

  Users = db.collection('users');
  Orders = db.collection('orders');
  await Users.createIndex({ username: 1 }, { unique: true });
  console.log('Created orders and users collection');
}
run().catch(err => {
  console.error('Mongo connect failed:', err);
  process.exit(1);
});

// derived field (prep time in minutes)
function getPrepTimeInMin(drink, food) {
  let mins = 1;
  if (drink) {
    const d = drink.toLowerCase();
    if (d.includes('latte') || d.includes('tea')) mins += 3;
    else if (d.includes('hot')) mins += 2;
    else if (d.includes('cold')) mins += 1;
    else if (d.includes('refresher')) mins += 4;
    else if (d.includes('frap')) mins += 5;
  }
  if (food) {
    const f = food.toLowerCase();
    if (f.includes('sandwich')) mins += 4;
    else if (f.includes('bagel')) mins += 2;
    else if (f.includes('cake')) mins += 3;
    else if (f.includes('pastry')) mins += 1;
  }
  return mins;
}

function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'not authenticated' });
  next();
}

// AUTH
app.post('/auth/login', async (req, res) => {
  const { username = '', password = '' } = req.body || {};
  const u = username.trim();
  if (!u || !password) return res.status(400).json({ error: 'username and password required' });

  let user = await Users.findOne({ username: u });

  if (!user) {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await Users.insertOne({ username: u, passwordHash, createdAt: new Date() });
    req.session.userId = result.insertedId.toString();
    console.log('Created new user', u);
    return res.json({ ok: true, created: true, username: u });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });

  req.session.userId = user._id.toString();
  console.log('User logged in:', u);
  res.json({ ok: true, created: false, username: u });
});

app.get('/auth/me', (req, res) => {
  res.json({ authenticated: !!req.session.userId, userId: req.session.userId || null });
});

app.post('/auth/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/auth/profile', requireAuth, async (req, res) => {
  const userId = new ObjectId(req.session.userId);
  const user = await Users.findOne({ _id: userId }, { projection: { passwordHash: 0 } });
  if (!user) return res.status(404).json({ error: 'user not found' });
  res.json({ ok: true, user });
});

// ORDERS
app.get('/results', requireAuth, async (req, res) => {
  const userId = new ObjectId(req.session.userId);
  const all = await Orders.find({ userId }).sort({ createdOn: -1 }).toArray();
  res.json({ data: all });
});

app.post('/submit', requireAuth, async (req, res) => {
  const userId = new ObjectId(req.session.userId);
  const { yourname = '', yourdrink = '', yourfood = '' } = req.body || {};
  const doc = {
    userId,
    name: yourname.trim(),
    drink: yourdrink.trim(),
    food: yourfood.trim(),
    createdOn: new Date(),
    readyInMin: getPrepTimeInMin(yourdrink, yourfood),
  };
  await Orders.insertOne(doc);
  const all = await Orders.find({ userId }).sort({ createdOn: -1 }).toArray();
  res.json({ data: all });
});

app.post('/edit', requireAuth, async (req, res) => {
  const userId = new ObjectId(req.session.userId);
  const { id, yourname, yourdrink, yourfood } = req.body || {};
  if (!id) return res.status(400).json({ error: 'id required' });

  const _id = new ObjectId(id);
  const existing = await Orders.findOne({ _id, userId });
  if (!existing) return res.status(404).json({ error: 'order not found' });

  const updated = {
    name:  typeof yourname  === 'string' ? yourname.trim()  : existing.name,
    drink: typeof yourdrink === 'string' ? yourdrink.trim() : existing.drink,
    food:  typeof yourfood  === 'string' ? yourfood.trim()  : existing.food,
  };
  updated.readyInMin = getPrepTimeInMin(updated.drink, updated.food);

  await Orders.updateOne({ _id, userId }, { $set: updated });
  const all = await Orders.find({ userId }).sort({ createdOn: -1 }).toArray();
  res.json({ data: all });
});

app.post('/delete', requireAuth, async (req, res) => {
  const userId = new ObjectId(req.session.userId);
  const { id } = req.body || {};
  if (!id) return res.status(400).json({ error: 'id required' });

  await Orders.deleteOne({ _id: new ObjectId(id), userId });
  const all = await Orders.find({ userId }).sort({ createdOn: -1 }).toArray();
  res.json({ data: all });
});

ViteExpress.listen( app, 3000 )
