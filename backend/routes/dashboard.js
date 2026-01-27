const express = require('express');
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const router = express.Router();

// GET /api/dashboard/stats - Dashboard data
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = {
      totalJobs: await Job.countDocuments(),
      openJobs: await Job.countDocuments({ status: 'open' }),
      earnings: 45000, // Mock for now
      proposalsSent: 15 // Mock for now
    };
    
    const jobs = await Job.find({ status: 'open' })
      .populate('client', 'name')
      .limit(5);
      
    res.json({ stats, jobs });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
