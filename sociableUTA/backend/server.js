require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // <-- Import bcryptjs
const User = require('./models/User'); // <-- Import the User model

const app = express();
const PORT = 5000;

// middleware?
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173'
    ],
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// DB connection
const DB_URL = process.env.DATABASE_URL;
mongoose.connect(DB_URL)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error(err));


// --- ROUTES ---

// test route
app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

// register route using mongodb
app.post('/register', async (req, res) => {
    const { user, pwd } = req.body;
    try {
        const existingUser = await User.findOne({ username: user });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(pwd, 12);
        const newUser = new User({ username: user, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// login route using mongodb
app.post('/login', async (req, res) => {
    const { user, pwd } = req.body;
    try {
        const userAccount = await User.findOne({ username: user });
        if (!userAccount) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(pwd, userAccount.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // We will implement a real token next
        res.json({ accessToken: 'real-token-coming-soon' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// starting the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});