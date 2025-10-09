// client/src/components/Navbar.jsx
import React from "react";

export default function Navbar({ user }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <a className="navbar-brand fw-bold" href="/">
          🎯 BucketBuddy
        </a>
        <div className="d-flex">
          {user ? (
            <>
              <span className="navbar-text me-3 text-light">
                Hi, {user.username}
              </span>
              <form method="post" action="/logout">
                <button className="btn btn-outline-light btn-sm" type="submit">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <a className="btn btn-outline-light btn-sm" href="/auth/github">
              Login with GitHub
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
