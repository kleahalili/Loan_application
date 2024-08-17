import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./LoanDetailsPage.css"; // Ensure you have the updated CSS

const LoanDetailsPage = () => {
  const { applicationId } = useParams();
  const [loanDetails, setLoanDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLoanDetails = async () => {
      let token = localStorage.getItem("authToken");
      try {
        const response = await fetch(`http://localhost:8080/api/v1/loan-applications/${applicationId}/loan-details`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLoanDetails(data);
        } else if (response.status === 403) {
          setError("You do not have permission to view this data.");
        } else {
          setError("Failed to load loan details.");
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
      }
    };

    fetchLoanDetails();
  }, [applicationId]);

  const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp, 10));
    return date.toLocaleDateString(); // Adjust the locale or format as needed
  };

  if (error) {
    return <div className="loan-details-container">{error}</div>;
  }

  if (!loanDetails) {
    return <div className="loan-details-container">Loading...</div>;
  }

  return (
    <div className="loan-details-container">
      <h2>Loan Application Details</h2>
      <table className="loan-details-table">
        <thead>
          <tr>
            <th>Application ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Father's Name</th>
            <th>Date of Birth</th>
            <th>Place of Birth</th>
            <th>Email Address</th>
            <th>Phone Number</th>
            <th>Education</th>
            <th>Marital Status</th>
            <th>Requested Amount</th>
            <th>Loan Duration</th>
            <th>Loan Type</th>
            <th>Currency</th>
            <th>Application Status</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{loanDetails.applicationId}</td>
            <td>{loanDetails.firstName}</td>
            <td>{loanDetails.lastName}</td>
            <td>{loanDetails.fatherName}</td>
            <td>{formatDate(loanDetails.dateOfBirth)}</td> {/* Format the date */}
            <td>{loanDetails.placeOfBirth}</td>
            <td>{loanDetails.emailAddress}</td>
            <td>{loanDetails.phoneNumber}</td>
            <td>{loanDetails.education}</td>
            <td>{loanDetails.maritalStatus}</td>
            <td>{loanDetails.requestedAmount}</td>
            <td>{loanDetails.loanDuration}</td>
            <td>{loanDetails.loanType}</td>
            <td>{loanDetails.currency}</td>
            <td>{loanDetails.applicationStatus}</td>
            <td>{formatDate(loanDetails.submittedAt)}</td> {/* Format the submission date */}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LoanDetailsPage;
