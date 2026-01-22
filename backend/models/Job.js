const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title : { type: String, required: true },
    description: {type: String, required: true},
    budget: {type: Number, required: true},
    deadline: {type: Date, required: true},
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);