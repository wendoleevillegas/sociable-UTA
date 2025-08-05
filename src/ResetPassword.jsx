import React, { useState } from 'react';
import axios from 'axios';
import './ResetPassword.css';

export const ResetPassword = ({ email, onBackToLogin }) => {
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await axios.post('http://localhost:5500/api/users/reset-password', { 
        email,
        password
      });
      
      // SUCCESS HANDLING
      setSuccess('Password changed successfully! You can now log in.');
      // Automatically redirect to login page after 1.5 seconds
      setTimeout(onBackToLogin, 1500);
      
    } catch (err) {
      // ERROR HANDLING
      // Display error message if password reset fails
      setError('Failed to reset password.');
    }
  };

  // COMPONENT RENDER - JSX structure for the password reset form
  return (
    <div className="reset-root"> {/* Main container for the entire reset password page */}
      <div className="reset-main"> {/* Form container with styling */}
        
        {/* FORM TITLE - Clear heading explaining what this form does */}
        <h2 className="reset-title">Reset Password</h2>
        
        {/* PASSWORD RESET FORM - Simple form with just password input */}
        <form onSubmit={handleSubmit}>
          
          {/* PASSWORD INPUT FIELD - Where user enters their new password */}
          <input
            type="password" // Password type hides the text as user types
            placeholder="Enter new password" // Helpful placeholder text
            value={password} // Controlled component - value comes from state
            onChange={e => setPassword(e.target.value)} // Update state when user types
            className="reset-input" // CSS class for styling
            required // HTML5 validation - field must be filled
          />
          
          {/* CONDITIONAL ERROR MESSAGE - Only shows if there's an error */}
          {error && <div className="reset-error">{error}</div>}
          
          {/* CONDITIONAL SUCCESS MESSAGE - Only shows after successful reset */}
          {success && <div className="reset-success">{success}</div>}
          
          {/* SUBMIT BUTTON - Triggers the password reset process */}
          <button
            type="submit" // Submit the form when clicked
            className="reset-btn" // CSS class for styling
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};