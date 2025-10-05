import { useState, useEffect } from 'react';

const EditReview = ({ review, onSave, onCancel }) => {
  const [data, updateReviewData] = useState({
    blurb: "",
    gameplayRating: "",
    storyRating: "",
    visualsRating: "",
    musicRating: ""
  });

  useEffect(() => {
    if (review) {
      updateReviewData({
        blurb: review.blurb,
        gameplayRating: review.gameplayRating,
        storyRating: review.storyRating,
        visualsRating: review.visualsRating,
        musicRating: review.musicRating
      });
    }}, [review]);

  const handleChange = (event) => {
    updateReviewData({
      ...data,
      [event.target.id]: event.target.value
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      blurb: data.blurb,
      gameplayRating: parseInt(data.gameplayRating) || 0,
      storyRating: parseInt(data.storyRating) || 0,
      visualsRating: parseInt(data.visualsRating) || 0,
      musicRating: parseInt(data.musicRating) || 0
    });
  }

  if (!review)
    return null;

  return (
    <div className="edit-review">
      <h3>Edit Review:</h3>
      <form onSubmit={handleSubmit}>
        <h3 id="edit-title">{review.title} ({review.year})</h3>
        
        <label htmlFor="edit-blurb">Blurb: </label>
        <input 
          type="text" 
          id="edit-blurb" 
          className="nes-input" 
          placeholder="Your Review"
          value={data.blurb}
          onChange={handleChange}
          required
        />
        <br/>
        
        <label htmlFor="edit-gameplayRating">Gameplay Rating: </label>
        <input 
          type="number" 
          id="edit-gameplayRating" 
          className="nes-input" 
          placeholder="1-10"
          min="1"
          max="10"
          value={data.gameplayRating}
          onChange={handleChange}
          required
        />
        <br/>
        
        <label htmlFor="edit-storyRating">Story Rating: </label>
        <input 
          type="number" 
          id="edit-storyRating" 
          className="nes-input" 
          placeholder="1-10"
          min="1"
          max="10"
          value={data.storyRating}
          onChange={handleChange}
          required
        />
        <br/>
        
        <label htmlFor="edit-visualsRating">Visuals Rating: </label>
        <input 
          type="number" 
          id="edit-visualsRating" 
          className="nes-input" 
          placeholder="1-10"
          min="1"
          max="10"
          value={data.visualsRating}
          onChange={handleChange}
          required
        />
        <br/>
        
        <label htmlFor="edit-musicRating">Music Rating: </label>
        <input 
          type="number" 
          id="edit-musicRating" 
          className="nes-input" 
          placeholder="1-10"
          min="1"
          max="10"
          value={data.musicRating}
          onChange={handleChange}
          required
        />
        <br/>
        <br/>
        
        <button type="submit" className="nes-btn">Confirm</button>
        <button type="button" className="nes-btn" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default EditReview;