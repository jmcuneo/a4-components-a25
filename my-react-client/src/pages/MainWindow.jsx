import { useNavigate } from 'react-router-dom';
import EnterForm from './EnterForm.jsx'
import './main.css'

function MainWindow(){
    const navigate = useNavigate();

    return(
        <div className ="window">
            <link rel="stylesheet" href="https://unpkg.com/@sakun/system.css" />
            <button id="view" className = "btn" onClick={() => navigate("/logs")}>View Logged Films</button>
            <br/>
            <br></br>
            <div className = "title-bar">
                <h1 className = "title">Movie Log</h1>
            </div>
            <br></br>
            {/*Form to enter films:*/}
            <EnterForm />
        </div>
    );
}

export default MainWindow;