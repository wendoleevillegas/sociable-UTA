import React, { useState } from 'react';
import './Login.css';

export const Login = ({ setToken, onShowSignup, onShowForgot }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (email && password) {
      setToken('mock-token');
      localStorage.setItem('token', 'mock-token');
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
            placeholder="Email or phone number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <button
            type="button"
            className="login-create-btn"
            onClick={onShowSignup}
          >
            Create new account
          </button>
        </form>
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