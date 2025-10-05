import { useState, useEffect } from 'react';
import ReviewCard from '../components/ReviewCard';
import EditReview from '../components/EditReview';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [showEditWindow, setShowEditWindow] = useState(false);

  useEffect(() => {
    loadReviews();
    getUserStatus();
  }, []);

  const getUserStatus = async () => {
    try {
      const response = await fetch("http://localhost:3000/user");
      const session = await response.json();
      if (session.status) {
        setUser(session.user);
      }
    } catch (error) {
      console.error("Error: Failed to Fetch User");
    }
  }

  const loadReviews = async () => {
    try {
      const response = await fetch("http://localhost:3000/reviews");
      if (!response.ok) {
        window.location.href = "/login";
        return;
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error: Failed To Load Reviews:", error);
    }
  }

  const handleEdit = (reviewId) => {
    const review = reviews.find(r => r._id === reviewId);
    setEditingReview(review);
    setShowEditWindow(true);
  }

  const handleSaveEdit = async (editedData) => {
    try {
      const response = await fetch(`http://localhost:3000/edit/${editingReview._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedData)
      });

      if (response.ok) {
        setShowEditWindow(false);
        setEditingReview(null);
        loadReviews();
      } else {
        console.error("Error: Failed To Modify Review");
      }
    } catch (error) {
      console.error("Error Modifying Review:", error);
    }
  }

  const handleCancelEdit = () => {
    setShowEditWindow(false);
    setEditingReview(null);
  }

  const handleDelete = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:3000/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reviewId })
      });

      if (response.ok) {
        loadReviews();
      } else {
        console.error("Error: Failed To Delete Review");
      }
    } catch (error) {
      console.error("Error Deleting Review:", error);
    }
  }

  return (
    <>
      <h2 id="reviews-heading">
        { user ? `${user.username}'s Reviews` : 'Your Reviews' }
      </h2>
      
      <div id="reviews">
        { reviews.map(review => (
          <ReviewCard
            key={review._id}
            review={review}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      { showEditWindow && (
        <EditReview
          review={editingReview}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </>
  );
}

export default Reviews;