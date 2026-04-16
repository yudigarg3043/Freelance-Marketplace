const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();
const passport = require('passport');

// Step 1: Send user to Google
router.get('/google', (req, res, next) => {
  const role = req.query.role || 'freelancer';
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false,
    state: Buffer.from(JSON.stringify({ role })).toString('base64')
  })(req, res, next);
});

// Step 2: Google sends user back here
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`, 
    session: false 
  }),
  (req, res) => {
    // Generate JWT
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '2h' }
    );

    // Redirect back to Next.js frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/login?token=${token}`);
  }
);

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, title, location, bio, skills } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ name, email, password, role, phone, title, location, bio, skills });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.status(201).json({
      token,
      message: 'User registered successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({
      token,
      message: `Welcome back, ${user.name}!`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

//Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

const upload = require('../middleware/upload');

// Update Profile
router.put('/me', auth, upload.single('resume'), async (req, res) => {
  try {
    let { name, title, phone, location, bio, skills, portfolio } = req.body;

    // Handle FormData parsing for arrays/objects
    if (typeof skills === 'string') {
      try { skills = JSON.parse(skills); } catch (e) { 
        skills = skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    if (typeof portfolio === 'string') {
      try { portfolio = JSON.parse(portfolio); } catch (e) { portfolio = []; }
    }

    const updates = {
      name,
      title,
      phone,
      location,
      bio,
      skills,
      portfolio,
    };

    // If a resume was uploaded, update the user's resume URL
    if (req.file) {
      updates.resume = req.file.path;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select('-password');

    res.json({ user });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// Get public profile of any user by ID
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -email -phone'); // Hide private info
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;