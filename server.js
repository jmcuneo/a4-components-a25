import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import Car from './models/Car.js'

dotenv.config()

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self'; img-src 'self'; connect-src 'self'")
  next()
})

mongoose.connect(process.env.MONGO_URI)
app.use(express.json())

app.get('/read', async (req, res) => {
  const cars = await Car.find({})
  res.json(cars)
})

app.post('/submit', async (req, res) => {
  const { model, year, mpg, age } = req.body
  const newCar = new Car({ model, year, mpg, age })
  await newCar.save()
  const cars = await Car.find({})
  res.json(cars)
})

app.put('/submit', async (req, res) => {
  const { model, year, mpg, age } = req.body
  await Car.findOneAndUpdate({ model }, { year, mpg, age })
  const cars = await Car.find({})
  res.json(cars)
})

app.delete('/submit', async (req, res) => {
  const { model } = req.body
  await Car.deleteOne({ model })
  const cars = await Car.find({})
  res.json(cars)
})

app.use(express.static(path.join(__dirname, '/src/client/dist'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript')
    }
  }
}))

app.use((req, res, next) => {
  const requestedPath = path.join(__dirname, '/src/client/dist', req.url)
  fs.access(requestedPath, fs.constants.F_OK, (err) => {
    if (!err) return next()
    res.sendFile(path.join(__dirname, '/src/client/dist/index.html'))
  })
})

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
