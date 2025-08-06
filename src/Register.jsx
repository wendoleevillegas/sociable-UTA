import './Register.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
            setError("Please enter a valid email.");
            return;
        }
        if (password.length < 6 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            setError("Password must be at least 6 characters, include a capital letter and number.");
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                navigate('/login');
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError("Server error");
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleRegister}>
                <h2>Register</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Sign Up</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}
