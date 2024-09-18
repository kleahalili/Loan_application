import React, { useState } from "react";
import "./LoginRegister.css";
import logoImage from "../Assets/bkt4.jpg"; // Use the correct path to your logo

const LoginRegister = ({ onSuccessfulLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSuccessfulLogin = () => {
    onSuccessfulLogin();
  };

  const handleToggle = () => {
    setIsRegistering(!isRegistering);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    fetch("http://localhost:8080/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          setErrorMessage("Wrong email or password");
        }
        return response.json();
      })
      .then((data) => {
        handleSuccessfulLogin();
        localStorage.setItem("authToken", data.token);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Email, and password are required.");
      return;
    }

    fetch("http://localhost:8080/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          setErrorMessage("Something went wrong. Please try again.");
        }
        return response.json();
      })
      .then((data) => {
        handleSuccessfulLogin();
        localStorage.setItem("authToken", data.token);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="login-container">
      <div className="form-box">
        <div className="logo-container">
          <img src={logoImage} alt="Logo" />
        </div>
        <h2>{isRegistering ? "Sign Up" : "Sign In"}</h2>
        <p>{isRegistering ? "Create a new account" : "Sign in to manage all your devices"}</p>
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {!isRegistering && (
            <div className="remember-forgot">
              <a href="#">Forgot password?</a>
            </div>
          )}
          <button type="submit">{isRegistering ? "Sign Up" : "Sign In"}</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
        <div className="register-link">
          <p>
            {isRegistering ? "Already have an account?" : "Don't have an account?"}
            <a href="#" onClick={handleToggle}>
              {isRegistering ? "Sign In" : "Sign Up"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;