const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
        type: String,
        enum: ['freelancer', 'client'],
        default: 'freelancer',
        required: true
    },

    title: { type: String },
    phone: { type: String, required: false }, // Optional for OAuth users
    location: { type: String },
    bio: { type: String },
    skills: [{ type: String }],

    // Portfolio Management
    portfolio: [{
        title: { type: String, required: true },
        description: { type: String },
        link: { type: String },
        imageUrl: { type: String }
    }],

    resume: { type: String, default: "" },

    // Ratings & Reviews
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);