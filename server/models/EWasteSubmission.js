const mongoose = require('mongoose');

const eWasteSubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceType: {
    type: String,
    required: true,
    enum: ['smartphone', 'laptop', 'tablet', 'desktop', 'monitor', 'printer', 'other']
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true,
    enum: ['excellent', 'good', 'fair', 'poor', 'broken']
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  estimatedPrice: {
    type: Number,
    required: true,
    min: 0
  },
  pointsEarned: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  verificationDate: {
    type: Date
  },
  notes: {
    type: String
  },
  images: [{
    type: String // URLs to uploaded images
  }]
}, {
  timestamps: true
});

// Index for efficient queries
eWasteSubmissionSchema.index({ userId: 1, submissionDate: -1 });
eWasteSubmissionSchema.index({ status: 1 });

module.exports = mongoose.model('EWasteSubmission', eWasteSubmissionSchema);
