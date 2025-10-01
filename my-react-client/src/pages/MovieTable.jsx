import { useEffect, useState} from "react";

function MovieTable (){
    const[films, setFilms] = useState([]);

    const deleteFilm = async (title) => {
        //event.preventDefault();
        const json = { title: title},
            body = JSON.stringify(json);

        const response = await fetch("/delete", {
            method: "DELETE",
            headers: {
                "Content-type": "application/json"
            },
            body
        });

        const data = await response.json();
        if (data.success){
            setFilms(films.filter(film => film.title !== title));
        }
    }
        
    useEffect(() => {
        const result = async() => {
            const response = await fetch("/data", {
                method: "GET"
            })

            //Array of films logged by current username is returned as response
            const data = await response.json();
            setFilms(data);
        };

        result();

    }, []);  
        
    return(
        <table>
            <thead>
                <tr className="firstRow">
                    <th>Film</th>
                    <th>Thoughts</th>
                    <th>Rating</th>
                    <th>Date Watched</th>
                    <th>Number of Days Since Seen</th>
                </tr>
            </thead>
            <tbody>
                {films.map((film) => {
                    let today = new Date();
        
                    let watchedDate = new Date(film.date);
                    let diffMs = today - watchedDate;
                    let diffDays = Math.floor(diffMs / (1000 * 60 * 60 *24));

                    return (
                        <tr key={film.title}>
                            <td>{film.title}</td>
                            <td>{film.thoughts}</td>
                            <td>{film.rating}</td>
                            <td>{film.date}</td>
                            <td>{diffDays}</td>
                            <td>
                                <button className="btn" onClick={() => deleteFilm(film.title)}>Delete</button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    )   
   
}

export default MovieTable;