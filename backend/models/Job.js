const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    deadline: { type: Date, required: true },

    category: {
      type: String,
      required: true,
      enum: [
        "Web Development",
        "Design & Creative",
        "Writing & Content",
        "Marketing",
        "Video & Animation",
        "Audio & Music",
        "Translation",
        "Data Science",
      ],
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bid",
      },
    ],

    status: {
      type: String,
      enum: ["open", "in-progress", "completed"],
      default: "open",
    },

    acceptedBid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bid",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
