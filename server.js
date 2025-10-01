import express from  'express'
import ViteExpress from 'vite-express'

const app = express()

const appdata = [
  {date: "2024-05-20", thing: "lunch", done: true, dayRemaining: 0, id: 0}, 
]

let ID = 1

app.use( express.json() )

app.get( '/data', (req, res) => {
  res.json({todos: appdata})
})

app.post( '/add', (req, res) => {
  const item = req.body
  
  const today = new Date()
  const dueDate = new Date(item.date)
  let dayRemaining
  if(item.done){
    dayRemaining = "Done"
  } else if(dueDate < today){
    dayRemaining = "Overdue"
  } else {
    const diffTime = Math.abs(dueDate - today)
    dayRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
  item.dayRemaining = dayRemaining
  item.id = ID
  ID++
  item.done = false
  appdata.push( item )
  console.log( item )
  res.json({ todos: appdata })
})

app.delete( '/delete/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = appdata.findIndex(item => item.id === id)
  if(index !== -1){
    appdata.splice(index, 1)
  }
  res.json({ todos: appdata })
})

app.put( '/update/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = appdata.findIndex(item => item.id === id)
  if(index !== -1){
    appdata[index].done = true
    appdata[index].dayRemaining = "Done"
  }
  res.json({ todos: appdata })
})

ViteExpress.listen( app, 3000 )