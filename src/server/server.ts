import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import path from 'path';
import {fileURLToPath} from 'node:url';
import cors from 'cors';
const app = express()
const port = 4242

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: path.join(__dirname, ".env") });

app.use(cors())

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.log(mongoUri);
    console.error('MONGO_URI is not defined in environment variables')
    process.exit(1)
}

// connect to mongodb atlas
try {
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')
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
    const {firstName, lastName, dob, gender, state, email, phone, comments} = req.body
    console.log(req.body)
    if (firstName && lastName && dob && gender && state && email && phone) {
        return res.status(400).json({message: 'Missing required fields'})
    }
    const age = new Date().getFullYear() - new Date(dob).getFullYear()
    // const newEntry = new Table({ firstName, lastName, dob, age, gender, state, email, phone, comments })

    try {
        //await newEntry.save()
        res.status(200).json({message: 'Data submitted successfully'})
    } catch (e) {
        res.status(500).json({message: 'Failed to submit data', error: e})
    }

})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

