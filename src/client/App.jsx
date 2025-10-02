import React, { useState, useEffect } from 'react'
import "./App.css"  // This will include your existing styles

const Todo = props => {
  let itemColor;
  if (props.overdue) {
    itemColor = "red";
  } else {
    itemColor = "green";
  }

  return (
    <li style={{ color: itemColor }}>
      {props.task} :
      <input type="checkbox" defaultChecked={props.completed} onChange={e => props.onclick(props.task, e.target.checked)} />
    </li>
  )
}

const App = () => {
  const [todos, setTodos] = useState([])
  const [task, setTask] = useState("")
  const [dueDate, setDueDate] = useState("")

  function toggle(taskName, completed) {
    fetch('/change', {
      method: 'POST',
      body: JSON.stringify({ name: taskName, completed }),
      headers: { 'Content-Type': 'application/json' }
    })
  }

  function add(e) {
    e.preventDefault()

    fetch('/add', {
      method: 'POST',
      body: JSON.stringify({ Task: task, completed: false, Duedate: dueDate }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(json => {
        setTodos(json)
        setTask("")
        setDueDate("")
      })
  }

  // make sure to only do this once
  if (todos.length === 0) {
    fetch('/read')
      .then(response => response.json())
      .then(json => {
        setTodos(json)
      })
  }

  useEffect(() => {
    document.title = `${todos.length} todo(s)`
  })

  return (
    <div className="App">
      <div className="flex-container">
        <div>Add name and date of task</div>
        <div><strong>Add a new item, or enter a current task to mark it complete.</strong></div>
      </div>

      <form onSubmit={add}>
        <p>
          <label htmlFor="Task">Task name:</label>
          <input
            type="text"
            id="Task"
            name="Task_name"
            placeholder=" task"
            value={task}
            onChange={e => setTask(e.target.value)}
          />
        </p>
        <p>
          <label htmlFor="Duedate">Date due:</label>
          <input
            type="text"
            id="Duedate"
            name="Task_date"
            placeholder=" yyyymmdd"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </p>
        <p className="button">
          <button type="submit">Add task</button>
        </p>
      </form>

      <div className="flex-container">
        <div>Tasks that are overdue are in <span style={{ color: "red" }}>red</span>.</div>
        <div>Tasks that are upcoming are in <span style={{ color: "green" }}>green</span>.</div>
        <div>
          <h1>ToDo List:</h1>
        </div>
      </div>

      <ul id="todolist">
        {todos.length === 0 ? (
          <li>Add item to display list</li>
        ) : (
          todos.map((todo, i) => <Todo key={i} task={todo.Task} completed={todo.completed} overdue={todo.Overdue} onclick={toggle} />)
        )}
      </ul>
    </div>
  )
}

export default App