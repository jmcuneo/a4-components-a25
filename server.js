// server.js
const express = require("express");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let db, collection;

// ----- MongoDB -----
const client = new MongoClient(process.env.MONGO_URI);
client.connect()
  .then(() => {
    db = client.db("bucketbuddy");
    collection = db.collection("items");
    console.log("✅ Connected to MongoDB");
  })
  .catch(err => console.error("❌ MongoDB connection failed:", err));

// ----- Sessions -----
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change-me",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client,
      dbName: "bucketbuddy",
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// ----- Passport (GitHub OAuth) -----
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const user = { id: profile.id, username: profile.username };
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(passport.initialize());
app.use(passport.session());

// ----- Auth Routes -----
app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login.html" }),
  (req, res) => {
    res.redirect("/"); // after login → React app
  }
);

app.post("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/login.html");
    });
  });
});

// ----- Middleware -----
function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.status(401).send("Not authorized. Please log in at /login.html");
}

// ----- API Routes -----
app.get("/api/results", ensureLoggedIn, async (req, res) => {
  try {
    const items = await collection.find({ userId: req.user.id }).toArray();
    res.json(items);
  } catch (err) {
    res.status(500).send("Error fetching items: " + err);
  }
});

app.post("/api/results", ensureLoggedIn, async (req, res) => {
  try {
    const { title, category, priority, targetDate } = req.body;
    if (!title || !category || !priority) {
      return res.status(400).send("Missing fields");
    }
    const newItem = {
      userId: req.user.id,
      title,
      category,
      priority,
      targetDate,
      addedAt: new Date(),
      completed: false,
    };
    const result = await collection.insertOne(newItem);
    res.json({ ...newItem, _id: result.insertedId });
  } catch (err) {
    res.status(500).send("Error adding item: " + err);
  }
});

app.put("/api/results/:id", ensureLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await collection.updateOne(
      { _id: new ObjectId(id), userId: req.user.id },
      { $set: { completed: true } }
    );
    if (result.modifiedCount === 0) return res.status(404).send("Item not found");
    res.send("Item marked complete");
  } catch (err) {
    res.status(500).send("Error updating item: " + err);
  }
});

app.delete("/api/results/:id", ensureLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await collection.deleteOne({ _id: new ObjectId(id), userId: req.user.id });
    if (result.deletedCount === 0) return res.status(404).send("Item not found");
    res.send("Item deleted");
  } catch (err) {
    res.status(500).send("Error deleting item: " + err);
  }
});

// ----- Serve React Frontend -----
const reactBuildPath = path.join(__dirname, "client", "dist");
app.use(express.static(reactBuildPath));

// keep login.html separate
app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// fallback → React index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(reactBuildPath, "index.html"));
});

// ----- Start -----
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
