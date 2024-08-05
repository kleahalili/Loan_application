import React, { useState, useEffect } from "react";
import "./HomePage.css";
import LoanApplication from "../LoanApplication/LoanApplication";
// import LoginRegister from "../LoginRegistration/LoginRegister";
import ClientHomePage from "../ClientHomePage/ClientHomePage";

const HomePage = () => {
  const [lastLogin, setLastLogin] = useState("");
  const [loanApplications, setLoanApplications] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [statusChangeCount, setStatusChangeCount] = useState(0);
  const [userFullName, setUserFullName] = useState("");
  // const [isLoanAppVisible, setIsLoanAppVisible] = useState(false); // Initial state: hidden
  // const [showClientHomePage, setShowClientHomePage] = useState(false); // Initial state: hidden

  useEffect(() => {
    // const now = new Date();
    // const formattedDate = `${now.toLocaleDateString()}, ${now.toLocaleTimeString()}`;
    // setLastLogin(formattedDate);

    // Get applications
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

    // Get user
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
          console.log("User esht punonjes");
        } else {
          console.log("User nuk esht punonjes");
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
          console.log("Status updated");
          setStatusChangeCount(statusChangeCount + 1);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // const toggleLoanAppVisibility = () => {
  //   setIsLoanAppVisible(!isLoanAppVisible); // Toggle visibility
  //   setShowClientHomePage(false); // Hide client home page when toggling loan application
  // };

  // const toggleClientHomePage = () => {
  //   setShowClientHomePage(!showClientHomePage); // Toggle visibility
  // };

  return (
    <div className="home-container">
      <h2>Welcome, {userFullName}</h2>
      <main className="main-content">
        {/* {isLoanAppVisible && <LoanApplication />}{" "} */}
        {/* Conditionally render LoanApplication */}
        {/* {showClientHomePage && <ClientHomePage />}{" "} */}
        {/* Conditionally render ClientHomePage */}
        {/* <section className="summary"> */}
        {/* <h2>Summary</h2>
          Display summary information here */}
        {/* </section> */}

        <div className="loan-applications">
          <h2>Loan Applications</h2>
          <table className="loan-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Submit Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loanApplications && loanApplications.length > 0 ? (
                loanApplications.map((application) => (
                  <tr key={application.applicationId}>
                    <td>{application.applicationId}</td>
                    <td>
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </td>
                    <td>{application.applicationStatus}</td>
                    <td>
                      {application.applicationStatus === "Applied" && isAdmin && (
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No loan applications available.</td>
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
