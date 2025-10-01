const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carInventory', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from your original public directory (for CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'frontend/build')));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use('/auth', authRoutes);
app.use('/api/cars', carRoutes);

// API route handlers
app.get('/', (req, res) => {
    if (req.session.user) {
        // If user is logged in, serve the React app
        res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    } else {
        // If not logged in, also serve React app (it will show login page)
        res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    }
});

app.get('/app', (req, res) => {
    if (!req.session.user) {
        // If not authenticated, redirect to home which will show login
        return res.redirect('/');
    }
    // Serve React app for authenticated users
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Catch all handler - send back React's index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`React app will be served from the frontend/build directory`);
});