/*
 * STUDENTINFORMATION.JSX - User Profile Management Component
 * This component allows users to view and edit their personal information including
 * name, birthday, email, phone number, and password. It provides a toggle between
 * view and edit modes with proper validation and server synchronization.
 */

// Import necessary React hooks and external libraries
import React, { useState, useEffect } from 'react'; // React hooks for state and lifecycle management
import axios from 'axios'; // HTTP client for making API requests
import './StudentInformation.css'; // Import component-specific styles

/*
 * PERSONALINFO COMPONENT - User account information management
 * 
 * Props:
 * - token: Authentication token for making authorized API requests
 * - onBack: Function to navigate back to the previous page/component
 * 
 * Features:
 * - Display user's personal information in read-only mode
 * - Toggle to edit mode for updating information
 * - Form validation for all input fields
 * - Real-time API synchronization for data persistence
 * - Success and error message feedback
 * - Secure password handling
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

  /*
   * FETCH USER INFO EFFECT - Load user data when component mounts
   * This effect runs once when the component first loads to populate the form
   * with the current user's information from the server
   */
  useEffect(() => {
    // FETCH USER DATA FROM SERVER
    axios
      .get('http://localhost:5500/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }, // Include auth token in request
      })
      .then((res) => {
        // SUCCESS: Update state with user information from server
        setInfo({
          firstName: res.data.firstName || '',
          lastName: res.data.lastName || '',
          birthday: res.data.birthday || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          password: '', // Don't populate password field for security
        });
      })
      .catch(() => {
        // ERROR: Display error message if data loading fails
        setMessage('Failed to load user info.');
      });
  }, [token]); // Re-run effect if token changes

  /*
   * HANDLE INPUT CHANGES - Update form state when user types in any field
   * This function is called every time the user modifies an input field
   * 
   * @param {Event} e - The input change event containing field name and new value
   */
  const handleChange = (e) => {
    const { name, value } = e.target; // Extract field name and new value
    setInfo((prev) => ({ ...prev, [name]: value })); // Update only the specific field
  };

  /*
   * HANDLE SAVE OPERATION - Submit updated information to server
   * This function processes form submission and sends updated data to the API
   * 
   * @param {Event} e - The form submission event
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