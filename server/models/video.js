const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoType: { type: String, enum: ['short-form', 'long-form'], required: true },
  shortFormUrl: { type: String },
  longFormUrl: { type: String },
  longFormPricing: { type: Number },
  uploadedBy: { type: String, required: true },
  comments: [
    {
      username: { type: String, required: true },
      text: { type: String, required: true },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
