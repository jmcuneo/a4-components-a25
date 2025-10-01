import React, { useState } from "react";

interface TaskInputFormProps {
    username: string | null;
    setUsername: (name: string | null) => void;
    currentChecklist: string | null;
    setChecklists: React.Dispatch<React.SetStateAction<{ [name: string]: any[] }>>;
}

const TaskInputForm: React.FC<TaskInputFormProps> = ({
                                                         username,
                                                         setUsername,
                                                         currentChecklist,
                                                         setChecklists,
                                                     }) => {
    const [taskInput, setTaskInput] = useState("");
    
    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username) {
            const name = prompt("Enter a username to add tasks:");
            if (!name) return;
            setUsername(name.trim());
            return;
        }

        if (currentChecklist === "" || currentChecklist === null || currentChecklist === undefined) {
            alert("Please create or select a checklist first.");
            return;
        }

        if (!taskInput.trim()) return;

        try {
            const res = await fetch(
                `/api/checklists/${currentChecklist}/tasks`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: taskInput.trim(), user: username }),
                }
            );
            const data = await res.json();
            setChecklists(prev => ({ ...prev, [data.name]: data.tasks }));
            setTaskInput("");
        } catch (err) {
            console.error("Failed to add task", err);
        }
    };

    return (
        <form onSubmit={addTask} className="flex space-x-2">
            <input
                type="text"
                placeholder="Add a new checklist item"
                className="flex-1 p-1 border border-gray-300 rounded"
                value={taskInput}
                onChange={e => setTaskInput(e.target.value)}
                required
            />
            <button
                type="submit"
                className="bg-pink-400 text-white rounded px-4 hover:bg-pink-500"
            >
                Submit
            </button>
        </form>
    );
};

export default TaskInputForm;
