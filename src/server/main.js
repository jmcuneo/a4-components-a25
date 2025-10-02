import express from 'express'
import ViteExpress from 'vite-express'

const app = express()

//task, date, overdue status
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
  checkOverdue()
  res.json(appdata)
})

// add new task
app.post('/add', (req, res) => {

  const newTask = {
    "Task": req.body.name || req.body.Task,
    "Duedate": parseInt(req.body.Duedate) || 99999999,
    "Overdue": false
  }

  appdata.push(newTask)

  // update overdues
  checkOverdue()

  res.json(appdata)
})

app.post('/change', function (req, res) {
  const idx = appdata.findIndex(v => v.Task === req.body.name)
  appdata[idx].completed = req.body.completed

  checkOverdue()
  res.json(appdata)
})

ViteExpress.listen(app, 3000)