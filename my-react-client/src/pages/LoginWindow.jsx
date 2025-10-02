import {useState} from "react";
import { useNavigate } from 'react-router-dom';

function LoginWindow(){

    const [logintext, setLoginText] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const login = async function(event){
        //alert("I don't want you to log in right now");
        event.preventDefault();

        const user = event.target.username.value;
        const pass = event.target.password.value;
        
        const json = { username: user, password: pass};
        const body = JSON.stringify(json);

        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body
        });

        const data = await response.json();
        setLoginText(data)

        if (data.success == true){
            navigate("/main");
        }

        event.target.reset();
    }   


    return (
        <div className = "window">
            <link rel="stylesheet" href="https://unpkg.com/@sakun/system.css" />
            <h1 className="title">Login</h1>
            
            <form onSubmit={login}>
                <label htmlFor="username">Username:</label>
                <input type = "username" id="username" name="username"/>
                <br/>
                <label htmlFor="password">Password:</label>
                <input type = "password" id="password" name="password"/>
                <br/>
                <div className="center">
                    <button id="login" className = "btn">Login</button>
                </div>
                <p>{logintext.message}</p>
            </form>

        </div>
    )
}

export default LoginWindow;