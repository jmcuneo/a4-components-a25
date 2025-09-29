import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState({
    taskTitle: '',
    taskDescription: '',
    taskDueDate: ''
  })

  // Check authentication status
  useEffect(() => {
    fetch('/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
          loadTodos()
        }
      })
      .catch(err => console.log('Not authenticated'))
  }, [])

  const loadTodos = async () => {
    try {
      const response = await fetch('/todos')
      if (response.ok) {
        const todosData = await response.json()
        setTodos(todosData)
      }
    } catch (err) {
      console.error('Error loading todos:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      })
      if (response.ok) {
        const updatedTodos = await response.json()
        setTodos(updatedTodos)
        setNewTodo({ taskTitle: '', taskDescription: '', taskDueDate: '' })
      }
    } catch (err) {
      console.error('Error adding todo:', err)
    }
  }

  const toggleTodo = async (id, completed) => {
    try {
      const response = await fetch('/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed: !completed })
      })
      if (response.ok) {
        const updatedTodos = await response.json()
        setTodos(updatedTodos)
      }
    } catch (err) {
      console.error('Error toggling todo:', err)
    }
  }

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`/delete?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        const updatedTodos = await response.json()
        setTodos(updatedTodos)
      }
    } catch (err) {
      console.error('Error deleting todo:', err)
    }
  }

  if (!user) {
    return (
      <div className="App">
        <h1>Todo App</h1>
        <p>Please log in to continue</p>
        <a href="/auth/github">
          <button>Login with GitHub</button>
        </a>
      </div>
    )
  }

  return (
    <div className="App">
      <header>
        <h1>Welcome, {user.username}!</h1>
        <a href="/logout">
          <button>Logout</button>
        </a>
      </header>

      <div className="todo-form">
        <h2>Add New Todo</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Title"
            value={newTodo.taskTitle}
            onChange={(e) => setNewTodo({ ...newTodo, taskTitle: e.target.value })}
            required
          />
          <textarea
            placeholder="Task Description"
            value={newTodo.taskDescription}
            onChange={(e) => setNewTodo({ ...newTodo, taskDescription: e.target.value })}
            required
          />
          <input
            type="date"
            value={newTodo.taskDueDate}
            onChange={(e) => setNewTodo({ ...newTodo, taskDueDate: e.target.value })}
            required
          />
          <button type="submit">Add Todo</button>
        </form>
      </div>

      <div className="todos">
        <h2>Your Todos</h2>
        {todos.length === 0 ? (
          <p>No todos yet. Add one above!</p>
        ) : (
          todos.map(todo => (
            <div key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <h3>{todo.taskTitle}</h3>
              <p>{todo.taskDescription}</p>
              <p>Due: {new Date(todo.taskDueDate).toLocaleDateString()}</p>
              <p>Days left: {todo.daysLeft}</p>
              <button onClick={() => toggleTodo(todo._id, todo.completed)}>
                {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              <button onClick={() => deleteTodo(todo._id)}>Delete</button>
            </div>
          ))
        )}
      </div>
      <footer>
        <p>&copy; Eric Li - CS4241 Assignment 4</p>
      </footer>
    </div>
  )
}

export default App
