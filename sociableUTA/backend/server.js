const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

const mongoose = require('mongoose');

// --- MIDDLEWARE ---
// Configure CORS to allow requests from React frontend
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173' // <-- Add the exact URL from your error message
    ],
    credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

// temporary in-memory DB to store users
let users = {};

// ROUTES

// Registration Route
app.post('/register', (req, res) => {
    const { user, pwd } = req.body;

    if (users[user]) {
        return res.status(409).json({ message: 'Username already exists' }); // 409 Conflict
    }

    // In a real app, you would hash the password here!
    users[user] = { password: pwd };
    console.log('Registered Users:', users);
    res.status(201).json({ message: 'User registered successfully' });
});

// Login Route
app.post('/login', (req, res) => {
    const { user, pwd } = req.body;
    const userAccount = users[user];

    if (!userAccount || userAccount.password !== pwd) {
        return res.status(401).json({ message: 'Invalid credentials' }); // 401 Unauthorized
    }

    // In a real app, you would generate a real token (JWT) here
    res.json({ accessToken: 'mock-token-from-server' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});