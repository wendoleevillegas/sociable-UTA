import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Login.css';

export const Login = ({ setToken, onShowSignup, onShowForgot }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // TESTING
    const MOCK_USER = "testuser";
    const MOCK_PASS = "password123";

    if (username === MOCK_USER && password === MOCK_PASS) {
      // call setToken function from props, will update state in App.jsx and trigger a re-render
      setToken('mock-token');
      // localStorage.setItem('token', 'mock-token');
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-root">
      <div className="login-main">
        <div className="login-left">
          <h1 className="login-title">Sociable</h1>
          <p className="login-welcome">
            Welcome come with our project<br />
          </p>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          {error && <p className="login-error">{error}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-btn">
            Log In
          </button>
          <a
            href="#"
            className="login-forgot"
            onClick={e => { e.preventDefault(); onShowForgot(); }}
          >
            Forgot password?
          </a>
          <div className="login-divider"></div>
          {/* <button
            type="button"
            className="login-create-btn"
            onClick={() => navigate('/register')}
          >
            Create new account
          </button> */}
        </form>

        {/* Moved new account button because it is a redirect, not submission */}

        <button
          type="button"
          className="login-create-btn"
          onClick={() => navigate('/register')}
        >
          Create new account
        </button>
      </div>
      <footer className="login-footer">
        <div className="login-footer-content">
          <div className="login-footer-lang">
          </div>
          <div className="login-footer-links">
          </div>
        </div>
      </footer>
    </div>
  );
};
