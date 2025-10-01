import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const { authenticated, currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (authenticated) {
    return (
      <div id="authenticated" className="text-text-main-color">
        <div className="flex items-center mb-4">
          {currentUser.avatar && (
            <img 
              src={currentUser.avatar} 
              alt="User avatar"
              className="w-8 h-8 rounded-full mr-2"
            />
          )}
          <span>Welcome, {currentUser.name || currentUser.username}!</span>
        </div>
      </div>
    );
  }

  return (
    <div id="not-authenticated" className="text-center">
      <div id="auth-card" className="bg-white p-6 rounded-lg border-2 border-dotted border-card-accent-color">
        <h2 className="text-xl text-text-main-color mb-4">Please login to continue</h2>
        <a 
          href="/auth/github"
          className="bg-[#9EDDFF] hover:bg-[#4a9eff] text-text-main-color px-6 py-2 rounded-xl"
        >
          Login with GitHub
        </a>
      </div>
    </div>
  );
}

export default Login;