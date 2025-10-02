import ChangeForm from './ChangeForm.jsx'
import MovieTable from './MovieTable.jsx'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState} from "react";

function LoggedFilms(){
    const navigate = useNavigate();
    const [films, setFilms] = useState([]);

    return(
        <div className = "window">
            <link rel="stylesheet" href="https://unpkg.com/@sakun/system.css" />
            <button className = "btn" onClick={() => navigate("/main")}>Back</button>
            <br/>
            <br></br>
            <div className = "title-bar">
                <h1 className = "title">Your Logged Films</h1>
            </div>
            <h4>& You Can Change the Rating of a Logged Film.</h4>

            <ChangeForm films={films} setFilms={setFilms} />
            <hr/>
            <MovieTable films={films} setFilms={setFilms} />
        </div>
    )
}

export default LoggedFilms;