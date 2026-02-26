const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const { title, description, budget, deadline, category } = req.body;

        if (req.user.role !== 'client') {
            return res.status(403).json({ message: 'Only clients can post jobs.' });
        }

        const job = new Job({
            title,
            description,
            budget,
            deadline,
            category,
            client: req.user._id
        });

        await job.save();
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate('client', 'name')
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('client', 'name email')
            .populate({
                path: 'bids',
                populate: { path: 'freelancer', select: 'name' },
                options: { sort: { createdAt: -1 } }
            });

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.json(job);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.client.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this job' });
        }

        const { title, description, budget, deadline, category } = req.body;

        if (title) job.title = title;
        if (description) job.description = description;
        if (budget) job.budget = budget;
        if (deadline) job.deadline = deadline;
        if (category) job.category = category;

        await job.save();
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;