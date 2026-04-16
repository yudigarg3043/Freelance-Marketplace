require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');

const auth = require('./routes/auth');
const jobs = require('./routes/jobs');
const dashboard = require('./routes/dashboard');
const bids = require('./routes/bids');
const reviews = require('./routes/reviews');

const app = express();

// 1. GLOBAL FAIL-SAFE CORS - MUST BE FIRST
// This middleware ensures that even if something crashes later, the browser gets CORS headers
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://freelance-marketplace-frontend-omega.vercel.app',
    'https://freelance-marketplace-gray.vercel.app',
    'http://localhost:3000',
    'http://localhost:4080'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    // Allow server-to-server requests
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Standard CORS as a backup and for better integration with other middlewares
app.use(cors({
  origin: true, // Controlled by the manual header above, but true mirrors the origin correctly
  credentials: true
}));

// 2. Middlewares
app.use(express.json());
app.use(passport.initialize());

// Load Passport configuration AFTER app initialization
require('./config/passport'); 

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err.message));

// 4. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date(),
    mongoState: mongoose.connection.readyState,
    envCheck: {
      MONGO_URI: process.env.MONGO_URI ? 'SET' : 'NOT SET',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
      FRONTEND_URL: process.env.FRONTEND_URL || 'NOT SET',
      GOOGLE_CONFIG: (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) ? 'SET' : 'NOT SET'
    }
  });
});

// 5. Routes
app.use('/api/auth', auth);
app.use('/api/jobs', jobs);
app.use('/api/dashboard', dashboard);
app.use('/api/bids', bids);
app.use('/api/reviews', reviews);

// 6. Global Error Handler - Now includes CORS headers
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  
  // Re-ensure CORS headers are present even in error responses
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Detailed error in server logs'
  });
});

const PORT = process.env.PORT || process.env.Port || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;