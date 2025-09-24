import React from 'react';
import Task from './Task';

const TaskList = ({ tasks, onEditTask, onDeleteTask }) => {
  return (
    <div className="results-section">
      <h2>Task List</h2>
      <table id="tasksTable" aria-label="Tasks table">
        <thead>
          <tr>
            <th scope="col">Task</th>
            <th scope="col">Priority</th>
            <th scope="col">Creation Date</th>
            <th scope="col">Deadline</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <Task
              key={task._id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;