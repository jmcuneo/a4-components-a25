import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [item, setItem] = useState("");
  const [category, setCategory] = useState("")
  const [expirationDate, setExpirationDate] = useState("");
  const [groceryList, setGroceryList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  // load existing page when pgage loads
  useEffect(() => {
    fetch("/read")
      .then((res) => res.json())
      .then((data) => setGroceryList(data));
  }, []);

  // add or edit item
  const handleSubmit = async (e) => {
    e.preventDefault();

    const list = { item, category, expirationDate };
    let url = "/submit";

    if (editingIndex !== null) {
      url = "/edit";
      list.index = editingIndex;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(list),
    });

    const updatedList = await response.json();
    setGroceryList(updatedList);
    setItem("");
    setCategory("");
    setExpirationDate("");
    setEditingIndex(null);
  };

  // delete item
  const handleDelete = async (index) => {
    const response = await fetch("/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index }),
    });

    const updatedList = await response.json();
    setGroceryList(updatedList);
  };

  // start editing
  const handleEdit = (index) => {
    const entry = groceryList[index];
    setItem(entry.item);
    setCategory(entry.category);
    setExpirationDate(entry.expirationDate);
    setEditingIndex(index);
  };

  return (
    <div>
      <h1>Grocery List 🛒</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-flex-container">
          <input type="text" id="item" placeholder="Item" value={item} onChange={(e) => setItem(e.target.value)} required></input>
          <input type="text" id="category" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required></input>
          <input type="date" id="expirationDate" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} required></input>
          <button type="submit">
            {editingIndex !== null ? "Update Item" : "Add Item"}
          </button>
        </div>
      </form>

      <h1>Current Grocery List</h1>
      <table id="groceryListTable">
        <thead>
          <tr>
            <th>Item</th>
            <th>Category</th>
            <th>Expiration Date</th>
            <th>Days Until Expiration</th>
            <th>Delete</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {groceryList.map((entry, index) => (
            <tr key={index}>
              <td>{entry.item}</td>
              <td>{entry.category}</td>
              <td>{entry.expirationDate}</td>
              <td>{entry.daysUntilExpiration}</td>
              <td>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </td>
              <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    

  );
}

export default App
