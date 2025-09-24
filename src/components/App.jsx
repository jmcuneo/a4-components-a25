import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetch('/api/tasks', {
          credentials: 'include' // Include cookies for session auth
        });
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error('Failed to load tasks:', response.status);
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };
    loadTasks();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      if (editingTask) {
        const response = await fetch(`/api/tasks/${editingTask._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          credentials: 'include' // Include cookies for session auth
        });
        
        if (response.ok) {
          const updatedTask = await response.json();
          setTasks(tasks.map(task => 
            task._id === editingTask._id ? updatedTask : task
          ));
          setEditingTask(null);
        } else {
          console.error('Failed to update task:', response.status);
        }
      } else {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          credentials: 'include' // Include cookies for session auth
        });
        
        if (response.ok) {
          const newTask = await response.json();
          setTasks([...tasks, newTask]);
        } else {
          console.error('Failed to create task:', response.status);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        credentials: 'include' // Include cookies for session auth
      });
      
      if (response.ok) {
        setTasks(tasks.filter(task => task._id !== taskId));
      } else {
        console.error('Failed to delete task:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="container">
      <TaskForm
        onSubmit={handleSubmit}
        editingTask={editingTask}
        onCancelEdit={handleCancelEdit}
      />
      <TaskList
        tasks={tasks}
        onEditTask={handleEdit}
        onDeleteTask={handleDelete}
      />
    </div>
  );
};

export default App;