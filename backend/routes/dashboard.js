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

router.get("/categories", async (req, res) => {
  try {
    const categories = await Job.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: 1,
        },
      },
    ]);

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
