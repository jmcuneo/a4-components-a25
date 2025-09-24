import React, { useState, useEffect } from 'react';

const TaskForm = ({ onSubmit, editingTask, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    task: '',
    priority: '',
    creation_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        task: editingTask.task,
        priority: editingTask.priority,
        creation_date: editingTask.creation_date.split('T')[0]
      });
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!editingTask) {
      setFormData({
        task: '',
        priority: '',
        creation_date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-section" aria-labelledby="formTitle">
      <h2 id="formTitle">{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
      <div className="form-group">
        <label htmlFor="task">Task Description:</label>
        <input
          type="text"
          id="task"
          name="task"
          value={formData.task}
          onChange={handleChange}
          required
          aria-required="true"
        />
      </div>
      <div className="form-group">
        <label htmlFor="priority">Priority:</label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          required
          aria-required="true"
        >
          <option value="">Select Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="creation_date">Creation Date:</label>
        <input
          type="date"
          id="creation_date"
          name="creation_date"
          value={formData.creation_date}
          onChange={handleChange}
          required
          aria-required="true"
        />
      </div>
      <button type="submit" className="btn-primary">
        {editingTask ? 'Update Task' : 'Add Task'}
      </button>
      {editingTask && (
        <button
          type="button"
          className="btn-primary"
          style={{background: '#888', marginLeft: '1rem'}}
          onClick={onCancelEdit}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default TaskForm;