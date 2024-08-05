import React from "react";

function NavBar() {
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
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/apply">Credit Applications</a>
        </li>
        <li>
          <a href="/profile">Profile</a>
        </li>
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
