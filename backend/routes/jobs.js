const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const {title, description, budget, deadline} = req.body;

        if (req.user.role !== 'client') {
            return res.status(403).json({ message: 'Only clients can post jobs.' });
        }

        const job = new Job({
            title,
            description,
            budget,
            deadline,
            client: req.user._id
        });

        await job.save();
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({message: 'Server error'});
    }
});

router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find()
        .populate('client', 'name')
        .sort({createdAt: -1});
        res.json(jobs);
    } catch(err) {
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;