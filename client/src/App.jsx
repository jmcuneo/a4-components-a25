import { useEffect, useState } from "react";
import BucketForm from "./components/BucketForm";
import BucketList from "./components/BucketList";
import CompletedList from "./components/CompletedList";

export default function App() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState({ username: "DemoUser" }); // 🧠 fake login for A4

  // ✅ load demo data (or fetch from backend if available)
  const loadItems = async () => {
    try {
      const res = await fetch("/results");
      if (!res.ok) throw new Error("No backend");
      const data = await res.json();
      setItems(data);
    } catch {
      // fallback demo data if no server
      setItems([
        { _id: 1, title: "Finish A4 Components", category: "School", priority: "High", completed: false },
        { _id: 2, title: "Celebrate after submitting 🎉", category: "Fun", priority: "Medium", completed: false },
        { _id: 3, title: "Take a nap", category: "Self-Care", priority: "Low", completed: true },
      ]);
    }
  };

  useEffect(() => { loadItems(); }, []);

  // add / update / delete still work if backend is up
  const handleAdd = async (item) => {
    const res = await fetch("/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (res.ok) loadItems();
    else setItems((prev) => [...prev, { ...item, _id: Date.now(), completed: false }]);
  };

  const handleComplete = async (id) => {
    const res = await fetch(`/results/${id}`, { method: "PUT" });
    if (res.ok) loadItems();
    else setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, completed: true } : i))
    );
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/results/${id}`, { method: "DELETE" });
    if (res.ok) loadItems();
    else setItems((prev) => prev.filter((i) => i._id !== id));
  };

  const active = items.filter((i) => !i.completed);
  const completed = items.filter((i) => i.completed);

  return (
    <div className="container py-4">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm rounded mb-4">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">Bucket Buddy</span>
          <div className="d-flex">
            <span className="me-3 text-muted">
              Hi, <strong>{user.username}</strong>
            </span>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <BucketForm onAdd={handleAdd} />
      <BucketList
        items={active}
        onComplete={handleComplete}
        onDelete={handleDelete}
      />
      <CompletedList items={completed} onDelete={handleDelete} />
    </div>
  );
}
