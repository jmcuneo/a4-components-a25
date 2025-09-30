import React, {JSX, useEffect, useState} from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import TaskInputForm from "./TaskInputForm";
import TaskList from "./TaskList";
import LoginPage from "./LoginPage";

interface Task {
    text: string;
    done: boolean;
}

interface Checklist {
    name: string;
    tasks: Task[];
}

const App: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [checklists, setChecklists] = useState<{ [name: string]: Task[] }>({});
    const [currentChecklist, setCurrentChecklist] = useState<string | null>(null);

    // Fetch checklists when username changes
    useEffect(() => {
        if (!username) return;
        const fetchChecklists = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/checklists?user=${username}`);
                const data: Checklist[] = await res.json();
                const userChecklists: { [name: string]: Task[] } = {};
                data.forEach(c => (userChecklists[c.name] = c.tasks));
                setChecklists(userChecklists);
                if (!currentChecklist && Object.keys(userChecklists).length > 0) {
                    setCurrentChecklist(Object.keys(userChecklists)[0]);
                }
            } catch (err) {
                console.error("Failed to fetch checklists", err);
            }
        };
        fetchChecklists();
    }, [username]);

    const currentTasks = currentChecklist ? checklists[currentChecklist] || [] : [];

    // Protect routes
    const ProtectedRoute = ({ children }: { children: JSX.Element }) =>
        username ? children : <Navigate to="/login" replace />;

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage setUsername={setUsername} />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <div className="flex flex-col bg-pink-50 h-screen w-screen">
                                <Header username={username} setUsername={setUsername} />
                                <div className="flex flex-1">
                                    <Sidebar
                                        checklists={checklists}
                                        currentChecklist={currentChecklist}
                                        setCurrentChecklist={setCurrentChecklist}
                                        setChecklists={setChecklists}
                                        effectiveUser={username!}
                                    />
                                    <main className="flex-1 flex flex-col p-2 space-y-2">
                                        <TaskInputForm
                                            username={username!}
                                            setUsername={setUsername}
                                            currentChecklist={currentChecklist}
                                            setChecklists={setChecklists}
                                        />
                                        <TaskList
                                            tasks={currentTasks.filter(t => !t.done)}
                                            toggleTask={(i: number) => toggleTask(i)}
                                            editTask={(i: number, oldText: string) => editTask(i, oldText)}
                                            deleteTask={(i: number) => deleteTask(i)}
                                            title="Active Tasks"
                                        />
                                        <TaskList
                                            tasks={currentTasks.filter(t => t.done)}
                                            toggleTask={(i: number) => toggleTask(i)}
                                            editTask={(i: number, oldText: string) => editTask(i, oldText)}
                                            deleteTask={(i: number) => deleteTask(i)}
                                            title="Completed Tasks"
                                        />
                                    </main>
                                </div>
                            </div>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );

    // Functions for tasks
    async function toggleTask(index: number) {
        if (!currentChecklist || !username) return;
        try {
            const res = await fetch(`http://localhost:3000/api/checklists/${currentChecklist}/tasks/${index}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: username }),
            });
            const data: Checklist = await res.json();
            if (!data || !data.name) {
                console.error("Invalid response from server", data);
                return;
            }
            setChecklists(prev => ({ ...prev, [data.name]: data.tasks }));
        } catch (err) {
            console.error("Failed to toggle task", err);
        }
    }

    async function editTask(index: number, oldText: string) {
        if (!currentChecklist || !username) return;
        const newText = prompt("Edit task:", oldText);
        if (!newText) return;
        try {
            const res = await fetch(
                `http://localhost:3000/api/checklists/${currentChecklist}/tasks/${index}/edit`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: newText, user: username }),
                }
            );
            const data: Checklist = await res.json();
            if (!data || !data.name) {
                console.error("Invalid response from server", data);
                return;
            }
            setChecklists(prev => ({ ...prev, [data.name]: data.tasks }));
        } catch (err) {
            console.error("Failed to edit task", err);
        }
    }

    async function deleteTask(index: number) {
        if (!currentChecklist || !username) return;
        if (!confirm("Delete this task?")) return;
        try {
            const res = await fetch(
                `http://localhost:3000/api/checklists/${currentChecklist}/tasks/${index}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user: username }),
                }
            );
            const data: Checklist = await res.json();
            if (!data || !data.name) {
                console.error("Invalid response from server", data);
                return;
            }
            setChecklists(prev => ({ ...prev, [data.name]: data.tasks }));
        } catch (err) {
            console.error("Failed to delete task", err);
        }
    }
};

export default App;
