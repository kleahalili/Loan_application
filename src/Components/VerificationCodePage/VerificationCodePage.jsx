// VerificationCodePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./VerificationCodePage.css";

function VerificationCodePage() {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/v1/password/validate-token?token=${verificationCode}`);
      if (response.ok) {
        // Redirect to reset password page with token in query
        navigate(`/reset-password?token=${verificationCode}`);
      } else {
        setError('Invalid or expired verification code.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="verification-container">
      <h2>Enter Verification Code</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="verificationCode">Verification Code:</label>
          <input
            type="text"
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Submit Code</button>
      </form>
    </div>
  );
}

export default VerificationCodePage;
