import { useState } from "react";

export default function BucketForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !category || !priority) return;
    onAdd({ title, category, priority, targetDate });
    setTitle("");
    setCategory("");
    setPriority("");
    setTargetDate("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
      <input value={priority} onChange={(e) => setPriority(e.target.value)} placeholder="Priority" />
      <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}
