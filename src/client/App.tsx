import React, { useEffect, useState } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart, faPen, faTrash, faUser} from "@fortawesome/free-solid-svg-icons";

// Types
interface Task {
    text: string;
    done: boolean;
}

interface Checklist {
    name: string;
    tasks: Task[];
}

// ---------- App Component ----------
const App: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [checklists, setChecklists] = useState<{ [name: string]: Task[] }>({});
    const [currentChecklist, setCurrentChecklist] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [taskInput, setTaskInput] = useState("");

    // Fetch user info
    useEffect(() => {
        const fetchUser = async () => {
            console.log("Fetching user...");
            try {
                const res = await fetch("http://localhost:3000/api/me", { credentials: "include" });
                if (!res.ok) throw new Error("Not logged in");
                const data = await res.json();
                setUser({ id: data.user.sub, name: data.user.name || data.user.nickname });
                console.log("Fetching user worked!");
            } catch {
                window.location.href = "/login";
                console.log("Fetching user failed");
            }
        };
        fetchUser();
    }, []);

    // Fetch checklists
    useEffect(() => {
        console.log("Fetching checklists...");
        if (!user) return;

        const fetchChecklists = async () => {
            try {
                console.log("Fetching checklists try");
                const res = await fetch("http://localhost:3000/api/checklists", { credentials: "include" });
                const data = await res.json();
                const userChecklists: { [name: string]: Task[] } = {};
                data.forEach((c: any) => {
                    if (c.userId === user.id) userChecklists[c.name] = c.tasks;
                });
                setChecklists(userChecklists);
                if (!currentChecklist && Object.keys(userChecklists).length > 0) {
                    setCurrentChecklist(Object.keys(userChecklists)[0]);
                }
                console.log("Fetching checklists success");
            } catch (err) {
                console.error("Failed to fetch checklists", err);
                console.log("Failed fetching checklists...");
            }
        };
        fetchChecklists();
    }, [user]);

    // ---------- Checklist CRUD ----------
    const addChecklist = async () => {
        console.log("Adding checklist...");
        const name = prompt("Enter checklist name:");
        if (!name) return;
        if (checklists[name]) return alert("Checklist already exists");
        try {
            console.log("Trying add checklist");
            const res = await fetch(`http://localhost:3000/api/checklists/${currentChecklist}/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ text: taskInput.trim() }),
            });
            const data = await res.json();
            setChecklists(prev => ({ ...prev, [data.name]: data.tasks }));
            setCurrentChecklist(data.name);
            console.log("Success add checklist");
        } catch (err) {
            console.log("Failed to add checklist", err);
            console.error("Failed to add checklist", err);
        }
    };

    const renameChecklist = async (oldName: string) => {
        const newName = prompt("Rename checklist:", oldName);
        if (!newName) return;

        try {
            const res = await fetch(`http://localhost:3000/api/checklists/${oldName}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newName }),
            });
            const data = await res.json();
            setChecklists(prev => {
                const updated = { ...prev };
                delete updated[oldName];
                updated[data.name] = data.tasks;
                return updated;
            });
            setCurrentChecklist(data.name);
        } catch (err) {
            console.error("Failed to rename checklist", err);
        }
    };

    const deleteChecklist = async (name: string) => {
        if (!confirm(`Delete checklist "${name}"?`)) return;
        try {
            await fetch(`http://localhost:3000/api/checklists/${name}`, { method: "DELETE" });
            setChecklists(prev => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
            if (currentChecklist === name) setCurrentChecklist(Object.keys(checklists)[0] || null);
        } catch (err) {
            console.error("Failed to delete checklist", err);
        }
    };

    // ---------- Task CRUD ----------
    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentChecklist || !taskInput.trim()) return;

        try {
            console.log("Trying to create")
            console.log("Trying to create task...");
            const res = await fetch(`http://localhost:3000/api/checklists/${currentChecklist}/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // important!
                body: JSON.stringify({ text: taskInput.trim() }),
            });

            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            setChecklists(prev => ({ ...prev, [data.name]: data.tasks }));
            setTaskInput("");
        } catch (err) {
            console.error("Failed to add task", err);
        }
    };

    const toggleTask = async (index: number) => {
        if (!currentChecklist) return;

        try {
            const res = await fetch(`http://localhost:3000/api/checklists/${currentChecklist}/tasks/${index}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({}),
            });

            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            setChecklists(prev => ({ ...prev, [data.name]: data.tasks }));
        } catch (err) {
            console.error("Failed to toggle task", err);
        }
    };

    const editTask = async (index: number, oldText: string) => {
        if (!currentChecklist) return;
        const newText = prompt("Edit task:", oldText);
        if (!newText) return;

        try {
            const res = await fetch(`http://localhost:3000/api/checklists/${currentChecklist}/tasks/${index}/edit`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ text: newText }),
            });

            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            setChecklists(prev => ({ ...prev, [data.name]: data.tasks }));
        } catch (err) {
            console.error("Failed to edit task", err);
        }
    };

    const deleteTask = async (index: number) => {
        if (!currentChecklist || !confirm("Delete this task?")) return;

        try {
            const res = await fetch(`http://localhost:3000/api/checklists/${currentChecklist}/tasks/${index}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            setChecklists(prev => ({ ...prev, [data.name]: data.tasks }));
        } catch (err) {
            console.error("Failed to delete task", err);
        }
    };


    if (!user) return <div className="p-4">Loading user info...</div>;

    const currentTasks = currentChecklist ? checklists[currentChecklist] || [] : [];

    return (
        <div className="flex flex-col bg-pink-50 h-screen w-screen">
            <header className="relative h-16 bg-pink-300 shadow flex items-center justify-between px-6">
                <div className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-pink-900 flex items-center gap-2">
                    <FontAwesomeIcon icon={faHeart} className="text-pink-600" />
                    Partner Bucket List
                    <FontAwesomeIcon icon={faHeart} className="text-pink-600" />
                </div>

                <div className="ml-auto relative">
                    <button
                        aria-label="User menu button"
                        className="flex shadow items-center justify-center rounded-full bg-pink-200 h-[50px] w-[50px] hover:bg-pink-400"
                        onClick={() => setMenuOpen(prev => !prev)}
                    >
                        <FontAwesomeIcon icon={faUser} className="text-pink-900 text-3xl" />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg border">
                            <div className="px-4 py-2 text-sm text-gray-700 border-b">{user.name}</div>
                            <button
                                aria-label="Logout"
                                className="w-full text-left px-4 py-2 text-sm text-pink-600 hover:bg-pink-100"
                                onClick={() => window.location.href = "/logout"}
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-pink-200 p-4 flex flex-col">
                    <button
                        className="mb-4 bg-pink-400 text-white rounded py-2 hover:bg-pink-500"
                        onClick={addChecklist}
                    >
                        New Adventure!
                    </button>
                    <ul className="flex-1 overflow-y-auto space-y-2">
                        {Object.keys(checklists).map(name => (
                            <li
                                key={name}
                                onClick={() => setCurrentChecklist(name)}
                                className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                                    name === currentChecklist ? "bg-pink-300 font-bold" : "hover:bg-pink-100"
                                }`}
                            >
                                <span>{name}</span>
                                <div className="flex gap-2">
                                    <button
                                        aria-label="Edit checklist"
                                        onClick={e => {
                                            e.stopPropagation();
                                            renameChecklist(name);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPen} className="text-black hover:text-pink-400"/>
                                    </button>
                                    <button
                                        aria-label="Delete checklist"
                                        onClick={e => {
                                            e.stopPropagation();
                                            deleteChecklist(name);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="text-black hover:text-pink-400"/>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Main */}
                <main className="flex-1 flex flex-col p-2 space-y-2">
                    {/* Task Form */}
                    <form onSubmit={addTask} className="flex space-x-2">
                        <label htmlFor="taskInput" className="sr-only">Add a new checklist item</label>
                        <input
                            id="taskInput"
                            type="text"
                            placeholder="Add a new checklist item"
                            className="flex-1 p-1 border border-gray-300 rounded"
                            value={taskInput}
                            onChange={e => setTaskInput(e.target.value)}
                            required
                        />
                        <button type="submit" className="bg-pink-400 text-white rounded px-4 hover:bg-pink-500" aria-label="Add task">Submit</button>
                    </form>

                    {/* Active Tasks */}
                    <div className="flex-1 bg-white rounded p-4 overflow-y-auto shadow">
                        <h2 className="font-semibold mb-2">Active Tasks</h2>
                        <ul className="space-y-2">
                            {currentTasks.filter(t => !t.done).map((task, i) => (
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

                    {/* Completed Tasks */}
                    <section className="flex-1 bg-gray-200 rounded p-4 overflow-y-auto shadow">
                        <h2 className="font-semibold mb-2">Completed Tasks</h2>
                        <ul className="space-y-2">
                            {currentTasks.filter(t => t.done).map((task, i) => (
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
                    </section>
                </main>
            </div>
        </div>
    );
};

// ---------- Task Item Component ----------
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
            <input type="checkbox" checked={task.done} onChange={() => toggleTask(index)} aria-label="Checklist Item" />
            <span className={task.done ? "line-through text-gray-600" : ""}>{task.text}</span>
        </div>
        <div className="flex gap-2">
            <button aria-label="Edit task" onClick={() => editTask(index, task.text)}>
                <FontAwesomeIcon icon={faPen} className="text-black hover:text-pink-400" />
            </button>
            <button aria-label="Delete task" onClick={() => deleteTask(index)}>
                <FontAwesomeIcon icon={faTrash} className="text-black hover:text-pink-400" />
            </button>
        </div>
    </li>
);

export default App;
