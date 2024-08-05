// CreditForm.js
import React, { useState, useEffect } from "react";
import "../HomePage/HomePage.css";

function LoanApplication() {
  const [formData, setFormData] = useState({ newEmail: "", newPassword: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let url = "http://localhost:8080/api/v1/auth/user";
    let token = localStorage.getItem("authToken");

    fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("Modified");
          localStorage.removeItem("authToken");
          if (typeof window !== "undefined") {
            window.location.href = "/"; // Replace '/' with your actual homepage URL if different
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    console.log(formData); // You can perform validation and submit to the database here
    let url = "http://localhost:8080/api/v1/auth/user";
    let token = localStorage.getItem("authToken");

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        setFormData({ newEmail: data.email });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="credit-form">
      <h2>User Info</h2>
      <form onSubmit={handleSubmit}>
        {/* General Information */}
        <label>
          Email:
          <input
            type="email"
            name="newEmail"
            value={formData.newEmail}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
          />
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default LoanApplication;
