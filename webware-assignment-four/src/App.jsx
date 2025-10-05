import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Index from './pages/IndexPage';
import Reviews from './pages/ReviewsPage';
import Login from './pages/LoginPage';
import Register from './pages/RegistrationPage';
import Navigation from './components/Navigation';
import './index.css';

function App() {
  const [user, setUser] = useState(null);

  const checkUserStatus = async () => {
    try {
      const response = await fetch("http://localhost:3000/user");
      console.log("Attempting Fetch User");
      const session = await response.json();
      console.log(session.status);
      if (session.status) {
        setUser(session.user);
        console.log(session.user);
      }
    } catch (error) {
      console.error("Error: Failed to fetch user status");
    }
  };

  useEffect(() => { checkUserStatus(); }, [checkUserStatus]);

  const logout = async () => {
    await fetch("http://localhost:3000/logout", {
      method: "POST"
    });
    setUser(null);
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Navigation user={user} onLogout={ logout }/>
        <main>
          <Routes>
            <Route path="/" element={ <Index/> }/>
            <Route path="/reviews" element={ <Reviews/> }/>
            <Route path="/login" element={ <Login/> }/>
            <Route path="/register" element={ <Register/> }/>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
