import React, { useState, useEffect } from "react";
import "./HomePage.css";

const HomePage = () => {
  const [lastLogin, setLastLogin] = useState("");
  const [loanApplications, setLoanApplications] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [statusChangeCount, setStatusChangeCount] = useState(0);
  const [userFullName, setUserFullName] = useState("");

  useEffect(() => {
    let url = "http://localhost:8080/api/v1/loan-applications";
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
        setLoanApplications(data);
      })
      .catch((err) => {
        console.error(err);
      });

    // Get user info
    url = "http://localhost:8080/api/v1/auth/user";
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
        if (data.role === "ADMIN") {
          setIsAdmin(true);
        }

        if (data.lastLoginTime > 0) {
          const t = new Date(data.lastLoginTime);
          const formattedDate = `${t.toLocaleDateString()}, ${t.toLocaleTimeString()}`;
          setLastLogin(formattedDate);
        } else {
          setLastLogin("Just registered");
        }

        setUserFullName(data.email.split("@")[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [statusChangeCount]);

  const handleStatusChange = (id, status) => {
    let token = localStorage.getItem("authToken");
    let url = `http://localhost:8080/api/v1/loan-applications/${id}?status=${status}`;
    fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setStatusChangeCount(statusChangeCount + 1);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleRequestDocumentUpload = (applicationId) => {
    let token = localStorage.getItem("authToken");
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
          alert("Document request sent.");
          setStatusChangeCount(statusChangeCount + 1); // To refresh the list and show the updated status
        } else {
          alert("Failed to request document. Please try again.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred. Please try again.");
      });
  };

  const handleFileUpload = (applicationId, event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      let token = localStorage.getItem("authToken");
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
            alert("Document uploaded successfully!");
            setStatusChangeCount(statusChangeCount + 1); // Refresh the list
          } else {
            alert("Failed to upload document. Please try again.");
          }
        })
        .catch((err) => {
          console.error(err);
          alert("An error occurred. Please try again.");
        });
    }
  };

  return (
    <div className="home-container">
      <h2>Welcome, {userFullName}</h2>
      <main className="main-content">
        <div className="loan-applications">
          <h2>Loan Applications</h2>
          <table className="loan-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Loan Amount</th>
                <th>Loan Duration (months)</th>
                <th>Submit Date</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
                <th>Manage Documents</th>
              </tr>
            </thead>
            <tbody>
              {loanApplications && loanApplications.length > 0 ? (
                loanApplications.map((application) => (
                  <tr key={application.applicationId}>
                    <td>{application.applicationId}</td>
                    <td>{application.firstName}</td>
                    <td>{application.lastName}</td>
                    <td>{application.loanAmount}</td>
                    <td>{application.loanDuration}</td>
                    <td>
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </td>
                    <td>{application.applicationStatus}</td>
                    {isAdmin && (
                      <td>
                        {application.applicationStatus === "Applied" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  application.applicationId,
                                  "Approved"
                                )
                              }
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  application.applicationId,
                                  "Rejected"
                                )
                              }
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    )}
                    <td>
                      {isAdmin && application.documentUploaded === false && (
                        <button
                          onClick={() =>
                            handleRequestDocumentUpload(
                              application.applicationId
                            )
                          }
                        >
                          Request Document Upload
                        </button>
                      )}
                      {!isAdmin && application.documentUploaded === true && (
                        <>
                          <label
                            htmlFor={`file-upload-${application.applicationId}`}
                            className="upload-button"
                          >
                            Upload Document
                          </label>
                          <input
                            id={`file-upload-${application.applicationId}`}
                            type="file"
                            accept=".pdf, .docx"
                            style={{ display: "none" }}
                            onChange={(event) =>
                              handleFileUpload(application.applicationId, event)
                            }
                          />
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? "9" : "7"}>
                    No loan applications available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      <footer className="footer">
        <p>Last login: {lastLogin}</p>
      </footer>
    </div>
  );
};

export default HomePage;
