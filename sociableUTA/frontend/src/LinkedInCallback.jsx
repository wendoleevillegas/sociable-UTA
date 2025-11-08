import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const LinkedInCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Get the token from the URL
    const token = searchParams.get('linkedin_token');

    if (token) {
      // 2. Save it to localStorage
      // Your Analytics.jsx file looks for 'linkedin_access_token'
      localStorage.setItem('linkedin_access_token', token);

      // 3. Navigate to the home page (or analytics page)
      navigate('/home'); 
    } else {
      // Handle a login error
      console.error('No LinkedIn token found in callback.');
      navigate('/login'); // Send them back to login
    }
  }, [searchParams, navigate]);

  // Show a simple loading message while this runs
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>Authenticating...</h1>
      <p>Please wait, you are being redirected.</p>
    </div>
  );
};

export default LinkedInCallback;