import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginRegister from "./Components/LoginRegistration/LoginRegister";
import HomePage from "./Components/HomePage/HomePage";
import NavBar from "./Components/NavBar/NavBar";
import LoanApplication from "./Components/LoanApplication/LoanApplication";
import UserProfile from "./Components/UserProfile/UserProfile";
import StatisticsPage from "./Components/StatisticsPage/StatisticsPage"; 
import LoanDetailsPage from "./Components/LoanDetailsPage/LoanDetailsPage"; 


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const isUserLoggedIn = storedToken && isValidToken("http://localhost:8080/api/v1/check-token", storedToken);

    if (isUserLoggedIn) {
      setIsAuthenticated(true);
      fetchUserDetails(storedToken);
    }
  }, []);

  async function isValidToken(url, token) {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Corrected this line
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
          Authorization: `Bearer ${token}`, // Corrected this line
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
          {/* Redirect root to home */}
          <Route path="/" element={<Navigate to="/home" />} />

          <Route
            path="/home"
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

          <Route
            path="/loan-details/:applicationId"
            element={
              isAuthenticated ? (
                <>
                  <NavBar isAdmin={isAdmin} />
                  <LoanDetailsPage />
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
