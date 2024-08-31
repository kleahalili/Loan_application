import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import bktLogo from "../Assets/bkt.jpg"; // Corrected path to the image

function NavBar({ isAdmin }) {
  const logout = () => {
    localStorage.removeItem("authToken");

    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <div className="sidebar">
      <header className="sidebar-header">
        <h1> Welcome to X Bank</h1>
      </header>
      <nav className="sidebar-nav">
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
      <footer className="sidebar-footer">
        <img src={bktLogo} alt="BKT Logo" className="sidebar-logo" />
      </footer>
    </div>
  );
}

export default NavBar;
