const mongoose = require('mongoose');

const redemptionRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  itemDescription: {
    type: String
  },
  pointsCost: {
    type: Number,
    required: true,
    min: 1
  },
  category: {
    type: String,
    enum: ['gift_card', 'electronics', 'eco_products', 'vouchers', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  approvalDate: {
    type: Date
  },
  shippingDate: {
    type: Date
  },
  deliveryDate: {
    type: Date
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  trackingNumber: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
redemptionRequestSchema.index({ userId: 1, requestDate: -1 });
redemptionRequestSchema.index({ status: 1 });

module.exports = mongoose.model('RedemptionRequest', redemptionRequestSchema);
