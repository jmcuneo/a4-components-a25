import express from "express";
import ViteExpress from "vite-express";

const app = express()
app.use(express.json())


// const appdata = [
//   { "model": "toyota", "year": 1999, "mpg": 23 },
//   { "model": "honda", "year": 2004, "mpg": 30 },
//   { "model": "ford", "year": 1987, "mpg": 14} 
// ]

let groceryList = []

// POST /submit --> add new item
app.post("/submit", (req, res) => {
  const incoming = req.body;

  const now = new Date();
  const expDate = new Date(incoming.expirationDate);
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntilExpiration = Math.ceil((expDate - now) / msPerDay);

  const groceryItemWithExpiry = { 
    ...incoming, daysUntilExpiration }
    
  groceryList.push(groceryItemWithExpiry)
  res.json(groceryList);
  } 

)

// POST /delete -->a delete item
app.post("/delete", (req, res) => {
  const { index } = req.body;
  if (typeof index === "number" && index >= 0 && index < groceryList.length) { 
    groceryList.splice(index, 1)
  }
  res.json(groceryList);
})

// POST /edit --> edit item
app.post("/edit", (req, res) => {
  const { index, item, category, expirationDate } = req.body

  if (typeof index === "number" && index >= 0 && index < groceryList.length) { 
    const now = new Date()
    const expDate = new Date(expirationDate)
    const msPerDay = 1000 * 60 * 60 * 24
    const daysUntilExpiration = Math.ceil((expDate - now) / msPerDay)

    groceryList[index] = { item, category, expirationDate, daysUntilExpiration } 
  }
  
  res.json(groceryList)
})

app.get("/read", (req, res) => res.json(groceryList))
ViteExpress.listen(app, 3000, () => 
  console.log("Server + Vite running on http://localhost:3000")
)