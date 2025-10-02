// server.js
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import ViteExpress from "vite-express";

import User from "./models/User.js";
import Wrestler from "./models/Wrestler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// ---------- Connect to MongoDB ----------
mongoose
  .connect("mongodb://127.0.0.1:27017/wrestlerTracker", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ---------- Middleware ----------
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// ---------- Static assets for login ----------
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

// ---------- AUTH ROUTES ----------
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "Username already exists" });

    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: "Username already exists" });
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(401).json({ message: "Invalid username or password" });

    const match = await user.checkPassword(password);
    if (!match)
      return res.status(401).json({ message: "Invalid username or password" });

    req.session.userId = user._id;
    res.json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

// ---------- WRESTLER CRUD ROUTES ----------
app.get("/api/wrestlers", async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ message: "Not logged in" });
  const wrestlers = await Wrestler.find({ user: req.session.userId });
  res.json(wrestlers);
});

app.post("/api/wrestlers", async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ message: "Not logged in" });
  const wrestler = new Wrestler({ ...req.body, user: req.session.userId });
  await wrestler.save();
  const wrestlers = await Wrestler.find({ user: req.session.userId });
  res.json(wrestlers);
});

app.put("/api/wrestlers/:id", async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ message: "Not logged in" });
  await Wrestler.updateOne(
    { _id: req.params.id, user: req.session.userId },
    req.body
  );
  const wrestlers = await Wrestler.find({ user: req.session.userId });
  res.json(wrestlers);
});

app.delete("/api/wrestlers/:id", async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ message: "Not logged in" });
  await Wrestler.deleteOne({ _id: req.params.id, user: req.session.userId });
  const wrestlers = await Wrestler.find({ user: req.session.userId });
  res.json(wrestlers);
});

// ---------- LOGIN PAGE ----------
app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login.html"));
});

// ---------- Auth check middleware ----------
// any non-API route that isn't login.html redirects if not logged in
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  if (req.path === "/login.html") return next();
  if (!req.session.userId) return res.redirect("/login.html");
  next();
});

// ---------- Serve SPA (React build) ----------
app.use(express.static(path.join(__dirname, "client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

// ---------- START SERVER ----------
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

ViteExpress.bind(app, server);
