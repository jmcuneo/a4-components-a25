import { useState } from "react";

export default function BucketForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [targetDate, setTargetDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !category) return alert("Please fill out all fields!");
    onAdd({ title, category, priority, targetDate });
    setTitle("");
    setCategory("");
    setPriority("Medium");
    setTargetDate("");
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Add a Bucket List Item</h5>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Title</label>
            <input
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Category</label>
            <input
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Priority</label>
            <select
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Target Date</label>
            <input
              type="date"
              className="form-control"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>
          <div className="col-12">
            <button className="btn btn-primary" type="submit">
              <i className="bi bi-plus-circle me-1"></i> Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
