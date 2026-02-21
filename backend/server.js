const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const auth = require('./routes/auth');
const jobs = require('./routes/jobs');
const dashboard = require('./routes/dashboard');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: [
    'https://freelance-marketplace-frontend-omega.vercel.app', // Your production frontend
    'http://localhost:3000' // For local development
  ],
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.use('/api/auth', auth);
app.use('/api/jobs', jobs);
app.use('/api/dashboard', dashboard);

const PORT = process.env.Port || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;