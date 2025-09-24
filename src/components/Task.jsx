import React from 'react';

const Task = ({ task, onEdit, onDelete }) => {
  const priorityClass = `priority-${task.priority.toLowerCase()}`;
  
  return (
    <tr>
      <td>{task.task}</td>
      <td>
        <span className={priorityClass}>{task.priority}</span>
      </td>
      <td>{new Date(task.creation_date).toLocaleDateString()}</td>
      <td>{task.deadline}</td>
      <td>
        <button 
          className="edit-btn" 
          onClick={() => onEdit(task)}
          aria-label={`Edit task: ${task.task}`}
        >
          Edit
        </button>
        <button 
          className="delete-btn" 
          onClick={() => onDelete(task._id)}
          aria-label={`Delete task: ${task.task}`}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default Task;