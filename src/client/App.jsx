import React, { useState, useEffect } from 'react'

const App = () => {
  const [todos, setTodos] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [task, setTask] = useState("")
  const [priority, setPriority] = useState("")
  const [modify, setModify] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  function results() {
    if (!username) return
    fetch(`/results?username=${encodeURIComponent(username)}`)
      .then(res => res.json())
      .then(json => {
        setTodos(json)
      })
  }

  function login(event) {
    event.preventDefault()

    fetch("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        if (data.message && data.message.includes("Incorrect")) {
          alert(data.message)
          return
        }
        // Only set authenticated state if login was successful
        setIsAuthenticated(true)
        localStorage.setItem("username", username)
        results()
      })
      .catch(error => {
        console.error("Login error:", error)
        alert("Login failed. Please try again.")
      })
  }

  function submit(event) {
    event.preventDefault()

    fetch("/submit", {
      method: "POST",
      body: JSON.stringify({ username, task, priority }),
      headers: { "Content-Type": "application/json" }
    }).then(() => {
      setTask("")
      results()
    })
  }

  function delete_task(id) {
    fetch("/delete", {
      method: "POST",
      body: JSON.stringify({ id, username }),
      headers: { "Content-Type": "application/json" }
    }).then(() => results())
  }

  function saveModify() {
    fetch("/modify", {
      method: "POST",
      body: JSON.stringify({
        id: modify._id,
        username,
        newTask: modify.task,
        newPriority: modify.priority
      }),
      headers: { "Content-Type": "application/json" }
    }).then(() => {
      setModify(null)
      results()
    })
  }

  useEffect(() => {
    if (isAuthenticated && username) results()
  }, [isAuthenticated, username])

  // Pre-fill username from localStorage for convenience, but don't auto-login
  useEffect(() => {
    const savedUsername = localStorage.getItem("username")
    if (savedUsername && !username) {
      setUsername(savedUsername)
    }
  }, [])

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6" style={{ fontFamily: "'Smooch Sans', sans-serif" }}>My To-Do List</h1>
        
        <div id="login" className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: "'Smooch Sans', sans-serif" }}>Login</h2>
          <form id="login-form" className="flex flex-col gap-4" onSubmit={login}>
            <input type="text" id="username" placeholder="Username"
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500" value={username} onChange={(event) => setUsername(event.target.value)} />
            <input type="password" id="password" placeholder="Password"
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500" value={password} onChange={(event) => setPassword(event.target.value)}/>
            <button id="login-button" className="bg-sky-700 hover:bg-sky-900 text-white font-semibold py-2 px-4 rounded">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6" style={{ fontFamily: "'Smooch Sans', sans-serif" }}>My To-Do List</h1>
      
      <div className="mt-6 bg-white p-6 rounded shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold" style={{ fontFamily: "'Smooch Sans', sans-serif" }}>Input a Task</h2>
        <button
          className="bg-red-900 hover:bg-red-950 text-white font-semibold py-1 px-3 rounded"
          onClick={() => {
            localStorage.removeItem("username");
            setUsername("");
            setPassword("");
            setIsAuthenticated(false);
          }}
        >
          Log Out
        </button>
      </div>

      {/* Add Task Form */}
      <form className="flex flex-col sm:flex-row gap-3 mb-6" onSubmit={submit}>
        <input
          type="text"
          placeholder="Task description"
          className="flex-1 border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button className="bg-green-700 hover:bg-green-900 text-white font-semibold py-2 px-4 rounded">
          Add Task
        </button>
      </form>

      {/* Tasks Table */}
      <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Smooch Sans', sans-serif" }}>Your Task List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded shadow-sm">
          <thead className="text-white" style={{ backgroundColor: 'navy' }}>
            <tr>
              <th className="px-4 py-2 text-center" style={{ fontFamily: "'Smooch Sans', sans-serif" }}>Task</th>
              <th className="px-4 py-2 text-center" style={{ fontFamily: "'Smooch Sans', sans-serif" }}>Priority</th>
              <th className="px-4 py-2 text-center" style={{ fontFamily: "'Smooch Sans', sans-serif" }}>Created</th>
              <th className="px-4 py-2 text-center" style={{ fontFamily: "'Smooch Sans', sans-serif" }}>Deadline</th>
              <th className="px-4 py-2 text-center" style={{ fontFamily: "'Smooch Sans', sans-serif" }}>Delete</th>
              <th className="px-4 py-2 text-center" style={{ fontFamily: "'Smooch Sans', sans-serif" }}>Modify</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-xl">
            {todos.map((todo) => (
              <tr key={todo._id} style={{ fontFamily: "'Smooch Sans', sans-serif" }}>
                <td className="px-4 py-2 text-center">{todo.task}</td>
                <td className="px-4 py-2 text-center">{todo.priority}</td>
                <td className="px-4 py-2 text-center">{todo.creation}</td>
                <td className="px-4 py-2 text-center">{todo.deadline}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="text-xl"
                    onClick={() => delete_task(todo._id)}
                  >
                    Delete
                  </button>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="text-xl"
                    onClick={() => setModify(todo)}
                  >
                    Modify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modify Modal */}
      {modify && (
        <div className="fixed inset-0 bg-black/25 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <span
              className="close absolute top-2 right-3 cursor-pointer text-gray-500 hover:text-gray-900 text-xl"
              onClick={() => setModify(null)}
            >
              &times;
            </span>
            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
            <input
              type="text"
              value={modify.task}
              onChange={(e) => setModify({ ...modify, task: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <select
              value={modify.priority}
              onChange={(e) => setModify({ ...modify, priority: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button
              className="bg-sky-500 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded w-full"
              onClick={saveModify}
            >
              Save
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default App;
