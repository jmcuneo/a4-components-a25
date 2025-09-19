import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import next from 'next';
import {fileURLToPath} from 'url';

const dev = process.env.NODE_ENV !== "production";
const app = next({dev});
const handle = app.getRequestHandler();
const server = express();
const port = Number(process.env.PORT) || 4242


const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path: path.join(__dirname, ".env")});

server.use(cors())

const mongoUri = process.env.MONGO_URI as string;
if (!mongoUri) {
    console.error('MONGO_URI is not defined in environment variables')
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

async function main() {
    try {
        await mongoose.connect(mongoUri)
        console.log('Connected to MongoDB')
    } catch (e) {
        console.error('Failed to connect to MongoDB', e)
        process.exit(1)
    }

    //await app.prepare()

    server.use(express.json())

    server.post('/api/submit', async (req, res) => {
        const {firstName, lastName, dob, gender, state, email, phone, comments} = req.body
        console.log(req.body)
        // Return 400 if any required field is missing
        if (!firstName || !lastName || !dob || !gender || !state || !email || !phone) {
            //return res.status(400).json({message: 'Missing required fields'})
        }
        const age = new Date().getFullYear() - new Date(dob).getFullYear()
        const newEntry = new Table({ firstName, lastName, dob, age, gender, state, email, phone, comments })

        try {
            await newEntry.save()
            res.status(200).json({message: 'Data submitted successfully'})
        } catch (e) {
            res.status(500).json({message: 'Failed to submit data', error: e})
        }

    })

    server.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}

main().catch((err) => {
    console.error('Fatal error starting server', err)
    process.exit(1)
})
