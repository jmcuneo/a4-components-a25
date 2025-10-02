import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState([])
  const [newItem, setNewItem] = useState({ date: '', thing: '', done: false })

  useEffect(() => {
    fetch('/data')
      .then(response => response.json())
      .then(data => setData(data))
  }, [])

  const addItem = () => {
    fetch('/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    })
    .then(response => response.json())
    .then(data => setData(data))
  }

  const deleteItem = (id) => {
    fetch(`/delete/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => setData(data))
  }

  const checkdone = (id) => {
    fetch(`/update/${id}`, {
      method: 'PUT'
    })
    .then(response => response.json())
    .then(data => setData(data))
  } 
  
  return (
    <div className="container">
      <h1 className="title">✅ To-Do List</h1>

      <div className="form">
        <input
          type="date"
          value={newItem.date}
          onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
          className="input"
        />
        <input
          type="text"
          placeholder="Thing"
          value={newItem.thing}
          onChange={(e) => setNewItem({ ...newItem, thing: e.target.value })}
          className="input"
        />
        <button onClick={addItem} className="btn add">
          Add
        </button>
      </div>

      {/* Table for todos */}
      <table className="todo-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Task</th>
            <th>Status</th>
            <th>Days Remaining</th>
            <th>Done</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.todos &&
            data.todos.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td className={item.done ? "done" : ""}>{item.thing}</td>
                <td>{item.done ? "✔ Done" : "⏳ Not Done"}</td>
                <td>{item.dayRemaining}</td>
                <td>
                  {!item.done && (
                    <button
                      onClick={() => checkdone(item.id)}
                      className="btn done"
                    >
                      Done
                    </button>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="btn delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )

}

export default App