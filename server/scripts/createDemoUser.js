const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function createDemoUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/green-points');
    console.log('✅ Connected to MongoDB');

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'demo@greenpoints.com' });
    if (existingUser) {
      console.log('Demo user already exists');
      process.exit(0);
    }

    // Create demo user
    const demoUser = new User({
      name: 'Demo User',
      email: 'demo@greenpoints.com',
      password: 'demo123', // This will be hashed automatically
      greenPoints: 150,
      greenWallet: {
        balance: 150,
        history: [
          {
            timestamp: new Date('2024-01-15'),
            points: 110,
            source: 'Sold Smartphone',
            type: 'credit',
            metadata: {
              itemType: 'Smartphone',
              condition: 'Working',
              quantity: 1,
              weight: 0.5,
              userFrequency: 'Regular'
            }
          },
          {
            timestamp: new Date('2024-01-20'),
            points: 65,
            source: 'Sold Battery',
            type: 'credit',
            metadata: {
              itemType: 'Battery',
              condition: 'Working',
              quantity: 2,
              weight: 1.0,
              userFrequency: 'Regular'
            }
          },
          {
            timestamp: new Date('2024-01-25'),
            points: -25,
            source: 'Redeemed for Bamboo Water Bottle',
            type: 'debit'
          }
        ],
        totalEarned: 175,
        totalRedeemed: 25
      },
      userFrequency: 'Regular',
      badges: ['Welcome', 'Eco Hero', 'Regular Recycler'],
      totalItemsRecycled: 15,
      totalWeightRecycled: 12.5,
      referralCode: 'DEMO2024',
      profile: {
        phone: '+1234567890',
        address: '123 Green Street',
        city: 'EcoCity',
        state: 'CA',
        zipCode: '12345'
      },
      isActive: true,
      lastLogin: new Date(),
      createdAt: new Date('2024-01-01')
    });

    await demoUser.save();
    console.log('✅ Demo user created successfully!');
    console.log('Email: demo@greenpoints.com');
    console.log('Password: demo123');
    console.log('Green Points: 150');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating demo user:', error);
    process.exit(1);
  }
}

createDemoUser();
