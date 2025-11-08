import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './Login';
import Register from './Register';
import { ForgotPassword } from './ForgotPassword';
import Home from './Index';
import { useState } from 'react';
import LinkedInCallback from './LinkedInCallback';

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
            <Route
                path="/home"
                element={token ? <Home onLogout={handleLogout} /> : <Navigate to="/login" />}
            />
            <Route
                path="/linkedin-callback"
                element={<LinkedInCallback />}
            />
            <Route path="/" element={<Navigate to="/home" />} />
        </Routes >
    );
}

export default App;