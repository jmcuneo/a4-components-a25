import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

let register;
let login;
let passwordError;


export default function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const nav = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {

            let body = JSON.stringify({name: username, password: password});

            //debugger
            //console.log(body)
            //debugger

            let response = await fetch("/login_user", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'same-origin',
                body
            });

            let result = await response.json();

            if (result.can_login === false) {
                setError(result.error);
                console.log("login failed!")
            } else {
                console.log("login successful!")
                nav("/user_content");
            }

        } catch (error) {
            console.log(error)
        }

    };

    const handleRegisterRedirect = () => {
        nav("/Register");
    };

    useEffect(() => {
        const checkLogin = async () => {
            try {

                const response = await fetch("/login_status", {
                    method: "GET",
                    credentials: "same-origin" }
                );

                const result = await response.json();
                console.log(result);
                if (result.can_login) {nav("/user_content");}

            } catch (error) {
                console.error("Error checking login:", error);
            }
        };

        checkLogin();
    }, []);


    // used this tool: https://transform.tools/html-to-jsx
    return (
        <>

            <header className="d-flex align-items-center justify-content-evenly bg-primary text-white p-4 mb-4">

                <img src="/images/icon.png" alt="logo" className="img-fluid" />

                <h1 className="fw-bold display-2 text-center">
                    Assignment Priority Generator
                </h1>

            </header>

            <main className="login-page d-flex justify-content-center">

                <div className="card login-card p-4 w-75 mb-4 shadow-lg">

                    <h1 className="text-center mb-4">Login</h1>

                    <form id="login-form">

                        <div className="mb-3">

                            <label htmlFor="login-id" className="form-label">Username</label>

                            <input type="text" className="form-control" id="login-id" name="name" placeholder="Enter username" required
                                value = {username} onChange={(event) => setUsername(event.target.value)}
                            />

                        </div>

                        <div className="d-flex justify-content-center">

                            <span id="password-error" className="h3 mb-2 text-danger-emphasis fw-semibold">
                                {error}
                            </span>

                        </div>

                        <div className="mb-3">

                            <label htmlFor="pass-id" className="form-label">
                                Password
                            </label>

                            <input type = "password" className = "form-control" id = "pass-id" name = "password" placeholder = "Enter password" required
                                value = {password} onChange={(event) => setPassword(event.target.value)}
                            />

                        </div>

                            <button type="button" id="login-button" className="btn btn-primary w-100 mb-2" onClick={handleLogin}>
                                Login
                            </button>

                            <button type="button" id="register-button" className="btn btn-secondary w-100 mb-2" onClick= {handleRegisterRedirect}>
                                Register
                            </button>

                    </form>

                </div>

            </main>
        </>


    );


}
