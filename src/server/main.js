import express from "express"
import ViteExpress from "vite-express"
import {MongoClient, ObjectId, ServerApiVersion} from "mongodb"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(express.json())

const uri = process.env.MONGO_URI
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

let tasksCollection;

async function initDB() {
  try {
    await client.connect()
    const db = client.db('todo')
    tasksCollection = db.collection('tasks')
    usersCollection = db.collection('users')
    console.log("Successfully connected.")
  } catch (err) {
    console.log("DB connection error: ", err)
  }
}
initDB()


app.get("/results", async(req, res) => {
  const {username} = req.query
  const tasks = await tasksCollection.find({username}).toArray()
  res.json(tasks)
})

app.post("/submit", async(req, res) => {
  const {username, task, priority} = req.body

  const creation = new Date()
  let deadline = new Date(creation)

  if (priority === "high") {
    deadline.setDate(deadline.getDate() + 1)
  } else if (priority === "medium") {
    deadline.setDate(deadline.getDate() + 2)
  } else if (priority === "low") {
    deadline.setDate(deadline.getDate() + 3)
  }

  const newTask = {
    username,
    task,
    priority,
    creation: creation.toLocaleDateString(),
    deadline: deadline.toLocaleDateString()
  }

  await tasksCollection.insertOne(newTask)
  res.status(200).send('added')
})

app.post('/delete', async (req, res) => {
  const { id, username } = req.body
  await tasksCollection.deleteOne({_id: new ObjectId(id), username})

  res.status(200).send('deleted')
})

app.post('/modify', async (req, res) => {
  const { id, username, newTask, newPriority } = req.body
  const toUpdate = await tasksCollection.findOne({ _id: new ObjectId(id), username })

  if (!toUpdate) {
    return res.status(400).send('Task does not exist')
  }

  toUpdate.task = newTask
  toUpdate.priority = newPriority

  let creation = new Date(toUpdate.creation)
  let deadline = new Date(creation)

  if (newPriority === "high") {
    deadline.setDate(deadline.getDate() + 1)
  } else if (newPriority === "medium") {
    deadline.setDate(deadline.getDate() + 2)
  } else if (newPriority === "low") {
    deadline.setDate(deadline.getDate() + 3)
  }

  await tasksCollection.updateOne(
    { _id: new ObjectId(id), username },
    { $set: { task: newTask, priority: newPriority, deadline: deadline.toLocaleDateString() } }
  )

  res.status(200).send('modified')
})

app.post('/login', async(req, res) => {
  const {username, password} = req.body

  let user = await client.db('todo').collection('users').findOne({username})

  if (!user) {
    await client.db('todo').collection('users').insertOne({username, password})
    user = {username, password}
    return res.status(200).json({"message": "Account successfully created and logged in."})
  }

  if (user.password !== password) {
    return res.status(400).json({"message": "Incorrect credentials."})
  }

  return res.status(200).json({"message": ""})
})

app.use(express.static("public"))
ViteExpress.listen(app, process.env.PORT || 3000)