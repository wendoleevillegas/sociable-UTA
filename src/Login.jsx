import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/'); // home page, assuming it is already authenticated
      } else {
        setError(data.message || 'Incorrect email or password, please try again.');
      }
    } catch (err) {
      setError('Server error');
    }
  };


  return (
    <div className="login-root">
      <div className="login-main">
        <div className="login-left">
          <h1 className="login-title">SociableUTA</h1>
          <p className="login-welcome">
            Welcome!<br />
          </p>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          {error && <p className="login-error">{error}</p>}
          <input
            type="text"
            placeholder="Email"
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
            onClick={e => { e.preventDefault(); navigate('/forgot-password'); }}
          >
            Forgot password?
          </a>
          <div className="login-divider"></div>
          {/* <button
            type="button"
            className="login-create-btn"
            onClick={onShowSignup}
          >
            Sign Up
          </button> */}

          <button type="button" onClick={() => navigate('/register')}>
            Sign Up
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
