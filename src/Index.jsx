// import React, { useState, useEffect } from 'react';
// import './Index.css';
// import { useNavigate } from 'react-router-dom';

// import { Calendar } from './Calendar';
// import { Menu } from './Menu';
// import { ApiSubmenu } from './ApiSubmenu';
// import { PostView } from './PostView';
// import { Inbox } from './Inbox';
// import { Analytics } from './Analytics';
// // Commenting out other imports temporarily to test
// /*
// import { Calendar } from './Calendar';
// import { Signup } from './Signup';
// import { ForgotPassword } from './ForgotPassword';
// import { ResetPassword } from './ResetPassword';
// import { PersonalInfo } from './Studentinformation';
// */

// // function App() {
// //   const [currentUser, setCurrentUser] = useState(null);
// //   const [currentPage, setCurrentPage] = useState('calendar');
// //   const [apiSource, setApiSource] = useState('instagram');

// //   // Handle authentication state
// //   useEffect(() => {
// //     const token = localStorage.getItem('token');
// //     if (token) {
// //       setCurrentUser({ token });
// //     }
// //   }, []);

// //   const logout = () => {
// //     localStorage.removeItem('token');
// //     setCurrentUser(null);
// //   };

// //   // Handle page navigation and reset API source to Instagram
// //   const handlePageChange = (newPage) => {
// //     setCurrentPage(newPage);
// //     setApiSource('instagram'); // Reset to Instagram when changing pages
// //   };

// //   // User object for components that need user info
// //   const user = {
// //     avatarUrl: 'https://via.placeholder.com/48',
// //     name: 'User'
// //   };

// //   // Test with just Login component
// //   if (!currentUser) {
// //     return (
// //       <Login 
// //         setToken={(token) => {
// //           setCurrentUser({ token });
// //           localStorage.setItem('token', token);
// //         }}
// //         onShowSignup={() => {}}
// //         onShowForgot={() => {}}
// //       />
// //     );
// //   }

// //   // If logged in, show the app with working components
// //   return (
// //     <div>
// //       {/* Navigation Menu */}
// //       <Menu
// //         active={currentPage}
// //         onSelect={handlePageChange}
// //         onLogout={logout}
// //       />

// //       {/* API Source Submenu - Show for pages that use social media data */}
// //       {(currentPage === 'post' || currentPage === 'analytics' || currentPage === 'calendar' || currentPage === 'inbox') && (
// //         <ApiSubmenu
// //           activeSource={apiSource}
// //           onSourceChange={setApiSource}
// //         />
// //       )}

// //       {/* Page Content - Conditional rendering based on selected page */}
// //       {currentPage === 'calendar' && (
// //         <Calendar 
// //           token={currentUser.token} 
// //           setToken={(token) => setCurrentUser(prev => ({ ...prev, token }))}
// //           apiSource={apiSource} 
// //           onNavigate={setCurrentPage}
// //         />
// //       )}

// //       {currentPage === 'post' && (
// //         <PostView 
// //           token={currentUser.token} 
// //           user={user} 
// //           apiSource={apiSource} 
// //           onNavigate={setCurrentPage} 
// //         />
// //       )}

// //       {currentPage === 'inbox' && (
// //         <Inbox 
// //           token={currentUser.token} 
// //           apiSource={apiSource} 
// //           onNavigate={setCurrentPage} 
// //         />
// //       )}

// //       {currentPage === 'analytics' && (
// //         <Analytics 
// //           token={currentUser.token} 
// //           apiSource={apiSource} 
// //           onNavigate={setCurrentPage} 
// //         />
// //       )}
// //     </div>
// //   );
// // }

// export default function Home() {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [currentPage, setCurrentPage] = useState('calendar');
//   const [apiSource, setApiSource] = useState('instagram');

//   // Handle authentication state
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       setCurrentUser({ token });
//     }
//   }, []);

//   // const logout = () => {
//   //   localStorage.removeItem('token');
//   //   setCurrentUser(null);
//   // };

//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.removeItem('token');
//     setCurrentUser(null);
//     navigate('/login');  // redirect to login after logout
//   };

//   // Handle page navigation and reset API source to Instagram
//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//     setApiSource('instagram'); // Reset to Instagram when changing pages
//   };

//   // User object for components that need user info
//   const user = {
//     avatarUrl: 'https://via.placeholder.com/48',
//     name: 'User'
//   };

