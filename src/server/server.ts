import express from 'express'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv';

const app = express()
const port = 3000

// load mongo uri from .env
dotenv.config();
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
    console.error('MONGODB_URI is not defined in environment variables')
    process.exit(1)
}

// connect to mongodb atlas
try {
    await mongoose.connect(mongoUri)
} catch (e) {
    console.error('Failed to connect to MongoDB', e)
    process.exit(1)
}

const tableSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    dob: Date,
    age: Number,
    gender: String,
    state: String,
    email: String,
    phone: String,
    comments: String
})

const Table = mongoose.model('Table', tableSchema)



app.use(express.json())

app.post('/api/submit', async (req, res) => {
    const { firstName, lastName, dob, gender, state, email, phone, comments } = req.body
    if (firstName && lastName && dob && gender && state && email && phone) {
        return res.status(400).json({ message: 'Missing required fields' })
    }
    const age = new Date().getFullYear() - new Date(dob).getFullYear()
    const newEntry = new Table({ firstName, lastName, dob, age, gender, state, email, phone, comments })

    try {
        await newEntry.save()
        res.status(200).json({ message: 'Data submitted successfully' })
    } catch (e) {
        res.status(500).json({ message: 'Failed to submit data', error: e })
    }

})

