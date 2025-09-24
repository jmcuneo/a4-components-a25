import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { checkAuth, showLoginForm } from './auth';

// Initialize auth check and mount React app
const initializeApp = async () => {
  try {
    const isAuthenticated = await checkAuth();
    
    const mountNode = document.getElementById('react-root');
    if (!mountNode) {
      console.error('React root element not found!');
      return;
    }
    
    if (isAuthenticated) {
      console.log('User is authenticated, rendering React app');
      const root = createRoot(mountNode);
      root.render(<App />);
    } else {
      console.log('User is not authenticated, showing login form');
      // The checkAuth function will call showLoginForm if not authenticated
    }
  } catch (error) {
    console.error('Error during initialization:', error);
  }
};

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}