//   // Test with just Login component
//   // if (!currentUser) {
//   //   return (
//   //     <Login
//   //       setToken={(token) => {
//   //         setCurrentUser({ token });
//   //         localStorage.setItem('token', token);
//   //       }}
//   //       onShowSignup={() => { }}
//   //       onShowForgot={() => { }}
//   //     />
//   //   );
//   // }

//   // no longer needing to render login, redirect handled by router
//   if (!currentUser) return null;


//   // If logged in, show the app with working components
//   return (
//     <div>
//       {/* Navigation Menu */}
//       <Menu
//         active={currentPage}
//         onSelect={handlePageChange}
//         onLogout={logout}
//       />

//       {/* API Source Submenu - Show for pages that use social media data */}
//       {(currentPage === 'post' || currentPage === 'analytics' || currentPage === 'calendar' || currentPage === 'inbox') && (
//         <ApiSubmenu
//           activeSource={apiSource}
//           onSourceChange={setApiSource}
//         />
//       )}

//       {/* Page Content - Conditional rendering based on selected page */}
//       {currentPage === 'calendar' && (
//         <Calendar
//           token={currentUser.token}
//           setToken={(token) => setCurrentUser(prev => ({ ...prev, token }))}
//           apiSource={apiSource}
//           onNavigate={setCurrentPage}
//         />
//       )}

//       {currentPage === 'post' && (
//         <PostView
//           token={currentUser.token}
//           user={user}
//           apiSource={apiSource}
//           onNavigate={setCurrentPage}
//         />
//       )}

//       {currentPage === 'inbox' && (
//         <Inbox
//           token={currentUser.token}
//           apiSource={apiSource}
//           onNavigate={setCurrentPage}
//         />
//       )}

//       {currentPage === 'analytics' && (
//         <Analytics
//           token={currentUser.token}
//           apiSource={apiSource}
//           onNavigate={setCurrentPage}
//         />
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import './index.css';

import { Login } from './Login';
import { Calendar } from './Calendar';
import { Menu } from './Menu';
import { ApiSubmenu } from './ApiSubmenu';
import { PostView } from './PostView';
import CreatePost from './CreatePost.jsx';
import { Inbox } from './Inbox';
import { Analytics } from './Analytics';
import { PersonalInfo } from './Studentinformation';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('calendar');
  const [selectedSources, setSelectedSources] = useState(['instagram']);

  // Handle authentication state
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setCurrentUser({ token });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  // Handle page navigation and reset API source to Instagram
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedSources(['instagram']); // Reset to Instagram when changing pages
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
        onShowSignup={() => { }}
        onShowForgot={() => { }}
      />
    );
  }

  // If logged in, show the app with working components
  return (
    <div>
      {/* Navigation Menu */}
      <Menu
        active={currentPage}
        onSelect={handlePageChange}
        onLogout={logout}
      />

      {/* API Source Submenu - Hide for CreatePost page */}
      {(currentPage === 'analytics' || currentPage === 'calendar' || currentPage === 'inbox' || currentPage === 'postview') && (
        <ApiSubmenu
          selectedSources={selectedSources}
          onSourceChange={setSelectedSources}
        />
      )}

      {/* Page Content - Conditional rendering based on selected page */}
      {currentPage === 'calendar' && (
        <Calendar
          token={currentUser.token}
          setToken={(token) => setCurrentUser(prev => ({ ...prev, token }))}
          selectedSources={selectedSources}
          onNavigate={setCurrentPage}
        />
      )}

      {currentPage === 'post' && (
        <CreatePost
          token={currentUser.token}
          user={user}
          apiSource={selectedSources[0]}
          onNavigate={setCurrentPage}
        />
      )}

      {currentPage === 'postview' && (
        <PostView
          token={currentUser.token}
          user={user}
          apiSource={selectedSources[0]}
          onNavigate={setCurrentPage}
        />
      )}

      {currentPage === 'inbox' && (
        <Inbox
          token={currentUser.token}
          apiSource={selectedSources[0]}
          onNavigate={setCurrentPage}
        />
      )}

      {currentPage === 'analytics' && (
        <Analytics
          token={currentUser.token}
          apiSource={selectedSources[0]}
          onNavigate={setCurrentPage}
        />
      )}

      {currentPage === 'studentinformation' && (
        <PersonalInfo
          token={currentUser.token}
          onBack={() => setCurrentPage('calendar')}
        />
      )}
    </div>
  );
}

export default App;
