import React, { useState, useEffect } from 'react';
import './Index.css';

import { Login } from './Login';
import { Calendar } from './Calendar';
import { Menu } from './Menu';
import { ApiSubmenu } from './ApiSubmenu';
import { PostView } from './PostView';
import CreatePost from './CreatePost';
import { Inbox } from './Inbox';
import { Analytics } from './Analytics';
import { PersonalInfo } from './Studentinformation';

function Home({ onLogout }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('calendar');
  const [activeApiSource, setActiveApiSource] = useState('all');

  // --- 2. ADD THIS STATE ---
  // This creates the setLinkedInToken function
  const [linkedInToken, setLinkedInToken] = useState(localStorage.getItem('linkedin_access_token'));

  // Handle authentication state
  useEffect(() => {
    // This part runs when the component first loads
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    
    // Add any other auth setup logic here if needed
  }, []);

  // --- 3. ADD THIS ENTIRE useEffect HOOK ---
  // This hook replaces LinkedInAccountService.js
  useEffect(() => {
    // Check if the URL has a 'linkedin_token' query parameter
    const params = new URLSearchParams(window.location.search);
    const token = params.get('linkedin_token');

    if (token) {
      console.log("Found LinkedIn token in URL, saving...");
      // 1. Save the token to this component's state
      setLinkedInToken(token);
      // 2. Save the token to the browser's local storage
      localStorage.setItem('linkedin_access_token', token);
      // 3. Clean the URL so the token isn't visible on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []); // The empty array [] means this runs only once when the page loads

  const handleLinkedInDisconnect = () => {
    localStorage.removeItem('linkedin_access_token');
    setLinkedInToken(null);
  };


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setActiveApiSource('all'); // Reset to 'all' when changing main pages
  };

  // User object for components that need user info
  const user = {
    // Use username from currentUser if it exists, otherwise default
    name: currentUser?.username || 'User', 
    avatar: '/path-to-default-avatar.png' // You can update this later
  };


  return (
    <div className="app-layout">
      <Menu active={currentPage} onSelect={handlePageChange} onLogout={onLogout} />
      <div className="app-content-area">
        {(currentPage === 'analytics' || currentPage === 'calendar' || currentPage === 'inbox' || currentPage === 'postview') && (
          <ApiSubmenu activeSource={activeApiSource} onSourceChange={setActiveApiSource} />
        )}
        {currentPage === 'calendar' && <Calendar token={currentUser?.token} apiSource={activeApiSource} onNavigate={setCurrentPage} />}
        {currentPage === 'post' && <CreatePost token={currentUser?.token} user={user} apiSource={activeApiSource} onNavigate={setCurrentPage} />}
        {currentPage === 'postview' && <PostView token={currentUser?.token} user={user} apiSource={activeApiSource} onNavigate={setCurrentPage} linkedInToken={linkedInToken} />}
        {currentPage === 'inbox' && <Inbox token={currentUser?.token} apiSource={activeApiSource} onNavigate={setCurrentPage} />}
        {currentPage === 'analytics' && <Analytics token={currentUser?.token} apiSource={activeApiSource} onNavigate={setCurrentPage} linkedInToken={linkedInToken} />}
        {currentPage === 'studentinformation' && <PersonalInfo token={currentUser?.token} onBack={() => setCurrentPage('calendar')} linkedInToken={linkedInToken} onLinkedInDisconnect={handleLinkedInDisconnect}/>}
      </div>
    </div>
  );
}

export default Home;