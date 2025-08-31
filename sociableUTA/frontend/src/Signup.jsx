import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';

export const Signup = ({ onBackToLogin }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    birthMonth: 'Jun',
    birthDay: '22',
    birthYear: '2025',
    gender: '',
    contact: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const years = Array.from({ length: 100 }, (_, i) => (2025 - i).toString());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:5500/api/users', {
        firstName: form.firstName,
        lastName: form.lastName,
        birthday: `${form.birthYear}-${months.indexOf(form.birthMonth) + 1}-${form.birthDay}`,
        gender: form.gender,
        contact: form.contact,
        password: form.password,
      });

      setSuccess('Account created successfully! You can now log in.');
      setTimeout(onBackToLogin, 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-root">
      <h1 className="signup-title">Sociable</h1>

      <div className="signup-main">
        <h2 className="signup-heading">Create a new account</h2>
        <p className="signup-subheading">It's quick and easy.</p>
        <hr className="signup-divider" />

        <form onSubmit={handleSubmit}>
          {error && <div className="signup-error">{error}</div>}
          {success && <div className="signup-success">{success}</div>}

          <div className="signup-row">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={form.firstName}
              onChange={handleChange}
              className="signup-input"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={form.lastName}
              onChange={handleChange}
              className="signup-input"
              required
            />
          </div>

          <label className="signup-label">
            Birthday
          </label>
          <div className="signup-row">
            <select
              name="birthMonth"
              value={form.birthMonth}
              onChange={handleChange}
              className="signup-select"
            >
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <select
              name="birthDay"
              value={form.birthDay}
              onChange={handleChange}
              className="signup-select"
            >
              {days.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              name="birthYear"
              value={form.birthYear}
              onChange={handleChange}
              className="signup-select"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <label className="signup-label">
            Gender
          </label>
          <div className="signup-row">
            <label className="signup-radio-label">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={form.gender === 'Female'}
                onChange={handleChange}
                className="signup-radio"
                required
              />
              Female
            </label>

            <label className="signup-radio-label">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={form.gender === 'Male'}
                onChange={handleChange}
                className="signup-radio"
              />
              Male
            </label>

            <label className="signup-radio-label">
              <input
                type="radio"
                name="gender"
                value="Custom"
                checked={form.gender === 'Custom'}
                onChange={handleChange}
                className="signup-radio"
              />
              Custom
            </label>
          </div>

          <input
            type="text"
            name="contact"
            placeholder="Mobile number or email"
            value={form.contact}
            onChange={handleChange}
            className="signup-input signup-input-full"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="New password"
            value={form.password}
            onChange={handleChange}
            className="signup-input signup-input-full"
            required
          />

          <p className="signup-info">
            People who use our service may have uploaded your contact information to Facebook. <a href="#" className="signup-link">Learn more.</a>
          </p>
          <p className="signup-info">
            By clicking Sign Up, you agree to our <a href="#" className="signup-link">Terms</a>, <a href="#" className="signup-link">Privacy Policy</a> and <a href="#" className="signup-link">Cookies Policy</a>. You may receive SMS Notifications from us and can opt out any time.
          </p>

          <button
            type="submit"
            className="signup-btn"
          >
            Sign Up
          </button>
        </form>

        <div className="signup-login-link">
          <button
            type="button"
            className="signup-login-btn"
            onClick={onBackToLogin}
          >
            Already have an account?
          </button>
        </div>
      </div>
    </div>
  );
};