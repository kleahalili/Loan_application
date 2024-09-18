import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [lastLogin, setLastLogin] = useState("");
  const [loanApplications, setLoanApplications] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [statusChangeCount, setStatusChangeCount] = useState(0);
  const [userFullName, setUserFullName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    let url = "http://localhost:8080/api/v1/loan-applications";
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 403) {
          navigate("/login"); // If unauthorized, redirect to login
        }
      })
      .then((data) => {
        // Sort loan applications to prioritize "Applied" and "Documents Requested" statuses
        const sortedData = data.sort((a, b) => {
          const statusOrder = {
            Applied: 1,
            "Documents Requested": 2,
            Approved: 3,
            Rejected: 4,
          };

          return (statusOrder[a.applicationStatus] || 5) - (statusOrder[b.applicationStatus] || 5);
        });

        setLoanApplications(sortedData);
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
        } else if (response.status === 403) {
          navigate("/login"); // If unauthorized, redirect to login
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
  }, [statusChangeCount, navigate]);

  const handleDeleteApplication = (applicationId) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      let token = localStorage.getItem("authToken");
      let url = `http://localhost:8080/api/v1/loan-applications/${applicationId}`;

      fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 204) {
            alert("Application deleted successfully!");
            setStatusChangeCount(statusChangeCount + 1);
          } else {
            alert("Failed to delete application.");
          }
        })
        .catch((err) => {
          console.error(err);
          alert("An error occurred. Please try again.");
        });
    }
  };

  const handleDownloadDocument = (applicationId) => {
    let token = localStorage.getItem("authToken");
    let url = `http://localhost:8080/api/v1/loan-applications/${applicationId}/download-document`;

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error("Failed to download document. Please try again.");
        }
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `document_${applicationId}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((err) => {
        alert(err.message);
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
            setStatusChangeCount(statusChangeCount + 1); // Refresh the list to show the updated document status
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
                {!isAdmin && <th>Upload Document</th>}
                {!isAdmin && <th>Delete</th>}
                {isAdmin && <th>Detailed View</th>}
                {isAdmin && <th>Download Document</th>}
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
                    {!isAdmin && (
                      <>
                        <td>
                          {application.applicationStatus === "Documents Requested" && !application.documentUploaded ? (
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
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td>
                          {application.applicationStatus === "Applied" ? (
                            <button
                              onClick={() =>
                                handleDeleteApplication(application.applicationId)
                              }
                            >
                              Delete
                            </button>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </>
                    )}
                    {isAdmin && (
                      <td>
                        <button
                          onClick={() =>
                            navigate(`/loan-details/${application.applicationId}`)
                          }
                        >
                          Detailed View
                        </button>
                      </td>
                    )}
                    {isAdmin && (
                      <td>
                        {application.documentUploaded ? (
                          <button
                            onClick={() =>
                              handleDownloadDocument(application.applicationId)
                            }
                          >
                            Download Document
                          </button>
                        ) : (
                          <button disabled>No Document</button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? "10" : "8"}>
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
