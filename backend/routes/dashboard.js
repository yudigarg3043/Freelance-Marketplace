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

router.get("/freelancer", auth, async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const freelancerId = req.user._id;

    const totalBids = await Bid.countDocuments({
      freelancer: freelancerId,
    });

    const activeProjects = await Job.find({
      assignedFreelancer: freelancerId,
      status: "in-progress",
    })
      .populate("client", "name")
      .limit(5);

    const earningsAgg = await Job.aggregate([
      {
        $match: {
          assignedFreelancer: freelancerId,
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$budget" },
        },
      },
    ]);

    const totalEarnings = earningsAgg.length > 0 ? earningsAgg[0].total : 0;

    res.json({
      stats: {
        totalEarnings,
        activeProjects: activeProjects.length,
        profileViews: 542,
        totalBids,
      },
      activeProjects,
      recentActivity: [],
    });
  } catch (err) {
    console.error("Freelancer Dashboard Error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/client", auth, async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Access denied" });
    }

    const clientId = req.user._id;

    const totalJobs = await Job.countDocuments({
      client: clientId,
    });

    const activeProjects = await Job.find({
      client: clientId,
      status: { $in: ["open", "in-progress"] },
    })
      .populate("assignedFreelancer", "name")
      .limit(5);

    const completedJobs = await Job.countDocuments({
      client: clientId,
      status: "completed",
    });

    const totalSpentAgg = await Job.aggregate([
      {
        $match: {
          client: clientId,
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$budget" },
        },
      },
    ]);

    const totalSpent =
      totalSpentAgg.length > 0 ? totalSpentAgg[0].total : 0;

    res.json({
      stats: {
        totalSpent,
        activeProjects: activeProjects.length,
        totalJobs,
        completedJobs,
      },
      activeProjects,
      recentActivity: [],
    });
  } catch (err) {
    console.error("Client Dashboard Error:", err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
