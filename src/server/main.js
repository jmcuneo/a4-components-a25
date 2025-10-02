import express from 'express'
import ViteExpress from 'vite-express'

const app = express()

// Updated data structure to include dates and overdue status
const appdata = [
  { "Task": "Dishes", "Duedate": 19991212, "Overdue": false },
  { "Task": "Homework", "Duedate": 20261210, "Overdue": true },
  { "Task": "Fix car", "Duedate": 20250916, "Overdue": false }
]

app.use(express.json())

//check for overdues
const checkOverdue = function () {
  // get current day
  const currentdate = new Date()
  const month = currentdate.getMonth() + 1
  const day = currentdate.getDate()
  const year = currentdate.getFullYear()

  //format date as yyyymmdd
  const formattedcurrentdate = year * 10000 + month * 100 + day

  //check if each task is overdue
  for (let i = 0; i < appdata.length; i++) {
    if (appdata[i]["Duedate"] < formattedcurrentdate) {
      appdata[i]["Overdue"] = true
    } else {
      appdata[i]["Overdue"] = false
    }
  }
}

app.get('/read', (req, res) => {
  checkOverdue() // Update overdue status before sending
  res.json(appdata)
})

app.post('/add', (req, res) => {
  console.log('Add request body:', req.body) // Debug log
  let check = false

  // Find if task has already been created
  for (let i = 0; i < appdata.length; i++) {
    if (appdata[i]["Task"] === req.body.name || appdata[i]["Task"] === req.body.Task) {
      // Delete existing task
      appdata.splice(i, 1)
      check = true
      break
    }
  }

  if (!check) {
    // Add new task - handle both formats (name/Task and dueDate/Duedate)
    const newTask = {
      "Task": req.body.name || req.body.Task,
      "Duedate": parseInt(req.body.dueDate || req.body.Duedate) || 99999999,
      "Overdue": false
    }
    appdata.push(newTask)
  }

  // Update overdue status
  checkOverdue()

  res.json(appdata)
})

app.post('/change', function (req, res) {
  console.log('Change request body:', req.body) // Debug log
  const idx = appdata.findIndex(v => v.Task === req.body.name)
  if (idx !== -1) {
    appdata[idx].completed = req.body.completed
  }

  checkOverdue() // Update overdue status
  res.json(appdata)
})

ViteExpress.listen(app, 3000)