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
  // const [selectedSources, setSelectedSources] = useState(['instagram']);
  const [activeApiSource, setActiveApiSource] = useState('all');

  // Handle authentication state
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setCurrentUser({ token });
    }

    // handling LinkedIn OAuth redirect
    const urlParams = new URLSearchParams(window.location.search);
    const linkedinToken = urlParams.get('linkedin_token');
    if (linkedinToken) {
      console.log("LinkedIn token received:", linkedinToken);
      localStorage.setItem('linkedin_access_token', linkedinToken);
      // Clean the token from the URL so it's not visible
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);


  // const handleLogoutClick = () => {
  //   if (onLogout) {
  //     onLogout;
  //   }
  // };

  // Handle page navigation and reset API source to Instagram
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // setSelectedSources(['instagram']); // Reset to Instagram when changing pages
    setActiveApiSource('all');
  };

  // User object for components that need user info
  const user = {
    avatarUrl: 'https://via.placeholder.com/48',
    name: 'User'
  };

  // Test with just Login component
  if (!currentUser) {
    return (
      <Login
        setToken={(token) => {
          setCurrentUser({ token });
          localStorage.setItem('token', token);
        }}
      // onShowSignup={() => { }}
      // onShowForgot={() => { }}
      />
    );
  }

  // If logged in, show the app with working components
  return (
    <div>
      <Menu active={currentPage} onSelect={handlePageChange} onLogout={onLogout} />
      {(currentPage === 'analytics' || currentPage === 'calendar' || currentPage === 'inbox' || currentPage === 'postview') && (
        // <ApiSubmenu selectedSources={selectedSources} onSourceChange={setSelectedSources} />
        <ApiSubmenu activeSource={activeApiSource} onSourceChange={setActiveApiSource} />
      )}
      {/* {currentPage === 'calendar' && <Calendar token={currentUser.token} apiSource={selectedSources[0]} onNavigate={setCurrentPage} />}
      {currentPage === 'post' && <CreatePost token={currentUser.token} user={user} apiSource={selectedSources[0]} onNavigate={setCurrentPage} />}
      {currentPage === 'postview' && <PostView token={currentUser.token} user={user} apiSource={selectedSources[0]} onNavigate={setCurrentPage} />}
      {currentPage === 'inbox' && <Inbox token={currentUser.token} apiSource={selectedSources[0]} onNavigate={setCurrentPage} />}
      {currentPage === 'analytics' && <Analytics token={currentUser.token} apiSource={selectedSources[0]} onNavigate={setCurrentPage} />} */}
      {currentPage === 'calendar' && <Calendar token={currentUser.token} apiSource={activeApiSource} onNavigate={setCurrentPage} />}
      {currentPage === 'post' && <CreatePost token={currentUser.token} user={user} apiSource={activeApiSource} onNavigate={setCurrentPage} />}
      {currentPage === 'postview' && <PostView token={currentUser.token} user={user} apiSource={activeApiSource} onNavigate={setCurrentPage} />}
      {currentPage === 'inbox' && <Inbox token={currentUser.token} apiSource={activeApiSource} onNavigate={setCurrentPage} />}
      {currentPage === 'analytics' && <Analytics token={currentUser.token} apiSource={activeApiSource} onNavigate={setCurrentPage} />}
      {currentPage === 'studentinformation' && <PersonalInfo token={currentUser.token} onBack={() => setCurrentPage('calendar')} />}

      {/* Navigation Menu */}
      {/* <Menu
        active={currentPage}
        onSelect={handlePageChange}
        onLogout={onLogout}
      /> */}

      {/* API Source Submenu - Hide for CreatePost page
      {(currentPage === 'analytics' || currentPage === 'calendar' || currentPage === 'inbox' || currentPage === 'postview') && (
        <ApiSubmenu
          selectedSources={selectedSources}
          onSourceChange={setSelectedSources}
        />
      )} */}

      {/* Page Content - Conditional rendering based on selected page
      {currentPage === 'calendar' && (
        <Calendar
          token={currentUser.token}
          setToken={(token) => setCurrentUser(prev => ({ ...prev, token }))}
          selectedSources={selectedSources}
          onNavigate={setCurrentPage}
        />
      )} */}

      {/* {currentPage === 'post' && (
        <CreatePost
          token={currentUser.token}
          user={user}
          apiSource={selectedSources[0]}
          onNavigate={setCurrentPage}
        />
      )} */}

      {/* {currentPage === 'postview' && (
        <PostView
          token={currentUser.token}
          user={user}
          apiSource={selectedSources[0]}
          onNavigate={setCurrentPage}
        />
      )} */}

      {/* {currentPage === 'inbox' && (
        <Inbox
          token={currentUser.token}
          apiSource={selectedSources[0]}
          onNavigate={setCurrentPage}
        />
      )} */}

      {/* {currentPage === 'analytics' && (
        <Analytics
          token={currentUser.token}
          apiSource={selectedSources[0]}
          onNavigate={setCurrentPage}
        />
      )} */}

      {/* {currentPage === 'studentinformation' && (
        <PersonalInfo
          token={currentUser.token}
          onBack={() => setCurrentPage('calendar')}
        />
      )} */}
    </div>
  );
}

export default Home;

