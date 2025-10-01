import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

interface Task {
    text: string;
    done: boolean;
}

interface TaskItemProps {
    task: Task;
    index: number;
    toggleTask: (index: number) => void;
    editTask: (index: number, oldText: string) => void;
    deleteTask: (index: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, index, toggleTask, editTask, deleteTask }) => (
    <li className="flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
            <input type="checkbox" checked={task.done} onChange={() => toggleTask(index)} />
            <span className={task.done ? "line-through text-gray-600" : ""}>{task.text}</span>
        </div>
        <div className="flex gap-2">
            <button onClick={() => editTask(index, task.text)}>
                <FontAwesomeIcon icon={faPen} className="text-black hover:text-pink-400" />
            </button>
            <button onClick={() => deleteTask(index)}>
                <FontAwesomeIcon icon={faTrash} className="text-black hover:text-pink-400" />
            </button>
        </div>
    </li>
);

export default TaskItem;
