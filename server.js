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

// serve static files in /public (login.html lives here)
app.use(express.static(path.join(__dirname, "public")));

let db, collection;

// connect to mongo
const client = new MongoClient(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  tls: true,
  tlsAllowInvalidCertificates: true, // 👈 fix Node 22 TLS issue
});

client.connect()
  .then(() => {
    db = client.db("bucketbuddy");
    collection = db.collection("items");
    console.log("✅ mongo ok");
  })
  .catch((err) => {
    console.error("❌ mongo fail:", err);
  });

// session setup
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
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

// github login setup
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

// root route → logged in → React, else → login page
app.get("/", (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  } else {
    res.redirect("/login.html");
  }
});

// github login routes
app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login.html" }),
  (req, res) => {
    res.redirect("/"); // React app
  }
);

// logout
app.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/login.html");
    });
  });
});

// who am i (debug)
app.get("/me", (req, res) => {
  res.json({ user: req.user || null });
});

// auth middleware
function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.status(401).send("login first bro");
}

// test route
app.get("/ping", (req, res) => res.send("pong"));

// CRUD routes
app.get("/results", ensureLoggedIn, async (req, res) => {
  try {
    const items = await collection.find({ userId: req.user.id }).toArray();
    res.json(items);
  } catch (err) {
    res.status(500).send("cant get items: " + err);
  }
});

app.post("/results", ensureLoggedIn, async (req, res) => {
  try {
    const { title, category, priority, targetDate } = req.body;
    if (!title || !category || !priority) {
      return res.status(400).send("missing stuff");
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
    res.status(500).send("cant add item: " + err);
  }
});

app.put("/results/:id", ensureLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await collection.updateOne(
      { _id: new ObjectId(id), userId: req.user.id },
      { $set: { completed: true } }
    );
    if (result.modifiedCount === 0) return res.status(404).send("not found");
    res.send("done!");
  } catch (err) {
    res.status(500).send("cant update: " + err);
  }
});

app.delete("/results/:id", ensureLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await collection.deleteOne({ _id: new ObjectId(id), userId: req.user.id });
    if (result.deletedCount === 0) return res.status(404).send("not found");
    res.send("deleted");
  } catch (err) {
    res.status(500).send("cant delete: " + err);
  }
});

// serve React build
const reactBuildPath = path.join(__dirname, "client", "dist");
app.use(express.static(reactBuildPath));

// ✅ FIXED for Express 5: regex fallback
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(reactBuildPath, "index.html"));
});


// start server
app.listen(port, () => {
  console.log(`🚀 server @ http://localhost:${port}`);
});
