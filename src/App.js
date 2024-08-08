import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginRegister from "./Components/LoginRegistration/LoginRegister";
import HomePage from "./Components/HomePage/HomePage";
import NavBar from "./Components/NavBar/NavBar";
import LoanApplication from "./Components/LoanApplication/LoanApplication";
import UserProfile from "./Components/UserProfile/UserProfile";
import StatisticsPage from "./Components/StatisticsPage/StatisticsPage";  // Import the Statistics page

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Add this state

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const isUserLoggedIn = storedToken && isValidToken("http://localhost:8080/api/v1/check-token", storedToken);

    if (isUserLoggedIn) {
      setIsAuthenticated(true);
      // Fetch user details to check if the user is admin
      fetchUserDetails(storedToken);
    }
  }, []);

  async function isValidToken(url, token) {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async function fetchUserDetails(token) {
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.role === "ADMIN") {
        setIsAdmin(true);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <>
                  <NavBar isAdmin={isAdmin} />
                  <HomePage />
                </>
              ) : (
                <LoginRegister onSuccessfulLogin={() => setIsAuthenticated(true)} />
              )
            }
          />
          <Route
            path="/apply"
            element={
              isAuthenticated ? (
                <>
                  <NavBar isAdmin={isAdmin} />
                  <LoanApplication />
                </>
              ) : (
                <LoginRegister onSuccessfulLogin={() => setIsAuthenticated(true)} />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <>
                  <NavBar isAdmin={isAdmin} />
                  <UserProfile />
                </>
              ) : (
                <LoginRegister onSuccessfulLogin={() => setIsAuthenticated(true)} />
              )
            }
          />
          <Route
            path="/statistics"
            element={
              isAuthenticated && isAdmin ? (
                <>
                  <NavBar isAdmin={isAdmin} />
                  <StatisticsPage />
                </>
              ) : (
                <LoginRegister onSuccessfulLogin={() => setIsAuthenticated(true)} />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
