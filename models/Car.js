import mongoose from 'mongoose'

const carSchema = new mongoose.Schema({
    model: { type: String, required: true },
    year: Number,
    mpg: Number,
    age: Number,
    owner: { type: String, required: true } // GitHub user ID
})

const Car = mongoose.model('Car', carSchema)
export default Car
