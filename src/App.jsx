import React, { useState, useEffect } from 'react'

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
    <div>
      <h1>To-Do List</h1>
      <input
        type="date"
        value={newItem.date}
        onChange={e => setNewItem({ ...newItem, date: e.target.value })}
      />
      <input
        type="text"
        placeholder="Thing"
        value={newItem.thing}
        onChange={e => setNewItem({ ...newItem, thing: e.target.value })}
      />
      <button onClick={addItem}>Add</button>
      <ul>
        {data.todos && data.todos.map(item => (
          <li key={item.id}>
            <span style={{ textDecoration: item.done ? 'line-through' : 'none' }}>
              {item.date} - {item.thing} - {item.dayRemaining}
            </span>
            {!item.done && <button onClick={() => checkdone(item.id)}>Done</button>}
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )

}

export default App