
// import React, { useState } from 'react';
// import axios from 'axios'; // For making HTTP requests to the backend
// import './ForgotPassword.css'; // Import custom styles for this component

// // ForgotPassword component - handles password reset email verification
// // Props:
// // - onBack: function to navigate back to login page
// // - onEmailVerified: function called when email is successfully verified
// const ForgotPassword = ({ onBack, onEmailVerified }) => {
//   // State variables to manage component data
//   const [email, setEmail] = useState(''); // User's email input
//   const [error, setError] = useState(''); // Error message to display
//   const [loading, setLoading] = useState(false); // Loading state during API call

//   // Handle form submission for password reset
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form submission behavior
//     setError(''); // Clear any previous error messages
//     setLoading(true); // Show loading state

//     try {
//       // Send POST request to backend to verify email exists
//       await axios.post('http://localhost:5500/api/users/forgot-password', { email });
//       // If successful, call the parent component's callback with the email
//       onEmailVerified(email);
//     } catch (err) {
//       // If email not found or other error, show error message
//       setError('Email address not found.');
//     }

//     setLoading(false); // Hide loading state
//   };

//   return (
//     // Main container for the forgot password page
//     <div className="forgot-root">
//       {/* Central content container */}
//       <div className="forgot-main">
//         {/* Page title */}
//         <h2 className="forgot-title">Forgot Password</h2>

//         {/* Password reset form */}
//         <form onSubmit={handleSubmit}>
//           {/* Email input field */}
//           <input
//             type="email"
//             placeholder="Enter your email address"
//             value={email}
//             onChange={e => setEmail(e.target.value)} // Update email state on input change
//             className="forgot-input"
//             required // Make field required
//           />

//           {/* Display error message if there's an error */}
//           {error && <div className="forgot-error">{error}</div>}

//           {/* Submit button */}
//           <button
//             type="submit"
//             className="forgot-btn"
//             disabled={loading} // Disable button while loading
//           >
//             {/* Show different text based on loading state */}
//             {loading ? 'Checking...' : 'Continue'}
//           </button>
//         </form>

//         {/* Back to login section */}
//         <div className="forgot-back">
//           <button
//             type="button"
//             className="forgot-back-btn"
//             onClick={onBack} // Call parent's onBack function
//           >
//             Back to Login
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;


import React, { useState } from 'react';
import axios from 'axios'; // For making HTTP requests to the backend
import './ForgotPassword.css'; // Import custom styles for this component

// ForgotPassword component - handles password reset email verification
// Props:
// - onBack: function to navigate back to login page
// - onEmailVerified: function called when email is successfully verified
export const ForgotPassword = ({ onBack, onEmailVerified }) => {
  // State variables to manage component data
  const [email, setEmail] = useState(''); // User's email input
  const [error, setError] = useState(''); // Error message to display
  const [loading, setLoading] = useState(false); // Loading state during API call

  // Handle form submission for password reset
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(''); // Clear any previous error messages
    setLoading(true); // Show loading state

    try {
      // Send POST request to backend to verify email exists
      await axios.post('http://localhost:5500/api/users/forgot-password', { email });
      // If successful, call the parent component's callback with the email
      onEmailVerified(email);
    } catch (err) {
      // If email not found or other error, show error message
      setError('Email address not found.');
    }

    setLoading(false); // Hide loading state
  };

  return (
    // Main container for the forgot password page
    <div className="forgot-root">
      {/* Central content container */}
      <div className="forgot-main">
        {/* Page title */}
        <h2 className="forgot-title">Forgot Password</h2>

        {/* Password reset form */}
        <form onSubmit={handleSubmit}>
          {/* Email input field */}
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={e => setEmail(e.target.value)} // Update email state on input change
            className="forgot-input"
            required // Make field required
          />

          {/* Display error message if there's an error */}
          {error && <div className="forgot-error">{error}</div>}

          {/* Submit button */}
          <button
            type="submit"
            className="forgot-btn"
            disabled={loading} // Disable button while loading
          >
            {/* Show different text based on loading state */}
            {loading ? 'Checking...' : 'Continue'}
          </button>
        </form>

        {/* Back to login section */}
        <div className="forgot-back">
          <button
            type="button"
            className="forgot-back-btn"
            onClick={onBack} // Call parent's onBack function
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};