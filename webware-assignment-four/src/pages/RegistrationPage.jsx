import { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = ({ onRegister }) => {
  const [data, setRegistrationData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setRegistrationData({
      ...data,
      [event.target.id]: event.target.value
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        window.location.href = "/";
        setError('');
        onRegister(result.user);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Error: Failed To Register");
    }
  }

  return (
    <div className="create-review">
      <h2>Register:</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input 
          type="text" 
          id="username" 
          value={data.username}
          onChange={handleChange}
          required
        />
        <br/>
        
        <label htmlFor="password">Password:</label>
        <input 
          type="password" 
          id="password" 
          value={data.password}
          onChange={handleChange}
          required
        />
        
        {error && (
          <div id="authorisation-error-message" className="nes-text is-error">
            {error}
          </div>
        )}
        
        <br/>
        <button type="submit" className="nes-btn">Register</button>
        
        <Link to="/login" className="darker-link">Don't Have An Account? Login Here</Link>
      </form>
    </div>
  );
}

export default Register;
