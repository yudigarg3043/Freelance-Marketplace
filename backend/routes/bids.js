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

    const job = await Job.findOne({ _id: jobId });
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    if (job.status !== 'open' || job.acceptedBid) {
      return res.status(400).json({ message: 'This job is no longer open for bidding as a freelancer has already been hired.' });
    }

    if (new Date(job.deadline) < new Date()) {
      return res.status(400).json({ message: 'The deadline for this job has passed.' });
    }

    const existingBid = await Bid.findOne({
      job: jobId,
      freelancer: req.user._id
    });

    if (existingBid) {
      // Update existing bid instead of creating a new one
      existingBid.amount = amount;
      existingBid.message = message;
      await existingBid.save();
      await existingBid.populate('freelancer', 'name');


      return res.json({ message: 'Bid updated successfully', bid: existingBid, updated: true });
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
      .populate({
        path: 'job',
        select: 'title status budget client',
        populate: { path: 'client', select: 'name' }
      })
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

// Accept a bid
router.patch('/:bidId/accept', auth, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can accept bids' });
    }

    const bid = await Bid.findById(req.params.bidId);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    const job = await Job.findById(bid.job);
    if (!job || job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ message: 'This job is no longer open for bidding' });
    }

    // Accept this bid
    bid.status = 'accepted';
    await bid.save();

    // Reject all other bids on this job
    await Bid.updateMany(
      { job: bid.job, _id: { $ne: bid._id } },
      { status: 'rejected' }
    );

    // Update job status
    job.status = 'in-progress';
    job.acceptedBid = bid._id;
    await job.save();

    await bid.populate('freelancer', 'name');



    res.json({ message: 'Bid accepted successfully', bid });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reject a bid
router.patch('/:bidId/reject', auth, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can reject bids' });
    }

    const bid = await Bid.findById(req.params.bidId);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    const job = await Job.findById(bid.job);
    if (!job || job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    bid.status = 'rejected';
    await bid.save();

    await bid.populate('freelancer', 'name');



    res.json({ message: 'Bid rejected', bid });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;