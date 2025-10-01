import { useState } from "react"; 
function ChangeForm(){
    const [rating, setRating] = useState(0);

    const handleChange = async (event) => {
        event.preventDefault();
        
        const inputTitle = event.target.title.value;
        alert(inputTitle)
        const json = {changeTitle: inputTitle, changeRating: rating}
        alert(rating)
        const body = JSON.stringify(json);

        const response = await fetch("/change", {
            method: "PATCH",
            headers: {
                "Content-type": "application/json"
            },
            body
        });
        const data = await response.json();
        console.log("server response:", data);

        alert(data.message)

        event.target.reset();
        setRating(0);
    }

    

    return (
        <div>
            <form onSubmit={handleChange}>
            <label htmlFor="changeTitle">Which Film to Change Rating?: (Enter the Full Title of the Film)</label>
            <input type = "text" id="title" name="title"/>
            <label htmlFor="rating">Your rating:</label>
            {/*onClick={() => deleteFilm(film.title)}*/}
            <div className ="rating">
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
            <br/><br/>
            
            <div className="center">
                <button id="change" className = "btn">Change</button>
            </div>
            </form>
        </div>
        
    )
}

export default ChangeForm;