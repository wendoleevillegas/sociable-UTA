import { Routes, Route, Navigate } from 'react-router-dom';
// import Login from './Login.jsx';
// import Register from './Register.jsx';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import Home from './Index';


// Checking authentication
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

const RedirectIfLoggedIn = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? <Navigate to="/" /> : children;
};

function App() {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <RedirectIfLoggedIn>
                        <Login />
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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
}

export default App;