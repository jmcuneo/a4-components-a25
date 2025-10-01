import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ResultsCard from './ResultsCard';
import "./Theme.css";


function PostBoard({ refreshTrigger }) {
  const [posts, setPosts] = useState([]);
  const { currentUser, authenticated } = useAuth();

  const fetchPosts = async () => {
    try {
      const response = await fetch("/results");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchPosts();
      const interval = setInterval(fetchPosts, 600000);
      return () => clearInterval(interval);
    }
  }, [authenticated]);

  useEffect(() => {
    if (refreshTrigger && authenticated) {
      fetchPosts();
    }
  }, [refreshTrigger, authenticated]);

  const handleEdit = async (entry) => {
    const newName = prompt("Enter new name:", entry.name);
    if (newName === null) return;

    const newBday = prompt("Enter new birthday (YYYY-MM-DD):", entry.birthday);
    if (newBday === null) return;

    try {
      const response = await fetch("/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: newName, 
          birthday: newBday, 
          image: entry.image 
        })
      });

      if (response.ok) {
        fetchPosts();
      } else {
        const error = await response.json();
        alert("Error: " + error.error);
      }
    } catch (error) {
      console.error("Edit error:", error);
      alert("Failed to update. Please try again.");
    }
  };

  const handleDelete = async (entryId) => {
    if (!confirm("Are you sure you want to delete your submission?")) {
      return;
    }

    try {
      const response = await fetch("/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entryId })
      });

      if (response.ok) {
        fetchPosts();
      } else {
        const error = await response.json();
        alert("Error: " + error.error);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete. Please try again.");
    }
  };

  if (!authenticated) {
    return null;
  }

  return (
    <div id="submissions" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {posts.map((entry, index) => (
        <div key={entry._id || index} className="relative">
          {currentUser && entry._id === currentUser.id && (
            <div className="absolute top-2 right-2 z-10 flex gap-1">
              <button
                onClick={() => handleEdit(entry)}
                className="bg-[#9EDDFF] hover:bg-[#4a9eff] text-white w-6 h-6 rounded-full border-none cursor-pointer text-xs"
              >
                ✎
              </button>
              <button
                onClick={() => handleDelete(entry._id)}
                className="bg-[#F58600] hover:bg-[#d16f00] text-white w-6 h-6 rounded-full border-none cursor-pointer text-xs"
              >
                ×
              </button>
            </div>
          )}
          
          <ResultsCard 
            name={entry.name}
            git_username={entry.username}
            avatar={entry.avatar}
            image={entry.image}
            age={entry.age}
            zodiac={entry.zodiac}
          />
        </div>
      ))}
    </div>
  );
}

export default PostBoard;