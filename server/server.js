// Express server setup for task management
const express = require('express');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: path.join(__dirname, 'config.env') });

const app = express();
const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri);
let tasksCollection;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser(process.env.SESSION_SECRET || 'dev_secret'));

// In-memory session store (for demo purposes; use a persistent store in production)
const sessions = {};

// Helper: hash password
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Helper: generate session token
function generateSessionToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Middleware: require authentication
async function requireAuth(req, res, next) {
    const token = req.signedCookies.session;
    if (!token || !sessions[token]) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    req.username = sessions[token];
    next();
}

// Function to calculate derived field [Baseline Req] (deadline based on priority and creation date)
function calculateDeadline(creation_date, priority) {
    const createDate = new Date(creation_date);
    let daysToAdd;

    switch(priority) { // Determine days to add based on priority
        case 'high': daysToAdd = 3; break;
        case 'medium': daysToAdd = 7; break;
        case 'low': daysToAdd = 14; break;
        default: daysToAdd = 7;
    }
    
    createDate.setDate(createDate.getDate() + daysToAdd);
    return createDate.toISOString().split('T')[0]; 
}

async function startServer() {
    try {
        await client.connect();
        const db = client.db('Webware');
        tasksCollection = db.collection('tasks');
        const usersCollection = db.collection('users');

        // Serve index.html and results.html explicitly (for direct navigation)
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../public', 'index.html'));
        });
        app.get('/results', (req, res) => {
            res.sendFile(path.join(__dirname, '../public', 'results.html'));
        });

        // Auth endpoints
        app.post('/login', express.json(), async (req, res) => {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password required' });
            }
            let user = await usersCollection.findOne({ username });
            if (!user) {
                // Create new user
                const hash = hashPassword(password);
                await usersCollection.insertOne({ username, password: hash });
                user = { username, password: hash };
                // Inform user account created
                // (client should display this message)
            }
            if (user.password !== hashPassword(password)) {
                return res.status(401).json({ error: 'Incorrect password' });
            }
            // Create session
            const token = generateSessionToken();
            sessions[token] = username;
            res.cookie('session', token, { httpOnly: true, signed: true });
            res.json({ success: true, username });
        });

        app.post('/logout', (req, res) => {
            const token = req.signedCookies.session;
            if (token) delete sessions[token];
            res.clearCookie('session');
            res.json({ success: true });
        });

        // API routes (all require auth)
        app.get('/api/tasks', requireAuth, async (req, res) => {
            try {
                const tasks = await tasksCollection.find({ username: req.username }).toArray();
                res.json(tasks);
            } catch (err) {
                res.status(500).json({ error: 'Failed to fetch tasks' });
            }
        });

        app.post('/api/tasks', requireAuth, async (req, res) => {
            const data = req.body;
            const newTask = {
                username: req.username,
                task: data.task,
                priority: data.priority,
                creation_date: data.creation_date,
                deadline: calculateDeadline(data.creation_date, data.priority)
            };
            try {
                const result = await tasksCollection.insertOne(newTask);
                newTask._id = result.insertedId;
                res.json(newTask);
            } catch (err) {
                res.status(500).json({ error: 'Failed to add task' });
            }
        });

        app.delete('/api/tasks/:id', requireAuth, async (req, res) => {
            try {
                const id = req.params.id;
                const result = await tasksCollection.deleteOne({ _id: new ObjectId(id), username: req.username });
                if (result.deletedCount === 0) {
                    return res.status(404).json({ error: 'Task not found' });
                }
                res.json({ success: true });
            } catch (err) {
                res.status(500).json({ error: 'Failed to delete task' });
            }
        });

        app.put('/api/tasks/:id', requireAuth, async (req, res) => {
            try {
                const id = req.params.id;
                const data = req.body;
                const updatedTask = {
                    task: data.task,
                    priority: data.priority,
                    creation_date: data.creation_date,
                    deadline: calculateDeadline(data.creation_date, data.priority)
                };
                const result = await tasksCollection.findOneAndUpdate(
                    { _id: new ObjectId(id), username: req.username },
                    { $set: updatedTask },
                    { returnDocument: 'after' }
                );
                if (result.value) {
                    res.json(result.value);
                } else {
                    res.status(404).json({ error: 'Task not found' });
                }
            } catch (err) {
                res.status(500).json({ error: 'Failed to update task' });
            }
        });

        // 404 handler
        app.use((req, res) => {
            res.status(404).send('Not Found');
        });

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
}

startServer();
