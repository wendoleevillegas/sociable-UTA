
// Import necessary React hooks and external libraries
import React, { useState, useEffect } from 'react'; // React hooks for state and lifecycle management
import axios from 'axios'; // HTTP client for making API requests
import './StudentInformation.css'; // Import component-specific styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { getLinkedInAccount, disconnectLinkedInAccount, getLinkedInAccountSummary } from './LinkedInAccountService';

/*
 * PERSONALINFO COMPONENT - User account information management
 * 
 * Props:
 * - token: Authentication token for making authorized API requests
 * - onBack: Function to navigate back to the previous page/component
 * 
 */
export const PersonalInfo = ({ token, onBack }) => {
  // STATE MANAGEMENT - Component state for user information and UI control
  const [info, setInfo] = useState({
    firstName: '',    // User's first name
    lastName: '',     // User's last name
    birthday: '',     // User's date of birth
    email: '',        // User's email address
    phone: '',        // User's phone number
    password: '',     // User's password (for updates only)
  });

  const [editMode, setEditMode] = useState(false); // Toggle between view and edit modes
  const [message, setMessage] = useState('');      // Success/error messages for user feedback
  const [linkedInAccount, setLinkedInAccount] = useState(null); // LinkedIn account information

  /*
   * FETCH USER INFO EFFECT - Load user data when component mounts
   * This effect runs once when the component first loads to populate the form
   * with the current user's information from the server
   */
  useEffect(() => {
    // FETCH USER DATA FROM SERVER
    axios
      .get('http://localhost:5500/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }, // Include auth token in headers
      })
      .then((response) => {
        // UPDATE STATE with fetched user data
        setInfo(response.data);
      })
      .catch((error) => {
        // HANDLE FETCH ERRORS
        console.error('Error fetching user data:', error);
        setMessage('Failed to load user information.');
      });

    // LOAD LINKEDIN ACCOUNT INFORMATION
    const linkedInData = getLinkedInAccount();
    setLinkedInAccount(linkedInData);
  }, [token]); // Re-run effect if token changes

  /*
   * HANDLE INPUT CHANGES - Update form state when user types in any field
   * This function is called every time the user modifies an input field
   * 
   */
  const handleChange = (e) => {
    const { name, value } = e.target; // Extract field name and new value
    setInfo((prev) => ({ ...prev, [name]: value })); // Update only the specific field
  };

  /*
   * HANDLE SAVE OPERATION - Submit updated information to server
   * This function processes form submission and sends updated data to the API
   */
  const handleSave = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setMessage(''); // Clear any existing messages

    try {
      // SEND UPDATE REQUEST TO SERVER
      await axios.put(
        'http://localhost:5500/api/users/me', // API endpoint for updating user info
        {
          firstName: info.firstName,
          lastName: info.lastName,
          birthday: info.birthday,
          email: info.email,
          phone: info.phone,
          password: info.password || undefined, // Only include password if provided
        },
        { headers: { Authorization: `Bearer ${token}` } } // Include auth token
      );

      // SUCCESS HANDLING
      setMessage('Information updated successfully!');
      setEditMode(false); // Switch back to view mode after successful save

    } catch (err) {
      // ERROR HANDLING
      setMessage('Failed to update information.');
    }
  };

  // HANDLE LINKEDIN ACCOUNT DISCONNECTION
  const handleLinkedInDisconnect = () => {
    if (window.confirm('Are you sure you want to disconnect your LinkedIn account?')) {
      const success = disconnectLinkedInAccount();
      if (success) {
        setLinkedInAccount(null);
        setMessage('LinkedIn account disconnected successfully!');
      } else {
        setMessage('Failed to disconnect LinkedIn account.');
      }
    }
  };

  // COMPONENT RENDER - JSX structure for the personal information form
  return (
    <div className="personal-root"> {/* Main container for the personal info page */}
      <div className="personal-main"> {/* Form container with styling */}

        {/* PAGE TITLE */}
        <h2 className="personal-title">Personal Information</h2>

        {/* SUCCESS/ERROR MESSAGE DISPLAY - Conditional rendering based on message state */}
        {message && (
          <div className={`personal-message ${message.includes('success') ? 'personal-success' : 'personal-error'}`}>
            {message}
          </div>
        )}

        {/* PERSONAL INFORMATION FORM */}
        <form onSubmit={handleSave}>

          {/* FULL NAME FIELD - First and last name in a single row */}
          <div className="personal-field">
            <label className="personal-label">Full Name</label>
            <div className="personal-row">
              {/* FIRST NAME INPUT */}
              <input
                type="text"
                name="firstName"
                value={info.firstName} // Controlled component - value from state
                onChange={handleChange} // Update state when user types
                className="personal-input"
                disabled={!editMode} // Only editable when in edit mode
                required // HTML5 validation - field is required
              />
              {/* LAST NAME INPUT */}
              <input
                type="text"
                name="lastName"
                value={info.lastName} // Controlled component - value from state
                onChange={handleChange} // Update state when user types
                className="personal-input"
                disabled={!editMode} // Only editable when in edit mode
                required // HTML5 validation - field is required
              />
            </div>
          </div>

          {/* DATE OF BIRTH FIELD */}
          <div className="personal-field">
            <label className="personal-label">Date of Birth</label>
            <input
              type="date" // HTML5 date picker
              name="birthday"
              value={info.birthday ? info.birthday.slice(0, 10) : ''} // Format date for input (YYYY-MM-DD)
              onChange={handleChange} // Update state when user selects date
              className="personal-input"
              disabled={!editMode} // Only editable when in edit mode
              required // HTML5 validation - field is required
            />
          </div>

          {/* EMAIL ADDRESS FIELD */}
          <div className="personal-field">
            <label className="personal-label">Email Address</label>
            <input
              type="email" // HTML5 email validation
              name="email"
              value={info.email} // Controlled component - value from state
              onChange={handleChange} // Update state when user types
              className="personal-input"
              disabled={!editMode} // Only editable when in edit mode
              required // HTML5 validation - field is required
            />
          </div>

          {/* PHONE NUMBER FIELD */}
          <div className="personal-field">
            <label className="personal-label">Phone Number</label>
            <input
              type="tel" // HTML5 telephone number input
              name="phone"
              value={info.phone} // Controlled component - value from state
              onChange={handleChange} // Update state when user types
              className="personal-input"
              disabled={!editMode} // Only editable when in edit mode
            // Note: Phone is not required (no 'required' attribute)
            />
          </div>

          {/* PASSWORD FIELD */}
          <div className="personal-field">
            <label className="personal-label">Password</label>
            <input
              type="password" // Password type hides the text
              name="password"
              value={info.password} // Controlled component - value from state
              onChange={handleChange} // Update state when user types
              className="personal-input"
              disabled={!editMode} // Only editable when in edit mode
              placeholder={editMode ? "Enter new password" : "********"} // Different placeholders for different modes
            />
          </div>

          {/* LINKEDIN ACCOUNT SECTION */}
          <div className="personal-field">
            <label className="personal-label">
              <FontAwesomeIcon icon={faLinkedin} style={{ marginRight: '8px', color: '#0077B5' }} />
              LinkedIn Account
            </label>

            {linkedInAccount ? (
              // CONNECTED LINKEDIN ACCOUNT DISPLAY
              <div className="linkedin-account-info">
                <div className="linkedin-account-details">
                  <div className="linkedin-account-row">
                    <span className="linkedin-account-label">Connected Account:</span>
                    <span className="linkedin-account-value">{linkedInAccount.firstName} {linkedInAccount.lastName}</span>
                  </div>
                  <div className="linkedin-account-row">
                    <span className="linkedin-account-label">Connection Date:</span>
                    <span className="linkedin-account-value">
                      {new Date(linkedInAccount.connectionDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="linkedin-account-row">
                    <span className="linkedin-account-label">Status:</span>
                    <span className="linkedin-account-status connected">Connected</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="linkedin-disconnect-btn"
                  onClick={handleLinkedInDisconnect}
                  title="Disconnect LinkedIn Account"
                >
                  <FontAwesomeIcon icon={faTrash} />
                  Disconnect
                </button>
              </div>
            ) : (
              // NO LINKEDIN ACCOUNT CONNECTED
              <div className="linkedin-account-info">
                <div className="linkedin-account-message">
                  <p>No LinkedIn account connected</p>
                  <small>Connect your LinkedIn account in the Post section to enable LinkedIn posting and analytics.</small>
                </div>
              </div>
            )}
          </div>

          {/* ACTION BUTTONS - Back, Edit, and Save buttons */}
          <div className="personal-actions">

            {/* BACK BUTTON - Navigate to previous page */}
            <button
              type="button" // Not a submit button
              className="personal-btn personal-btn-back"
              onClick={onBack} // Call parent function to navigate back
            >
              Back
            </button>

            {/* CONDITIONAL BUTTONS - Show Save or Edit button based on current mode */}
            {editMode ? (
              // SAVE BUTTON - Submit form and save changes (only visible in edit mode)
              <button
                type="submit" // Submit the form when clicked
                className="personal-btn personal-btn-save"
              >
                Save
              </button>
            ) : (
              // EDIT BUTTON - Enable edit mode (only visible in view mode)
              <button
                type="button" // Not a submit button
                className="personal-btn personal-btn-edit"
                onClick={() => setEditMode(true)} // Switch to edit mode
              >
                Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};