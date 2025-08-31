
// ETHAN VERSION

import { Routes, Route, Navigate } from 'react-router-dom';
// CHANGED:
import { Login } from './Login';
import Register from './Register';
// CHANGED:
import { ForgotPassword } from './ForgotPassword';
import Home from './Index';


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
    return (
        <Routes>
            {/* <Route
                path="/login"
                element={
                    <RedirectIfLoggedIn>
                        <Login />
                    </RedirectIfLoggedIn>
                }
            /> */}
            <Route
                path="/login"
                element={
                    <RedirectIfLoggedIn>
                        <Login setToken={(token) => localStorage.setItem('token', token)} />
                    </RedirectIfLoggedIn>
                }
            />
            <Route
                path="/register"
                element={
                    <RedirectIfLoggedIn>
                        <Register />
                    </RedirectIfLoggedIn>
                }
            />
            <Route
                path="/forgot-password"
                element={
                    <RedirectIfLoggedIn>
                        <ForgotPassword />
                    </RedirectIfLoggedIn>
                }
            />
            <Route
                path="/home"
                element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                }
            />
            {/* Optional: redirect root URL to login or home */}
            <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
    );
}

export default App;