const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000; // You can use any port you like

// --- MIDDLEWARE ---
// Configure CORS to allow requests from your React frontend
app.use(cors({
    origin: 'http://localhost:3000', // The URL of your React app
    credentials: true
}));
// Allow the server to understand JSON data
app.use(express.json());

// --- A simple test route ---
app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});