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

// 1. CORS - MUST BE FIRST
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://freelance-marketplace-frontend-omega.vercel.app',
      'https://freelance-marketplace-gray.vercel.app',
      'http://localhost:3000',
      'http://localhost:4080'
    ];
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Handle preflight requests for all routes
app.options('*', cors());

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

// 6. Global Error Handler
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || process.env.Port || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;