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

// Add points to wallet
userSchema.methods.addPoints = function(points, source, metadata = {}) {
  this.greenWallet.balance += points;
  this.greenPoints = this.greenWallet.balance;
  this.greenWallet.totalEarned += points;
  
  this.greenWallet.history.push({
    points,
    source,
    type: 'credit',
    metadata
  });
  
  this.updateUserFrequency();
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

module.exports = mongoose.model('User', userSchema);
