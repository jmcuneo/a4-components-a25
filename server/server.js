require('dotenv').config();

var express = require('express');
var router = express.Router();
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const { connectToDatabase } = require('./db');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for HTTPS detection on Render
app.set('trust proxy', 1);

// CORS configuration
if (process.env.NODE_ENV === 'production') {
  // In production, allow requests from the same origin
  app.use(cors({
    origin: true,
    credentials: true
  }));
} else {
  // In development, allow requests from Vite dev server
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/', authRouter);

// Serve React app for any non-API routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Start server after database connection
async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();