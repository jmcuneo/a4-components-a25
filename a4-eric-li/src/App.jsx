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
  const [editingTodo, setEditingTodo] = useState(null)
  const [editForm, setEditForm] = useState({
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

  const startEdit = (todo) => {
    setEditingTodo(todo._id)
    setEditForm({
      taskTitle: todo.taskTitle,
      taskDescription: todo.taskDescription,
      taskDueDate: todo.taskDueDate
    })
  }

  const cancelEdit = () => {
    setEditingTodo(null)
    setEditForm({ taskTitle: '', taskDescription: '', taskDueDate: '' })
  }

  const saveEdit = async (id) => {
    try {
      const response = await fetch('/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editForm })
      })
      if (response.ok) {
        const updatedTodos = await response.json()
        setTodos(updatedTodos)
        setEditingTodo(null)
        setEditForm({ taskTitle: '', taskDescription: '', taskDueDate: '' })
      }
    } catch (err) {
      console.error('Error editing todo:', err)
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
              {editingTodo === todo._id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editForm.taskTitle}
                    onChange={(e) => setEditForm({ ...editForm, taskTitle: e.target.value })}
                    placeholder="Task Title"
                  />
                  <textarea
                    value={editForm.taskDescription}
                    onChange={(e) => setEditForm({ ...editForm, taskDescription: e.target.value })}
                    placeholder="Task Description"
                  />
                  <input
                    type="date"
                    value={editForm.taskDueDate}
                    onChange={(e) => setEditForm({ ...editForm, taskDueDate: e.target.value })}
                  />
                  <div className="edit-buttons">
                    <button onClick={() => saveEdit(todo._id)} className="save-btn">Save</button>
                    <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h3>{todo.taskTitle}</h3>
                  <p>{todo.taskDescription}</p>
                  <p>Due: {new Date(todo.taskDueDate).toLocaleDateString()}</p>
                  <p>Days left: {todo.daysLeft}</p>
                  <div className="todo-buttons">
                    <button onClick={() => toggleTodo(todo._id, todo.completed)}>
                      {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                    </button>
                    <button onClick={() => startEdit(todo)} className="edit-btn">Edit</button>
                    <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                  </div>
                </>
              )}
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
