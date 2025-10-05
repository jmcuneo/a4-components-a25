const ReviewCard = ({ review, onEdit, onDelete }) => {
  return (
    <div className="review-card">
      <div className="timestamp">
        {review.datePosted}
      </div>
      
      <h3>{review.title} ({review.year}):</h3>
      
      <p>"{review.blurb}"</p>
      
      <table className="nes-table is-bordered is-centered">
        <thead>
          <tr>
            <th>Gameplay:</th>
            <th>Story:</th>
            <th>Visuals:</th>
            <th>Music:</th>
            <th>Overall:</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>{review.gameplayRating}/10</th>
            <th>{review.storyRating}/10</th>
            <th>{review.visualsRating}/10</th>
            <th>{review.musicRating}/10</th>
            <th>{review.overallRating}/10</th>
          </tr>
        </tbody>
      </table>
      
      <br />
      
      <button 
        className="nes-btn"
        onClick={() => onEdit(review._id)}
      >
        Edit Contents
      </button>
      
      <br />
      
      <button 
        className="nes-btn"
        onClick={() => onDelete(review._id)}
      >
        Delete
      </button>
    </div>
  );
};

export default ReviewCard;