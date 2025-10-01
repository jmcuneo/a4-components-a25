import express from "express";
import ViteExpress from "vite-express";

const app = express();
let expenses = [];

app.use(express.json());

// return the list of expenses
app.get("/expenses", (req, res) => {
  res.json(expenses);
});

// add a new expense
app.post("/submit", (req, res) => {
  const expense = req.body;
  expense.dateAdded = new Date().toLocaleDateString("en-US");
  expenses.push(expense);
  res.json(expenses);
});

// delete an expense by index
app.post("/delete/:index", (req, res) => {
  const idx = parseInt(req.params.index, 10);
  if (!isNaN(idx) && idx >= 0 && idx < expenses.length) {
    expenses.splice(idx, 1);
  }
  res.json(expenses);
});

// optional: reset all expenses
app.post("/reset", (req, res) => {
  expenses = [];
  res.json({ message: "Expenses reset" });
});

// update an expense by index
app.post("/update/:index", (req, res) => {
  const idx = parseInt(req.params.index, 10);
  if (!isNaN(idx) && idx >= 0 && idx < expenses.length) {
    expenses[idx] = { ...expenses[idx], ...req.body };
  }
  res.json(expenses);
});

// reorder expenses
app.post("/reorder", (req, res) => {
  const { from, to } = req.body;
  if (
    from >= 0 &&
    to >= 0 &&
    from < expenses.length &&
    to < expenses.length
  ) {
    const [moved] = expenses.splice(from, 1);
    expenses.splice(to, 0, moved);
  }
  res.json(expenses);
});


ViteExpress.listen(app, 3000, () =>
  console.log("Server running on http://localhost:3000")
);
