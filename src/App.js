import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './Components/LoginRegistration/LoginRegister';
import HomePage from './Components/HomePage/HomePage';
import NavBar from './Components/NavBar/NavBar';
import LoanApplication from './Components/LoanApplication/LoanApplication';
import UserProfile from './Components/UserProfile/UserProfile';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const isUserLoggedIn = storedToken && isValidToken("http://localhost:8080/api/v1/check-token", storedToken);

    if (isUserLoggedIn) {
      setIsAuthenticated(true);
    }
  }, []);

  async function isValidToken(url, token) {
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(response => {
        if (!response.ok){
          return false;
        }
        return true;
      }).catch(err => {
          console.error(err);
      });
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
                  <NavBar />
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
                  <NavBar />
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
                  <NavBar />
                  <UserProfile />
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
