import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import CarInventory from './components/CarInventory';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/cars', {
        credentials: 'include'  // Add this line
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUser('User');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleLogout = () => {
    setUser(null);
    window.location.href = '/logout';
  };

  if (loading) {
    return (
        <div className="loading-container">
          <div className="spinner-border text-light mb-3" style={{width: '3rem', height: '3rem'}} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-white">Loading Car Inventory...</h5>
        </div>
    );
  }

  return (
      <div className="app-container">
        {user ? (
            <CarInventory username={user} onLogout={handleLogout} />
        ) : (
            <Login onLogin={handleLogin} />
        )}
      </div>
  );
}

export default App;