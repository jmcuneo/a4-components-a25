import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import serverless from 'serverless-http';
import {fileURLToPath} from 'url';

// create express server
const server = express();

// Load environment variables from .env file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path: path.join(__dirname, ".env")});

// use cors to allow requests from any origin
server.use(cors())

// load mongo uri from environment variable
const mongoUri = process.env.MONGODB_URI as string;
if (!mongoUri) {
    console.error('MONGODB_URI is not defined in environment variables')
    process.exit(1)
}

// define mongoose schema and model
const tableSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    dob: Date,
    age: Number,
    gender: String,
    state: String,
    email: {type: String, unique: true}
})



// create mongoose model
const Table = mongoose.model('Table', tableSchema)

// attempt to connect to mongo and start server
async function main() {
    try {
        await mongoose.connect(mongoUri)
        console.log('Connected to MongoDB')
    } catch (e) {
        console.error('Failed to connect to MongoDB', e)
        process.exit(1)
    }

    // parse json request bodies
    server.use(express.json())

    // form submission endpoint
    server.post('/api/submit', async (req, res) => {
        const {firstName, lastName, dob, gender, state, email} = req.body
        console.log(req.body)
        // Return 400 if any required field is missing
        if (!firstName || !lastName || !dob || !gender || !state || !email) {
            //return res.status(400).json({message: 'Missing required fields'})
        }
        const age = new Date().getFullYear() - new Date(dob).getFullYear()
        const newEntry = new Table({firstName, lastName, dob, age, gender, state, email})

        try {
            await newEntry.save()
            res.status(200).json({message: 'Data submitted successfully'})
        } catch (e) {
            res.status(500).json({message: 'Failed to submit data', error: e})
        }

    })

    // todo: implement update endpoint
    server.post('/api/update', async (req, res) => {
        const {firstName, lastName, email} = req.body
        if (!firstName || !lastName || !email) {
            return res.status(400).json({message: 'Missing required fields'})
        }
        try {
            const entry = await Table.findOne({email})
            if (!entry) {
                return res.status(404).json({message: 'Entry not found'})
            }
            entry.firstName = firstName
            entry.lastName = lastName
            await entry.save()
            res.status(200).json({message: 'Data updated successfully'})
        } catch (e) {
            res.status(500).json({message: 'Failed to update data', error: e})
        }
    });

    server.post('/api/delete', async (req, res) => {
        const {email} = req.body
        if (!email) {
            return res.status(400).json({message: 'Missing email field'})
        }
        try {
            const entry = await Table.findOneAndDelete({email})
            if (!entry) {
                return res.status(404).json({message: 'Entry not found'})
            }
            res.status(200).json({message: 'Data deleted successfully'})
        } catch (e) {
            res.status(500).json({message: 'Failed to delete data', error: e})
        }
    });


    // send back user info based on email query parameter
    server.get(`/api/my-info`, async (req, res) => {
        const email = req.query.email as string
        if (!email) {
            return res.status(400).json({message: 'Missing email parameter'})
        }
        try {
            const entry = await Table.findOne({email})
            if (!entry) {
                return res.status(404).json({message: 'Entry not found'})
            }
            res.status(200).json(entry)
        } catch (e) {
            res.status(500).json({message: 'Failed to fetch data', error: e})
        }
    })

}

// vercel is serverless so I have to do this
if (process.env.PRODUCTION === 'false') {
    server.listen(process.env.PORT || 3000, () => {
        console.log('Server is running on port', process.env.PORT || 3000)
    })
}
export default serverless(server)


// catch any errors starting the server
main().catch((err) => {
    console.error('Fatal error starting server', err)
    process.exit(1)
})
