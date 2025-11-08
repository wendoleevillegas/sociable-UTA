// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { Login } from './Login';
// import Register from './Register';
// import { ForgotPassword } from './ForgotPassword';
// import Home from './Index';
// import { useState } from 'react';

// function App() {
//     const [token, setToken] = useState(localStorage.getItem('token'));

//     const handleSetToken = (newToken) => {
//         setToken(newToken);
//         if (newToken) {
//             localStorage.setItem('token', newToken);
//         } else {
//             localStorage.removeItem('token');
//         }
//     };

//     const handleLogout = () => {
//         handleSetToken(null);
//     };

//     return (
//         <Routes>
//             <Route
//                 path="/login"
//                 element={<Login setToken={handleSetToken} />}
//             />
//             <Route
//                 path="/register"
//                 element={<Register />}
//             />
//             <Route
//                 path="/forgot-password"
//                 element={<ForgotPassword />}
//             />
//             <Route
//                 path="/home"
//                 element={
//                     token ? (
//                         <Home onLogout={handleLogout} />
//                     ) : (
//                         <Navigate to="/login" />
//                     )
//                 }
//             />
//             <Route
//                 path="/"
//                 element={
//                     token ? (
//                         <Navigate to="/home" />
//                     ) : (
//                         <Navigate to="/login" />
//                     )
//                 }
//             />
//         </Routes>
//     );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './Login';
import Register from './Register';
import { ForgotPassword } from './ForgotPassword';
import Home from './Index';
import { useState } from 'react';


// Checking authentication
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" replace />;
};

const RedirectIfLoggedIn = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? <Navigate to="/home" replace /> : children;
};

function App() {
    // managing token in state, initialize with value from localStorage
    const [token, setToken] = useState(localStorage.getItem('token'));

    const handleSetToken = (newToken) => {
        setToken(newToken);
        if (newToken) {
            localStorage.setItem('token', newToken);
        } else {
            localStorage.removeItem('token');
        }
    };

    // central logout function
    const handleLogout = () => {
        handleSetToken(null);
    };

    return (
        <Routes>
            <Route
                path="/login"
                element={token ? <Navigate to="/home" /> : <Login setToken={handleSetToken} />}
            />

            <Route
                path="/register"
                element={token ? <Navigate to="/home" /> : <Register />}
            />

            <Route
                path="/forgot-password"
                element={token ? <Navigate to="/home" /> : <ForgotPassword />}
            />

            {/* pass 'handleLogout' to Home and check state token */}
            <Route
                path="/home"
                element={token ? <Home onLogout={handleLogout} /> : <Navigate to="/login" />}
            />
            <Route path="/" element={<Navigate to="/home" />} />
        </Routes >
        // <Routes>
        //     <Route
        //         path="/login"
        //         element={
        //             <RedirectIfLoggedIn>
        //                 <Login setToken={(token) => localStorage.setItem('token', token)} />
        //             </RedirectIfLoggedIn>
        //         }
        //     />
        //     <Route
        //         path="/register"
        //         element={
        //             <RedirectIfLoggedIn>
        //                 <Register />
        //             </RedirectIfLoggedIn>
        //         }
        //     />
        //     <Route
        //         path="/forgot-password"
        //         element={
        //             <RedirectIfLoggedIn>
        //                 <ForgotPassword />
        //             </RedirectIfLoggedIn>
        //         }
        //     />
        //     <Route
        //         path="/home"
        //         element={
        //             <PrivateRoute>
        //                 <Home />
        //             </PrivateRoute>
        //         }
        //     />
        //     {/* Optional: redirect root URL to login or home */}
        //     <Route path="/" element={<Navigate to="/home" replace />} />
        // </Routes>
    );
}

export default App;