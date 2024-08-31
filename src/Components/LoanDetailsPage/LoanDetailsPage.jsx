import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./LoanDetailsPage.css";

const LoanDetailsPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [loanDetails, setLoanDetails] = useState(null);
  const [statusChangeCount, setStatusChangeCount] = useState(0);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is an admin
  const [popupMessage, setPopupMessage] = useState(""); // State for popup message

  useEffect(() => {
    const fetchLoanDetails = async () => {
      let token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/loan-applications/${applicationId}/loan-details`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setLoanDetails(data);

          // Fetch user details to check if the user is an admin
          const userResponse = await fetch("http://localhost:8080/api/v1/auth/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = await userResponse.json();
          if (userData.role === "ADMIN") {
            setIsAdmin(true);
          }
        } else if (response.status === 403) {
          setError("You do not have permission to view this data.");
          navigate("/login");
        } else {
          setError("Failed to load loan details.");
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
      }
    };

    fetchLoanDetails();
  }, [applicationId, statusChangeCount, navigate]);

  const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp, 10));
    return date.toLocaleDateString(); // Adjust the locale or format as needed
  };

  const handleStatusChange = async (status) => {
    let token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    let url = `http://localhost:8080/api/v1/loan-applications/${applicationId}?status=${status}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setPopupMessage("Email sent successfully"); // Ensure the message is set correctly
        setStatusChangeCount(statusChangeCount + 1);
        // Clear the popup message after 7 seconds
        setTimeout(() => setPopupMessage(""), 7000);
      } else {
        setPopupMessage("Failed to update status.");
        // Clear the popup message after 7 seconds
        setTimeout(() => setPopupMessage(""), 7000);
      }
    } catch (err) {
      console.error(err);
      setPopupMessage("An error occurred. Please try again.");
      // Clear the popup message after 7 seconds
      setTimeout(() => setPopupMessage(""), 7000);
    }
  };

  const handleRequestDocumentUpload = () => {
    let token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    let url = `http://localhost:8080/api/v1/loan-applications/${applicationId}/request-document`;

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          setPopupMessage("Document request sent.");
          setStatusChangeCount(statusChangeCount + 1);
          // Clear the popup message after 7 seconds
          setTimeout(() => setPopupMessage(""), 7000);
        } else {
          setPopupMessage("Failed to request document. Please try again.");
          // Clear the popup message after 7 seconds
          setTimeout(() => setPopupMessage(""), 7000);
        }
      })
      .catch((err) => {
        console.error(err);
        setPopupMessage("An error occurred. Please try again.");
        // Clear the popup message after 7 seconds
        setTimeout(() => setPopupMessage(""), 7000);
      });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      let token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      let url = `http://localhost:8080/api/v1/loan-applications/${applicationId}/upload-document`;

      fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            setPopupMessage("Document uploaded successfully!");
            setStatusChangeCount(statusChangeCount + 1); // Re-fetch the loan details to update the UI
            // Clear the popup message after 7 seconds
            setTimeout(() => setPopupMessage(""), 7000);
          } else {
            setPopupMessage("Failed to upload document. Please try again.");
            // Clear the popup message after 7 seconds
            setTimeout(() => setPopupMessage(""), 7000);
          }
        })
        .catch((err) => {
          console.error(err);
          setPopupMessage("An error occurred. Please try again.");
          // Clear the popup message after 7 seconds
          setTimeout(() => setPopupMessage(""), 7000);
        });
    }
  };

  if (error) {
    return <div className="loan-details-container">{error}</div>;
  }

  if (!loanDetails) {
    return <div className="loan-details-container">Loading...</div>;
  }

  return (
    <div className="loan-details-container">
      {popupMessage && <div className="popup">{popupMessage}</div>}
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <h2>Loan Application Details</h2>
      <div className="loan-details-content">
        <div className="loan-details-section">
          <h3>Personal Information</h3>
          <p><strong>Application ID:</strong> {loanDetails.applicationId}</p>
          <p><strong>First Name:</strong> {loanDetails.firstName}</p>
          <p><strong>Last Name:</strong> {loanDetails.lastName}</p>
          <p><strong>Father's Name:</strong> {loanDetails.fatherName}</p>
          <p><strong>Date of Birth:</strong> {formatDate(loanDetails.dateOfBirth)}</p>
          <p><strong>Place of Birth:</strong> {loanDetails.placeOfBirth}</p>
          <p><strong>Email Address:</strong> {loanDetails.emailAddress}</p>
          <p><strong>Phone Number:</strong> {loanDetails.phoneNumber}</p>
        </div>
        <div className="loan-details-section">
          <h3>Loan Information</h3>
          <p><strong>Requested Amount:</strong> {loanDetails.requestedAmount}</p>
          <p><strong>Loan Duration:</strong> {loanDetails.loanDuration}</p>
          <p><strong>Loan Type:</strong> {loanDetails.loanType}</p>
          <p><strong>Currency:</strong> {loanDetails.currency}</p>
          <p><strong>Application Status:</strong> {loanDetails.applicationStatus}</p>
          <p><strong>Submitted At:</strong> {formatDate(loanDetails.submittedAt)}</p>
        </div>
      </div>

      <table className="loan-actions-table">
        <thead>
          <tr>
            <th>Actions</th>
            <th>Request Document</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {(loanDetails.applicationStatus === "Applied" || loanDetails.applicationStatus === "Documents Requested") ? (
                <>
                  <button onClick={() => handleStatusChange("Approved")}>Approve</button>
                  <button onClick={() => handleStatusChange("Rejected")}>Reject</button>
                </>
              ) : (
                "N/A" // Display "N/A" when the application is not in a status where it can be approved or rejected
              )}
            </td>
            <td>
              {(loanDetails.applicationStatus === "Applied" || loanDetails.applicationStatus === "Documents Requested") ? (
                <button onClick={handleRequestDocumentUpload}>Request Document Upload</button>
              ) : (
                "N/A" // Display "N/A" when the application is not in a status where it can be approved or rejected
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LoanDetailsPage;
