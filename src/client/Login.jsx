import { useState } from "react";
import { useNavigate } from 'react-router-dom'

import './styles.css'


function Login({ onLoginSuccess }) {
const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.success) {
      navigate('/data')
    } else {
      setMsg(data.msg);
    }
  };

  return (
    <div>
      <h1>Welcome to the Favorite Database!</h1>
      <h2>Please Log In</h2>

      <form onSubmit={handleSubmit} className="pure-form">
        <label htmlFor="username">Username</label> <br />
        <input type="text" id="username" value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <br />
        <label htmlFor="password">Password</label> <br />
        <input type="password" id="password" value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <button type="submit" className="pure-button">Submit</button>
      </form>

      {msg && (
        <p> {msg}</p>
      )}
    </div>
  );
}

export default Login;