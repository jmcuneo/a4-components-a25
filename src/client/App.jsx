import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [item, setItem] = useState("");
  const [cost, setCost] = useState("");
  const [category, setCategory] = useState("");

  // For editing
  const [editingIndex, setEditingIndex] = useState(null);
  const [editItem, setEditItem] = useState("");
  const [editCost, setEditCost] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // Load existing expenses
  useEffect(() => {
    fetch("/expenses")
      .then((res) => res.json())
      .then(setExpenses)
      .catch((err) => console.error("Error loading expenses:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item || !cost || !category) {
      alert("Please fill in all fields with valid data.");
      return;
    }
    const newExpense = { item, cost: parseFloat(cost), category };
    const res = await fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExpense),
    });
    const data = await res.json();
    setExpenses(data);
    setItem("");
    setCost("");
    setCategory("");
  };

  const handleDelete = async (index) => {
    const res = await fetch(`/delete/${index}`, { method: "POST" });
    const data = await res.json();
    setExpenses(data);
  };

  const startEdit = (index, exp) => {
    setEditingIndex(index);
    setEditItem(exp.item);
    setEditCost(exp.cost);
    setEditCategory(exp.category);
  };

  const saveEdit = async (index) => {
    const updatedExpense = {
      item: editItem,
      cost: parseFloat(editCost),
      category: editCategory,
    };
    const res = await fetch(`/update/${index}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedExpense),
    });
    const data = await res.json();
    setExpenses(data);
    setEditingIndex(null);
  };

  const reorder = async (from, to) => {
    const res = await fetch("/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to }),
    });
    const data = await res.json();
    setExpenses(data);
  };

  return (
    <div className="content">
      <div className="App">
        <h1>Epic Expenses Tracker</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="Expense name"
            required
          />
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="Cost"
            required
          />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            required
          />
          <button type="submit">Add Expense</button>
        </form>

        <h2>Expenses</h2>
        <table id="expenseTable" border="1">
          <thead>
            <tr>
              <th>Item</th>
              <th>Cost</th>
              <th>Category</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, i) => (
              <tr key={i}>
                {editingIndex === i ? (
                  <>
                    <td>
                      <input
                        value={editItem}
                        onChange={(e) => setEditItem(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editCost}
                        onChange={(e) => setEditCost(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                      />
                    </td>
                    <td>{exp.dateAdded}</td>
                    <td>
                      <button onClick={() => saveEdit(i)}>Save</button>
                      <button onClick={() => setEditingIndex(null)}>
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{exp.item}</td>
                    <td>{Number(exp.cost).toFixed(2)}</td>
                    <td>{exp.category}</td>
                    <td>{exp.dateAdded}</td>
                    <td>
                      <button onClick={() => startEdit(i, exp)}>Edit</button>
                      <button onClick={() => handleDelete(i)}>Delete</button>
                      <button
                        disabled={i === 0}
                        onClick={() => reorder(i, i - 1)}
                      >
                        ↑
                      </button>
                      <button
                        disabled={i === expenses.length - 1}
                        onClick={() => reorder(i, i + 1)}
                      >
                        ↓
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
