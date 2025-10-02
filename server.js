require("dotenv").config();

const bcrypt = require("bcrypt");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

const mongoUrl = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;
const sessionSecret = process.env.SESSION_SECRET;

if (!mongoUrl || !dbName || !sessionSecret) {
  console.error("Missing required environment variables from .env");
  process.exit(1);
}

let db, users, rsvps;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(express.static(path.join(__dirname, "client", "dist")));

MongoClient.connect(mongoUrl)
  .then((client) => {
    db = client.db(dbName);
    users = db.collection("users");
    rsvps = db.collection("rsvps");
    console.log("Connected to MongoDB Atlas");

    app.listen(port, () =>
      console.log(`Server running on http://localhost:${port}`)
    );
  })
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await users.findOne({ username });

  if (!user) return res.status(400).json({ error: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Incorrect password" });

  req.session.user = { username };
  res.json({ success: true, username });
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const existing = await users.findOne({ username });

  if (existing) return res.status(400).json({ error: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  await users.insertOne({ username, password: hashed });

  req.session.user = { username };
  res.json({ success: true, username });
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

app.get("/session", (req, res) => {
  if (req.session.user) res.json({ loggedIn: true, user: req.session.user });
  else res.json({ loggedIn: false });
});

function requireLogin(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });
  next();
}

app.get("/results", requireLogin, async (req, res) => {
  try {
    const username = req.session.user.username;
    const data = await rsvps.find({ username }).toArray();
    res.json(data);
  } catch (err) {
    console.error("Error fetching results:", err);
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

app.post("/submit", requireLogin, async (req, res) => {
  try {
    const numAdditional = parseInt(req.body.numAdditional) || 0;
    const totalGuests = numAdditional + 1;

    const rsvp = {
      yourname: req.body.yourname,
      event: req.body.event,
      numAdditional,
      totalGuests,
      phoneNumber: req.body.phoneNumber,
      emailAddress: req.body.emailAddress,
      username: req.session.user.username,
    };

    await rsvps.insertOne(rsvp);
    res.json({ success: true });
  } catch (err) {
    console.error("Error saving RSVP:", err);
    res.status(500).json({ success: false, error: "Failed to save RSVP" });
  }
});

app.put("/update/:id", requireLogin, async (req, res) => {
  const id = req.params.id;
  const { yourname, event, totalGuests, phoneNumber, emailAddress } = req.body;

  try {
    await rsvps.updateOne(
      { _id: new ObjectId(id), username: req.session.user.username },
      { $set: { yourname, event, totalGuests, phoneNumber, emailAddress } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Update RSVP error:", err);
    res.status(500).json({ error: "Failed to update RSVP" });
  }
});

app.post("/delete", requireLogin, async (req, res) => {
  const { id } = req.body;
  try {
    await rsvps.deleteOne({ _id: new ObjectId(id), username: req.session.user.username });
    const data = await rsvps.find({ username: req.session.user.username }).toArray();
    res.json(data);
  } catch (err) {
    console.error("Delete RSVP error:", err);
    res.status(500).json({ error: "Failed to delete RSVP" });
  }
});

app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

