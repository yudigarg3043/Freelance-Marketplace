const express = require("express");
const auth = require("../middleware/auth");
const Job = require("../models/Job");
const Bid = require("../models/Bid");
const router = express.Router();

router.get("/stats", auth, async (req, res) => {
  try {
    const stats = {
      totalJobs: await Job.countDocuments(),
      earnings: 45000,
      proposalsSent: 15
    };

    const jobs = await Job.find()
      .populate("client", "name")
      .limit(5);

    res.json({ stats, jobs });
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ message: err.message });
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
    console.error("Categories Error:", err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
