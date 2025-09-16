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


