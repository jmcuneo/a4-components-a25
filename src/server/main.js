import express from "express";
import ViteExpress from "vite-express";

const app = express();

const tasks = [
  { 
    "assignee": {
      "president": true,
      "vicepresident": false,
      "treasurer": false,
      "secretary": false
    },
    "task": "Schedule weekly meeting",
    "complete": true,
    "partnerTask": false
  },
  { 
    "assignee": {
      "president": false,
      "vicepresident": true,
      "treasurer": false,
      "secretary": false
    },
    "task": "Talk to unruly brother",
    "complete": false,
    "partnerTask": false
  },
  { 
    "assignee": {
      "president": false,
      "vicepresident": true,
      "treasurer": true,
      "secretary": false
    },
    "task": "Complete budget for the year",
    "complete": false,
    "partnerTask": true
  }
]

app.use( express.json() )



app.get( '/data', (req, res) => { res.json( tasks ) } )

app.post( '/submit', (req, res) => { 
  tasks.push( req.body )
  res.json( tasks )
})

app.post( '/update', (req, res) => {
  const idx = tasks.findIndex( v => v.task === req.body.task )
  if (idx !== -1) {
    tasks[ idx ].complete = req.body.complete
    res.json({ success: true, tasks })
  } else {
    res.status(404).json({ error: 'Task not found' })
  }
})

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
