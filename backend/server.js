require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const auth = require('./routes/auth');
const jobs = require('./routes/jobs');
const dashboard = require('./routes/dashboard');
const messages = require('./routes/message');
const bids = require('./routes/bids');
const notifications = require('./routes/notification');

const app = express();

app.use(cors({
  origin: [
    'https://freelance-marketplace-frontend-omega.vercel.app',
    'https://freelance-marketplace-gray.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err.message));

// Health check endpoint for debugging
app.get('/api/health', async (req, res) => {
  res.json({
    status: 'Server is running',
    mongoState: mongoose.connection.readyState,
    // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    mongoStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
    envCheck: {
      MONGO_URI: process.env.MONGO_URI ? 'SET (' + process.env.MONGO_URI.substring(0, 20) + '...)' : 'NOT SET',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    }
  });
});

app.use('/api/auth', auth);
app.use('/api/jobs', jobs);
app.use('/api/dashboard', dashboard);
app.use('/api/messages', messages);
app.use('/api/bids', bids);
app.use('/api/notifications', notifications);

const PORT = process.env.Port || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;