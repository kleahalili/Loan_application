import React, { useState } from "react";
import "../HomePage/HomePage.css";
import "./LoanApplication.css";

function LoanApplication() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    emailAddress: "",
    phoneNumber: "",
    education: "Pa Arsim",
    maritalStatus: "Beqar",
    requestedAmount: "",
    currency: "USD",
    loanDuration: "",
    loanType: "Kredi per shtepi",
  });

  const [showMore, setShowMore] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // You can perform validation and submit to the database here
    let url = "http://localhost:8080/api/v1/loan-applications";
    let token = localStorage.getItem("authToken");

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.status === 201) {
          console.log("Loan application submitted successfully!");
          // redirect to home page
          if (typeof window !== 'undefined') {
            window.location.href = '/'; 
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleMoreClick = () => {
    setShowMore(true);
  };

  const handleBackClick = () => {
    setShowMore(false);
  };

  return (
    <div className="credit-form">
      <h2>Loan Application Form</h2>
      <form onSubmit={handleSubmit}>
        {!showMore ? (
          <>
            <label>
              First Name:
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Father's Name:
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Date of Birth:
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Place of Birth:
              <input
                type="text"
                name="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
                required
              />
            </label>
            <button
              type="button"
              onClick={handleMoreClick}
              className="show-more-button"
            >
              More
            </button>
          </>
        ) : (
          <>
            <label>
              Phone Number:
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Education:
              <select
                name="education"
                value={formData.education}
                onChange={handleChange}
              >
                <option value="Pa Arsim">Pa Arsim</option>
                <option value="Arsim Fillor">Arsim Fillor</option>
                <option value="Shkolle e Mesme">Shkolle e Mesme</option>
                <option value="Arsim I Larte">Arsim i Larte</option>
                <option value="Doktorature">Doktorature</option>
              </select>
            </label>

            <label>
              Marital Status:
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
              >
                <option value="Beqar">Beqar</option>
                <option value="I Martuar">I Martuar</option>
              </select>
            </label>

            <label>
              Loan Amount:
              <input
                type="number"
                name="requestedAmount"
                value={formData.requestedAmount}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Currency:
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </label>
            <label>
              Loan Duration (in months):
              <input
                type="number"
                name="loanDuration"
                value={formData.loanDuration}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Loan Type:
              <select
                name="loanType"
                value={formData.loanType}
                onChange={handleChange}
              >
                <option value="Kredi per shtepi">Kredi per shtepi</option>
                <option value="Kredi per makine">Kredi per makine</option>
                <option value="Kredi personale">Kredi personale</option>
              </select>
            </label>
            <div className="form-buttons">
              <button
                type="button"
                onClick={handleBackClick}
                className="back-button"
              >
                Back
              </button>
              <button type="submit" className="submit-button">
                Submit
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default LoanApplication;
