import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [data, setReviewData] = useState({
    title: "",
    year: "",
    blurb: "",
    gameplayRating: "",
    storyRating: "",
    visualsRating: "",
    musicRating: ""
  });

  const handleChange = (event) => {
    setReviewData({
      ...data,
      [event.target.id]: event.target.value
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const review = {
      title: data.title,
      year: parseInt(data.year) || 0,
      blurb: data.blurb,
      gameplayRating: parseInt(data.gameplayRating) || 0,
      storyRating: parseInt(data.storyRating) || 0,
      visualsRating: parseInt(data.visualsRating) || 0,
      musicRating: parseInt(data.musicRating) || 0
    }

    try {
      const response = await fetch("http://localhost:3000/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review)
      });

      if (response.ok) {
        navigate("/reviews");
      } else {
        console.error("Error Submitting Review");
      }
    } catch (error) {
      console.error("Error Submitting Review:", error);
    }}

  return (
    <div className="create-review">
      <h2>Create Review:</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title: </label>
        <input 
          type="text" 
          className="nes-input" 
          id="title"
          value={data.title}
          onChange={handleChange}
          required
        />
        <br/>
        <label htmlFor="year">Release Year: </label>
        <input 
          type="number" 
          className="nes-input" 
          id="year"
          value={data.year}
          onChange={handleChange}
          required
        />
        <br/>
        <label htmlFor="blurb">Blurb: </label>
        <input 
          type="text" 
          id="blurb" 
          className="nes-input" 
          placeholder="Your Review"
          value={data.blurb}
          onChange={handleChange}
          required
        />
        <br/>
        <label htmlFor="gameplayRating">Gameplay Rating: </label>
        <input 
          type="number" 
          id="gameplayRating" 
          className="nes-input" 
          placeholder="1-10"
          min="1"
          max="10"
          value={data.gameplayRating}
          onChange={handleChange}
          required
        />
        <br/>
        <label htmlFor="storyRating">Story Rating: </label>
        <input 
          type="number" 
          id="storyRating" 
          className="nes-input" 
          placeholder="1-10"
          min="1"
          max="10"
          value={data.storyRating}
          onChange={handleChange}
          required
        />
        <br/>
        <label htmlFor="visualsRating">Visuals Rating: </label>
        <input 
          type="number" 
          id="visualsRating" 
          className="nes-input" 
          placeholder="1-10"
          min="1"
          max="10"
          value={data.visualsRating}
          onChange={handleChange}
          required
        />
        <br/>
        <label htmlFor="musicRating">Music Rating: </label>
        <input 
          type="number" 
          id="musicRating" 
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
        <button type="submit" className="nes-btn">Post</button>
      </form>
    </div>
  );
}

export default Index;