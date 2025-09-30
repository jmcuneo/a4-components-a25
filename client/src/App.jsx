import { useEffect, useState } from "react";
import BucketForm from "./components/BucketForm";
import BucketList from "./components/BucketList";
import CompletedList from "./components/CompletedList";
import "./index.css";

export default function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/results")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(() => setItems([]));
  }, []);

  const addItem = async (newItem) => {
    try {
      const res = await fetch("/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      const saved = await res.json();
      setItems([...items, saved]);
    } catch {
      console.error("Add failed");
    }
  };

  const completeItem = async (id) => {
    try {
      await fetch(`/results/${id}`, { method: "PUT" });
      setItems(items.map(i => i._id === id ? { ...i, completed: true } : i));
    } catch {
      console.error("Complete failed");
    }
  };

  const deleteItem = async (id) => {
    try {
      await fetch(`/results/${id}`, { method: "DELETE" });
      setItems(items.filter(i => i._id !== id));
    } catch {
      console.error("Delete failed");
    }
  };

  return (
    <div className="container">
      <h1>🌟 Bucket Buddy</h1>
      <BucketForm onAdd={addItem} />
      <div className="section">
        <BucketList items={items} onComplete={completeItem} onDelete={deleteItem} />
      </div>
      <div className="section">
        <CompletedList items={items} />
      </div>
    </div>
  );
}
