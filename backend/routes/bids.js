const express = require('express');
const auth = require('../middleware/auth');
const Bid = require('../models/Bid');
const Job = require('../models/Job');
const Notification = require('../models/Notification');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancers can place bids.' });
    }

    const { jobId, amount, message } = req.body;

    const job = await Job.findOne({ _id: jobId, status: { $nin: ['in-progress', 'completed'] } });
    if (!job) {
      return res.status(404).json({ message: 'Job not found or not open for bidding.' });
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

      // Notify client about updated bid
      await Notification.create({
        recipient: job.client,
        type: 'bid_updated',
        message: `${req.user.name} updated their proposal on "${job.title}" to ₹${amount.toLocaleString()}`,
        link: `/jobs/${job._id}`,
      });

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

    // Notify client about new bid
    await Notification.create({
      recipient: job.client,
      type: 'new_bid',
      message: `${req.user.name} submitted a proposal on "${job.title}" for ₹${amount.toLocaleString()}`,
      link: `/jobs/${job._id}`,
    });

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

    // Notify the accepted freelancer
    await Notification.create({
      recipient: bid.freelancer._id,
      type: 'bid_accepted',
      message: `🎉 Your proposal on "${job.title}" has been accepted!`,
      link: `/jobs/${job._id}`,
    });

    // Notify rejected freelancers
    const rejectedBids = await Bid.find({ job: bid.job, _id: { $ne: bid._id } }).populate('freelancer', 'name');
    for (const rBid of rejectedBids) {
      await Notification.create({
        recipient: rBid.freelancer._id,
        type: 'bid_rejected',
        message: `Your proposal on "${job.title}" was not selected.`,
        link: `/jobs/${job._id}`,
      });
    }

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

    // Notify the rejected freelancer
    await Notification.create({
      recipient: bid.freelancer._id,
      type: 'bid_rejected',
      message: `Your proposal on "${job.title}" was rejected.`,
      link: `/jobs/${job._id}`,
    });

    res.json({ message: 'Bid rejected', bid });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;