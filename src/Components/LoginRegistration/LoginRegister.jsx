import React, { useState } from "react";
import "./LoginRegister.css";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";

const LoginRegister = ({ onSuccessfulLogin }) => {
  const [action, setAction] = useState("");
  const [email, setEmail] = useState("");
  // const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleSuccessfulLogin = () => {
    onSuccessfulLogin();
  };

  const registerLink = () => {
    setAction("active");
  };

  const loginLink = () => {
    setAction("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    // Validate username and password
    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    // Login request
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
        console.log(data);
        handleSuccessfulLogin();
        console.log("Login successful!");
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
        console.log(data);
        handleSuccessfulLogin();
        console.log("Registration successful!");
        localStorage.setItem("authToken", data.token);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className={`wrapper ${action}`}>
      <div className="form-box login">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <div className="input-box">
            <FaUser className="icon" />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-box">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
            />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit">Login</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="register-link">
            <p>
              Don't have an account?
              <a href="#" onClick={registerLink}>
                Register
              </a>
            </p>
          </div>
        </form>
      </div>

      <div className="form-box register">
        <form onSubmit={handleRegister}>
          <h1>Register</h1>
          {/* <div className="input-box">
            <FaUser className="icon" />
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div> */}

          <div className="input-box">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-box">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> I agree to the terms & conditions
            </label>
          </div>
          <button type="submit">Register</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="register-link">
            <p>
              Already have an account?
              <a href="#" onClick={loginLink}>
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;
