// KlientHomePage.js
import React, { useState, useEffect } from 'react';
import './ClientHomePage.css';

const ClientHomePage = () => {

  const [creditApplications, setCreditApplications] = useState([]);

  
  const [lastLogin, setLastLogin] = useState('');

  useEffect(() => {
    // Simulate fetching credit applications from the backend
    // Here you would make an API call to get the user's credit applications
    const fetchCreditApplications = async () => {
      
      const data = [
        { id: 1, status: 'Pending' },
        { id: 2, status: 'Approved' },
        { id: 3, status: 'Rejected' },
      ];
      setCreditApplications(data);
    };

    fetchCreditApplications();

    // Mock last login time
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString()}, ${now.toLocaleTimeString()}`;
    setLastLogin(formattedDate);
  }, []);

  return (
    <div className="client-home-container">
      <header className="header">
        <h1>Welcome, [Username]</h1> {/* Replace [Username] with the actual username */}
        <nav className="navbar">
          <ul>
            <li><a href="#">Home</a></li>
            {/* Add more navigation links as needed */}
          </ul>
        </nav>
        <button className="logout-button">Logout</button>
      </header>
      <main className="main-content">
        <section className="credit-applications">
          <h2>Credit Applications</h2>
          {creditApplications.length === 0 ? (
            <p>No credit applications</p>
          ) : (
            <ul>
              {creditApplications.map(application => (
                <li key={application.id}>
                  Application ID: {application.id}, Status: {application.status}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <footer className="footer">
        <p>Last login: {lastLogin}</p>
      </footer>
    </div>
  );
};

export default ClientHomePage;
