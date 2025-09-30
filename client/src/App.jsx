import { useEffect, useState } from "react";
import BucketForm from "./components/BucketForm";
import BucketList from "./components/BucketList";
import CompletedList from "./components/CompletedList";

export default function App() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);

  // fetch who is logged in
  useEffect(() => {
    fetch("/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, []);

  // fetch bucket list items
  const loadItems = () => {
    fetch("/results")
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then(setItems)
      .catch(() => setItems([]));
  };

  useEffect(() => {
    if (user) loadItems();
  }, [user]);

  // add new item
  const handleAdd = async (item) => {
    const res = await fetch("/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (res.ok) loadItems();
  };

  // mark item complete
  const handleComplete = async (id) => {
    const res = await fetch(`/results/${id}`, { method: "PUT" });
    if (res.ok) loadItems();
  };

  // delete item
  const handleDelete = async (id) => {
    const res = await fetch(`/results/${id}`, { method: "DELETE" });
    if (res.ok) loadItems();
  };

  // split active vs completed
  const active = items.filter((i) => !i.completed);
  const completed = items.filter((i) => i.completed);

  return (
    <div className="container py-4">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm rounded mb-4">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">Bucket Buddy</span>
          <div className="d-flex">
            {user ? (
              <>
                <span className="me-3 text-muted">
                  Hi, <strong>{user.username}</strong>
                </span>
                <form method="post" action="/logout">
                  <button className="btn btn-outline-danger btn-sm" type="submit">
                    <i className="bi bi-box-arrow-right me-1"></i> Logout
                  </button>
                </form>
              </>
            ) : (
              <a href="/login.html" className="btn btn-dark btn-sm">
                <i className="bi bi-github me-1"></i> Login with GitHub
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Main content */}
      {user ? (
        <>
          <BucketForm onAdd={handleAdd} />
          <BucketList
            items={active}
            onComplete={handleComplete}
            onDelete={handleDelete}
          />
          <CompletedList items={completed} onDelete={handleDelete} />
        </>
      ) : (
        <div className="alert alert-warning text-center">
          Please <a href="/login.html">log in</a> to see your bucket list.
        </div>
      )}
    </div>
  );
}
