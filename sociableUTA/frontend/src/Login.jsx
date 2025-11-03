import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Login.css';

import axiosInstance from './api/axios';

export const Login = ({ setToken, onShowSignup, onShowForgot }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/login', // backend login URL
        { user: username, pwd: password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      const accessToken = response?.data?.accessToken; // get real token from the server
      setToken(accessToken); // update the app state
    } catch (err) {
      if (!err?.response) {
        setError('No Server Response');
      } else if (err.response?.status === 400 || err.response?.status === 401) {
        setError('Invalid Credentials');
      } else {
        setError('Login Failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-main">
        <div className="login-left">
          <h1 className="login-title">SociableUTA</h1>
          <p className="login-welcome">
            Automate your posts. All in once place.<br />
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
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Logging In...' : 'Log In'}
          </button>
          
          {/* Demo Mode Button */}
          <button
            type="button"
            className="login-demo-btn"
            onClick={() => {
              setToken('demo-token'); // Set a demo token
              navigate('/home'); // Navigate to home page
            }}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '10px',
              width: '100%'
            }}
          >
            🚀 Enter Demo Mode (No Login Required)
          </button>
          
          <button
          type="button"
          className="login-create-btn"
          onClick={() => navigate('/register')}
        >
          Create new account
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

        {/* <button
          type="button"
          className="login-create-btn"
          onClick={() => navigate('/register')}
        >
          Create new account
        </button> */}
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
