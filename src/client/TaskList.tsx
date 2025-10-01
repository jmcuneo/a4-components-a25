import React from "react";
import TaskItem from "./TaskItem";

interface Task {
    text: string;
    done: boolean;
}

interface TaskListProps {
    tasks: Task[];
    toggleTask: (index: number) => void;
    editTask: (index: number, oldText: string) => void;
    deleteTask: (index: number) => void;
    title: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, toggleTask, editTask, deleteTask, title }) => (
    <div className="flex-1 bg-white rounded p-4 overflow-y-auto shadow">
        <h2 className="font-semibold mb-2">{title}</h2>
        <ul className="space-y-2">
            {tasks.map((task, i) => (
                <TaskItem
                    key={i}
                    task={task}
                    index={i}
                    toggleTask={toggleTask}
                    editTask={editTask}
                    deleteTask={deleteTask}
                />
            ))}
        </ul>
    </div>
);

export default TaskList;
