import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (data.success) window.location.href = "/";
        else alert(data.error || "Login failed");
    };

    return (
        <>
            <Navbar />
            <div className="form-card">
                <h1 className="form-title">Login</h1>
                <form onSubmit={handleSubmit} className="form">
                    <label>Username</label>
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="form-input"
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="form-input"
                    />
                    <button type="submit" className="btn submit-btn">Login</button>
                </form>
            </div>
        </>
    );
}
