const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { 
  calculateGreenPoints, 
  getPointsBreakdown, 
  validatePointsData 
} = require('../utils/pointsCalculator');

const router = express.Router();

/**
 * POST /api/points/submit
 * Submit e-waste and earn Green Points
 */
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { type, condition, quantity, description, imageUrl } = req.body;

    // Prepare data for points calculation
    const pointsData = {
      type,
      condition,
      quantity: parseInt(quantity),
      userFrequency: req.user.userFrequency
    };

    // Validate input data
    const validationErrors = validatePointsData(pointsData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Calculate points
    const points = calculateGreenPoints(pointsData);
    const breakdown = getPointsBreakdown(pointsData);

    // Add points to user's wallet
    const source = `Sold ${type}`;
    const metadata = {
      itemType: type,
      condition,
      quantity: parseInt(quantity),
      userFrequency: req.user.userFrequency,
      description,
      imageUrl
    };

    req.user.addPoints(points, source, metadata);
    await req.user.save();

    res.json({
      message: `You've earned ${points} Green Points!`,
      points,
      breakdown,
      newBalance: req.user.greenWallet.balance,
      userFrequency: req.user.userFrequency,
      transaction: {
        timestamp: new Date(),
        points,
        source,
        type: 'credit',
        metadata
      }
    });

  } catch (error) {
    console.error('Points submission error:', error);
    res.status(500).json({
      message: 'Failed to process e-waste submission',
      error: error.message
    });
  }
});

/**
 * POST /api/points/redeem
 * Redeem Green Points
 */
router.post('/redeem', authenticateToken, async (req, res) => {
  try {
    const { points, redeemFor, description } = req.body;

    if (!points || points <= 0) {
      return res.status(400).json({
        message: 'Points must be a positive number'
      });
    }

    if (!redeemFor) {
      return res.status(400).json({
        message: 'Redemption purpose is required'
      });
    }

    // Check if user has enough points
    if (req.user.greenWallet.balance < points) {
      return res.status(400).json({
        message: 'Insufficient points balance',
        currentBalance: req.user.greenWallet.balance,
        requested: points
      });
    }

    // Redeem points
    const source = `Redeemed for ${redeemFor}`;
    req.user.redeemPoints(points, source);
    await req.user.save();

    res.json({
      message: `Successfully redeemed ${points} Green Points!`,
      pointsRedeemed: points,
      redeemFor,
      newBalance: req.user.greenWallet.balance,
      transaction: {
        timestamp: new Date(),
        points: -points,
        source,
        type: 'debit'
      }
    });

  } catch (error) {
    console.error('Points redemption error:', error);
    res.status(500).json({
      message: 'Failed to redeem points',
      error: error.message
    });
  }
});

/**
 * GET /api/points/balance
 * Get user's Green Points balance
 */
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    res.json({
      balance: req.user.greenWallet.balance,
      totalEarned: req.user.greenWallet.totalEarned,
      totalRedeemed: req.user.greenWallet.totalRedeemed,
      userFrequency: req.user.userFrequency
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      message: 'Failed to get points balance',
      error: error.message
    });
  }
});

/**
 * GET /api/points/history
 * Get user's transaction history
 */
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    
    let history = req.user.greenWallet.history;

    // Filter by transaction type if specified
    if (type && ['credit', 'debit'].includes(type)) {
      history = history.filter(transaction => transaction.type === type);
    }

    // Sort by timestamp (newest first)
    history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedHistory = history.slice(startIndex, endIndex);

    res.json({
      history: paginatedHistory,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(history.length / limit),
        totalTransactions: history.length,
        hasNext: endIndex < history.length,
        hasPrev: startIndex > 0
      }
    });

  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      message: 'Failed to get transaction history',
      error: error.message
    });
  }
});

/**
 * POST /api/points/calculate
 * Calculate points for given e-waste (preview)
 */
router.post('/calculate', authenticateToken, async (req, res) => {
  try {
    const { type, condition, quantity } = req.body;

    const pointsData = {
      type,
      condition,
      quantity: parseInt(quantity),
      userFrequency: req.user.userFrequency
    };

    // Validate input data
    const validationErrors = validatePointsData(pointsData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    const points = calculateGreenPoints(pointsData);
    const breakdown = getPointsBreakdown(pointsData);

    res.json({
      estimatedPoints: points,
      breakdown,
      userFrequency: req.user.userFrequency
    });

  } catch (error) {
    console.error('Points calculation error:', error);
    res.status(500).json({
      message: 'Failed to calculate points',
      error: error.message
    });
  }
});

module.exports = router;
