const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Green Wallet Transaction Schema
const transactionSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  points: {
    type: Number,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  metadata: {
    itemType: String,
    condition: String,
    quantity: Number,
    weight: Number,
    userFrequency: String
  }
});

// Green Wallet Schema
const greenWalletSchema = new mongoose.Schema({
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  history: [transactionSchema],
  totalEarned: {
    type: Number,
    default: 0
  },
  totalRedeemed: {
    type: Number,
    default: 0
  }
});

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  greenPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  greenWallet: {
    type: greenWalletSchema,
    default: () => ({
      balance: 0,
      history: [],
      totalEarned: 0,
      totalRedeemed: 0
    })
  },
  userFrequency: {
    type: String,
    enum: ['First-time', 'Occasional', 'Regular'],
    default: 'First-time'
  },
  profile: {
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  badges: {
    type: [String],
    default: []
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: String,
    default: null
  },
  referralBonusClaimed: {
    type: Boolean,
    default: false
  },
  totalItemsRecycled: {
    type: Number,
    default: 0
  },
  totalWeightRecycled: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update user frequency based on transaction count
userSchema.methods.updateUserFrequency = function() {
  const transactionCount = this.greenWallet.history.filter(t => t.type === 'credit').length;
  
  if (transactionCount >= 10) {
    this.userFrequency = 'Regular';
  } else if (transactionCount >= 3) {
    this.userFrequency = 'Occasional';
  } else {
    this.userFrequency = 'First-time';
  }
};

// Add points to wallet with weight bonus
userSchema.methods.addPoints = function(points, source, metadata = {}) {
  // Add weight bonus: 2 points per kg
  if (metadata.weight) {
    points += metadata.weight * 2;
  }

  this.greenWallet.balance += points;
  this.greenPoints = this.greenWallet.balance;
  this.greenWallet.totalEarned += points;

  // Update recycling stats
  if (metadata.quantity) {
    this.totalItemsRecycled += metadata.quantity;
  }
  if (metadata.weight) {
    this.totalWeightRecycled += metadata.weight;
  }

  this.greenWallet.history.push({
    points,
    source,
    type: 'credit',
    metadata
  });

  this.updateUserFrequency();
  this.updateBadges();
};

// Redeem points from wallet
userSchema.methods.redeemPoints = function(points, source) {
  if (this.greenWallet.balance < points) {
    throw new Error('Insufficient points balance');
  }
  
  this.greenWallet.balance -= points;
  this.greenPoints = this.greenWallet.balance;
  this.greenWallet.totalRedeemed += points;
  
  this.greenWallet.history.push({
    points: -points,
    source,
    type: 'debit'
  });
};

// Update badges based on achievements
userSchema.methods.updateBadges = function() {
  const newBadges = [];

  // Welcome Badge (on signup)
  if (!this.badges.includes('Welcome')) {
    newBadges.push('Welcome');
  }

  // Eco Hero (500+ points earned)
  if (this.greenWallet.totalEarned >= 500 && !this.badges.includes('Eco Hero')) {
    newBadges.push('Eco Hero');
  }

  // Bulk Recycler (10+ items recycled)
  if (this.totalItemsRecycled >= 10 && !this.badges.includes('Bulk Recycler')) {
    newBadges.push('Bulk Recycler');
  }

  // Green Champion (1000+ points earned)
  if (this.greenWallet.totalEarned >= 1000 && !this.badges.includes('Green Champion')) {
    newBadges.push('Green Champion');
  }

  // Heavy Lifter (50+ kg recycled)
  if (this.totalWeightRecycled >= 50 && !this.badges.includes('Heavy Lifter')) {
    newBadges.push('Heavy Lifter');
  }

  // Regular Recycler (Regular user frequency)
  if (this.userFrequency === 'Regular' && !this.badges.includes('Regular Recycler')) {
    newBadges.push('Regular Recycler');
  }

  // Add new badges
  this.badges = [...this.badges, ...newBadges];
  return newBadges;
};

// Check if points are eligible for 2X value (within 24 hours)
userSchema.methods.canUse2XValue = function() {
  const lastCreditTransaction = this.greenWallet.history
    .filter(t => t.type === 'credit')
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

  if (!lastCreditTransaction) return false;

  const now = new Date();
  const lastEarned = new Date(lastCreditTransaction.timestamp);
  const timeDiff = now - lastEarned;
  const twentyFourHours = 24 * 60 * 60 * 1000;

  return timeDiff <= twentyFourHours;
};

// Get time remaining for 2X value
userSchema.methods.get2XTimeRemaining = function() {
  const lastCreditTransaction = this.greenWallet.history
    .filter(t => t.type === 'credit')
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

  if (!lastCreditTransaction) return 0;

  const now = new Date();
  const lastEarned = new Date(lastCreditTransaction.timestamp);
  const timeDiff = now - lastEarned;
  const twentyFourHours = 24 * 60 * 60 * 1000;

  return Math.max(0, twentyFourHours - timeDiff);
};

// Generate unique referral code
userSchema.methods.generateReferralCode = function() {
  if (!this.referralCode) {
    this.referralCode = this.name.replace(/\s+/g, '').toUpperCase().substring(0, 3) +
                       Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  return this.referralCode;
};

module.exports = mongoose.model('User', userSchema);
