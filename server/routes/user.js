const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/user/profile
 * Get user profile
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userProfile = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      profile: req.user.profile,
      userFrequency: req.user.userFrequency,
      greenPoints: req.user.greenPoints,
      greenWallet: {
        balance: req.user.greenWallet.balance,
        totalEarned: req.user.greenWallet.totalEarned,
        totalRedeemed: req.user.greenWallet.totalRedeemed
      },
      lastLogin: req.user.lastLogin,
      createdAt: req.user.createdAt
    };

    res.json({
      user: userProfile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Failed to get user profile',
      error: error.message
    });
  }
});

/**
 * PUT /api/user/profile
 * Update user profile
 */
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, address, city, state, zipCode } = req.body;

    // Update user fields
    if (name) req.user.name = name;
    if (phone !== undefined) req.user.profile.phone = phone;
    if (address !== undefined) req.user.profile.address = address;
    if (city !== undefined) req.user.profile.city = city;
    if (state !== undefined) req.user.profile.state = state;
    if (zipCode !== undefined) req.user.profile.zipCode = zipCode;

    await req.user.save();

    const updatedProfile = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      profile: req.user.profile,
      userFrequency: req.user.userFrequency
    };

    res.json({
      message: 'Profile updated successfully',
      user: updatedProfile
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

/**
 * GET /api/user/session-test
 * Test session functionality
 */
router.get('/session-test', async (req, res) => {
  try {
    console.log('🧪 Session test - Session ID:', req.sessionID);
    console.log('🧪 Session test - Session data:', req.session);

    res.json({
      sessionId: req.sessionID,
      sessionData: req.session,
      hasUserId: !!req.session?.userId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Session test error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/user/dashboard-session
 * Get real dashboard data using session-based user
 */
router.get('/dashboard-session', async (req, res) => {
  try {
    // Get or create session user
    let sessionUserId = req.session?.userId;

    if (!sessionUserId) {
      // Create a new session user
      const sessionUser = new User({
        name: 'Session User',
        email: `session_${Date.now()}@greenpoints.com`,
        password: 'session_password', // Will be hashed automatically
        profile: {
          phone: '',
          address: '',
          city: '',
          state: '',
          zipCode: ''
        },
        userFrequency: 'Regular',
        greenWallet: {
          balance: 0,
          history: [],
          totalEarned: 0,
          totalRedeemed: 0
        }
      });

      await sessionUser.save();

      // Store in session
      if (!req.session) {
        req.session = {};
      }
      req.session.userId = sessionUser._id;
      sessionUserId = sessionUser._id;

      console.log('✅ Created new session user:', sessionUserId);
    }

    // Fetch real user data
    const user = await User.findById(sessionUserId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate real statistics
    const wallet = user.greenWallet;
    const recentTransactions = wallet.history
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10)
      .map(transaction => ({
        _id: transaction._id,
        type: transaction.type === 'credit' ? 'earned' : 'redeemed',
        amount: transaction.type === 'credit' ? transaction.points : -transaction.points,
        description: transaction.source,
        date: transaction.timestamp,
        metadata: transaction.metadata
      }));

    // Calculate monthly stats
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyTransactions = wallet.history.filter(t =>
      new Date(t.timestamp) >= currentMonth && t.type === 'credit'
    );

    const monthlyStats = {
      submissions: monthlyTransactions.length,
      points: monthlyTransactions.reduce((sum, t) => sum + t.points, 0)
    };

    // Calculate badges based on activity
    const totalSubmissions = wallet.history.filter(t => t.type === 'credit').length;
    const totalPoints = wallet.balance;
    const badges = [];

    if (totalSubmissions >= 1) badges.push('first-submission');
    if (totalSubmissions >= 5) badges.push('eco-warrior');
    if (totalSubmissions >= 10) badges.push('recycling-champion');
    if (totalSubmissions >= 25) badges.push('green-hero');
    if (totalPoints >= 500) badges.push('point-collector');
    if (totalPoints >= 1000) badges.push('green-master');
    if (totalPoints >= 2500) badges.push('eco-legend');

    const dashboardData = {
      user: {
        name: user.name,
        email: user.email,
        userFrequency: user.userFrequency,
        memberSince: user.createdAt,
        badges: badges
      },
      totalPoints: wallet.balance,
      totalSubmissions: totalSubmissions,
      totalRedemptions: wallet.history.filter(t => t.type === 'debit').length,
      monthlyStats,
      recentTransactions,
      badges: badges
    };

    res.json(dashboardData);

  } catch (error) {
    console.error('Get session dashboard error:', error);
    res.status(500).json({
      message: 'Failed to get dashboard data',
      error: error.message
    });
  }
});

/**
 * GET /api/user/dashboard
 * Get user dashboard data
 */
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const wallet = user.greenWallet;

    // Calculate statistics
    const recentTransactions = wallet.history
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);

    const thisMonthTransactions = wallet.history.filter(transaction => {
      const transactionDate = new Date(transaction.timestamp);
      const now = new Date();
      return transactionDate.getMonth() === now.getMonth() && 
             transactionDate.getFullYear() === now.getFullYear();
    });

    const thisMonthEarned = thisMonthTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.points, 0);

    const thisMonthRedeemed = thisMonthTransactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + Math.abs(t.points), 0);

    // Count items submitted by type
    const itemsSubmitted = wallet.history
      .filter(t => t.type === 'credit' && t.metadata && t.metadata.itemType)
      .reduce((acc, t) => {
        const type = t.metadata.itemType;
        acc[type] = (acc[type] || 0) + (t.metadata.quantity || 1);
        return acc;
      }, {});

    const dashboardData = {
      user: {
        name: user.name,
        email: user.email,
        userFrequency: user.userFrequency,
        memberSince: user.createdAt
      },
      wallet: {
        balance: wallet.balance,
        totalEarned: wallet.totalEarned,
        totalRedeemed: wallet.totalRedeemed,
        thisMonthEarned,
        thisMonthRedeemed
      },
      statistics: {
        totalTransactions: wallet.history.length,
        totalItemsSubmitted: Object.values(itemsSubmitted).reduce((sum, count) => sum + count, 0),
        itemsSubmittedByType: itemsSubmitted,
        averagePointsPerTransaction: wallet.history.length > 0 
          ? Math.round(wallet.totalEarned / wallet.history.filter(t => t.type === 'credit').length)
          : 0
      },
      recentTransactions
    };

    res.json(dashboardData);

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      message: 'Failed to get dashboard data',
      error: error.message
    });
  }
});

/**
 * GET /api/user/stats
 * Get user statistics
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const wallet = user.greenWallet;

    // Calculate monthly stats for the last 6 months
    const monthlyStats = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthTransactions = wallet.history.filter(transaction => {
        const transactionDate = new Date(transaction.timestamp);
        return transactionDate >= date && transactionDate < nextMonth;
      });

      const earned = monthTransactions
        .filter(t => t.type === 'credit')
        .reduce((sum, t) => sum + t.points, 0);

      const redeemed = monthTransactions
        .filter(t => t.type === 'debit')
        .reduce((sum, t) => sum + Math.abs(t.points), 0);

      monthlyStats.push({
        month: date.toISOString().substring(0, 7), // YYYY-MM format
        earned,
        redeemed,
        transactions: monthTransactions.length
      });
    }

    res.json({
      monthlyStats,
      totalStats: {
        balance: wallet.balance,
        totalEarned: wallet.totalEarned,
        totalRedeemed: wallet.totalRedeemed,
        totalTransactions: wallet.history.length,
        userFrequency: user.userFrequency,
        memberSince: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      message: 'Failed to get user statistics',
      error: error.message
    });
  }
});

module.exports = router;
