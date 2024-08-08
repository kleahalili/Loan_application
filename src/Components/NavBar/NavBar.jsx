import React from "react";
import { Link } from "react-router-dom";

function NavBar({ isAdmin }) {
  const logout = () => {
    localStorage.removeItem("authToken");

    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <div>
      <header className="header">
        <h1>Welcome to X Bank</h1>
      </header>
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/apply">Loan Applications</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          {isAdmin && (
            <li>
              <Link to="/statistics">Show Statistics</Link>
            </li>
          )}
          <li>
            <a href="#" onClick={logout}>
              Logout
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;
