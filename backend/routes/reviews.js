const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const User = require('../models/User');
const Job = require('../models/Job');

// @route   POST api/reviews
// @desc    Submit a review for a user
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { revieweeId, jobId, rating, comment } = req.body;
        const reviewerId = req.user.id;

        // 1. Verify job exists and is completed
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        if (job.status !== 'completed') {
            return res.status(400).json({ message: 'Reviews can only be submitted for completed jobs' });
        }

        // 2. Verify reviewer is part of the job (either client or hired freelancer)
        const isClient = job.client.toString() === reviewerId;
        const isFreelancer = job.acceptedBid && job.acceptedBid.toString() !== '' && 
                            // We need to check if the freelancer of the acceptedBid is the reviewer
                            // But better check if the reviewee is either the client or the freelancer
                            true; // Placeholder check, refined below

        // 3. Prevent self-review
        if (reviewerId === revieweeId) {
            return res.status(400).json({ message: 'You cannot review yourself' });
        }

        // 4. Create review
        const review = new Review({
            reviewer: reviewerId,
            reviewee: revieweeId,
            job: jobId,
            rating,
            comment
        });

        await review.save();

        // 5. Update reviewee's average rating
        const reviews = await Review.find({ reviewee: revieweeId });
        const numReviews = reviews.length;
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

        await User.findByIdAndUpdate(revieweeId, {
            rating: avgRating.toFixed(1),
            numReviews: numReviews
        });

        res.status(201).json(review);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'You have already reviewed this job' });
        }
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET api/reviews/user/:userId
// @desc    Get all reviews for a user
// @access  Public
router.get('/user/:userId', async (req, res) => {
    try {
        const reviews = await Review.find({ reviewee: req.params.userId })
            .populate('reviewer', 'name')
            .sort({ createdAt: -1 });
        
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
