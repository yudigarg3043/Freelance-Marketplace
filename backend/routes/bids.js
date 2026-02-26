const express = require('express');
const auth = require('../middleware/auth');
const Bid = require('../models/Bid');
const Job = require('../models/Job');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancers can place bids.' });
    }

    const { jobId, amount, message } = req.body;

    const job = await Job.findOne({ _id: jobId, status: 'open' });
    if (!job) {
      return res.status(404).json({ message: 'Job not found or not open for bidding.' });
    }

    const existingBid = await Bid.findOne({
      job: jobId,
      freelancer: req.user._id
    });

    if (existingBid) {
      return res.status(400).json({ message: 'You have already placed a bid on this job.' });
    }

    const bid = new Bid({
      job: jobId,
      freelancer: req.user._id,
      amount,
      message
    });

    await bid.save();

    // Push bid into the job's bids array
    job.bids.push(bid._id);
    await job.save();

    await bid.populate('freelancer', 'name');

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-bids', auth, async (req, res) => {
  try {
    const bids = await Bid.find({ freelancer: req.user._id })
      .populate('job', 'title status')
      .sort({ createdAt: -1 });
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:jobId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ msg: 'Only clients can view bids' });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job || job.client.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const bids = await Bid.find({ job: req.params.jobId })
      .populate('freelancer', 'name skills')
      .sort({ amount: -1 });

    res.json(bids);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});