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
    const { type, condition, quantity, weight, description, imageUrl } = req.body;

    // Prepare data for points calculation
    const pointsData = {
      type,
      condition,
      quantity: parseInt(quantity),
      weight: weight ? parseFloat(weight) : 0,
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
      weight: weight ? parseFloat(weight) : 0,
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

    // Check 2X value eligibility
    const canUse2X = req.user.canUse2XValue();
    const multiplier = canUse2X ? 2 : 1;
    const effectiveValue = points * multiplier;

    // Check if user has enough points
    if (req.user.greenWallet.balance < points) {
      return res.status(400).json({
        message: 'Insufficient points balance',
        currentBalance: req.user.greenWallet.balance,
        requested: points
      });
    }

    // Redeem points
    const source = canUse2X
      ? `Redeemed for ${redeemFor} (2X Value!)`
      : `Redeemed for ${redeemFor}`;

    req.user.redeemPoints(points, source);
    await req.user.save();

    res.json({
      message: canUse2X
        ? `Successfully redeemed ${points} Green Points with 2X value (worth ${effectiveValue} points)!`
        : `Successfully redeemed ${points} Green Points!`,
      pointsRedeemed: points,
      effectiveValue,
      multiplier,
      used2XValue: canUse2X,
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
/**
 * GET /api/points/2x-status
 * Get 2X value status and time remaining
 */
router.get('/2x-status', authenticateToken, async (req, res) => {
  try {
    const canUse2X = req.user.canUse2XValue();
    const timeRemaining = req.user.get2XTimeRemaining();

    res.json({
      canUse2X,
      timeRemaining,
      timeRemainingFormatted: formatTimeRemaining(timeRemaining)
    });
  } catch (error) {
    console.error('Get 2X status error:', error);
    res.status(500).json({
      message: 'Failed to get 2X status',
      error: error.message
    });
  }
});

/**
 * GET /api/points/badges
 * Get user badges
 */
router.get('/badges', authenticateToken, async (req, res) => {
  try {
    const badges = req.user.badges || [];
    const badgeDetails = badges.map(badge => ({
      name: badge,
      icon: getBadgeIcon(badge),
      description: getBadgeDescription(badge)
    }));

    res.json({
      badges: badgeDetails,
      totalBadges: badges.length
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({
      message: 'Failed to get badges',
      error: error.message
    });
  }
});

router.post('/calculate', authenticateToken, async (req, res) => {
  try {
    const { type, condition, quantity, weight } = req.body;

    const pointsData = {
      type,
      condition,
      quantity: parseInt(quantity),
      weight: weight ? parseFloat(weight) : 0,
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

// Helper functions
function formatTimeRemaining(milliseconds) {
  if (milliseconds <= 0) return 'Expired';

  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function getBadgeIcon(badge) {
  const icons = {
    'Welcome': '🎉',
    'Eco Hero': '🌟',
    'Bulk Recycler': '♻️',
    'Green Champion': '🏆',
    'Heavy Lifter': '💪',
    'Regular Recycler': '🔄'
  };
  return icons[badge] || '🏅';
}

function getBadgeDescription(badge) {
  const descriptions = {
    'Welcome': 'Welcome to Green Points!',
    'Eco Hero': 'Earned 500+ Green Points',
    'Bulk Recycler': 'Recycled 10+ items',
    'Green Champion': 'Earned 1000+ Green Points',
    'Heavy Lifter': 'Recycled 50+ kg of e-waste',
    'Regular Recycler': 'Regular recycling contributor'
  };
  return descriptions[badge] || 'Achievement unlocked!';
}

module.exports = router;
