import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './Login';
import Register from './Register';
import { ForgotPassword } from './ForgotPassword';
import Home from './Index';
import { useState } from 'react';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    const handleSetToken = (newToken) => {
        setToken(newToken);
        if (newToken) {
            localStorage.setItem('token', newToken);
        } else {
            localStorage.removeItem('token');
        }
    };

    const handleLogout = () => {
        handleSetToken(null);
    };

    return (
        <Routes>
            <Route
                path="/login"
                element={<Login setToken={handleSetToken} />}
            />
            <Route
                path="/register"
                element={<Register />}
            />
            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />
            <Route
                path="/home"
                element={
                    token ? (
                        <Home onLogout={handleLogout} />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/"
                element={
                    token ? (
                        <Navigate to="/home" />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
        </Routes>
    );
}

export default App;