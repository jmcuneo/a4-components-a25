import { useState } from "react"; 


function EnterForm() {
    const [rating, setRating] = useState(0);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const inputTitle = event.target.title.value;
        const inputThoughts = event.target.thoughts.value;
        const inputDate = event.target.date.value;

        const json = {title: inputTitle, thoughts: inputThoughts, date: inputDate, rating: rating}
        const body = JSON.stringify(json);
        
        const response = await fetch("/submit", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body
        });
        
        const data = await response.json();
        console.log("server response:", data);
        
        event.target.reset();
        setRating(0);

    }



  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Movie Title:</label>
      <input type="text" id="title" name="title" />
      <br />

      <label htmlFor="thoughts">Brief thoughts:</label>
      <input type="text" id="thoughts" name="thoughts" />
      <br />

      <label htmlFor="date">Date Watched:</label>
      <input type="date" id="date" className="date" name="date" />
      <br />

      <label>Your rating:</label>
      <div className="rating">
        <input type="radio" id="star5" name="rating" value="5" onClick={() => setRating(5)}/>
        <label htmlFor="star5">★</label>

        <input type="radio" id="star4" name="rating" value="4" onClick={() => setRating(4)}/>
        <label htmlFor="star4">★</label>

        <input type="radio" id="star3" name="rating" value="3" onClick={() => setRating(3)}/>
        <label htmlFor="star3">★</label>

        <input type="radio" id="star2" name="rating" value="2" onClick={() => setRating(2)}/>
        <label htmlFor="star2">★</label>

        <input type="radio" id="star1" name="rating" value="1" onClick={() => setRating(1)}/>
        <label htmlFor="star1">★</label>
      </div>

      <br /><br />
        <div className="center">
            <button id="submit" className="btn">Submit</button>
        </div>
      <br />
    </form>
  );
}

export default EnterForm;
