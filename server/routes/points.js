const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const {
  calculateGreenPoints,
  getPointsBreakdown,
  validatePointsData
} = require('../utils/pointsCalculator');
const mlService = require('../services/mlService');

const router = express.Router();

/**
 * POST /api/points/submit
 * Submit e-waste and earn Green Points (AI-powered)
 */
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    // Support batch submission: if req.body.items is an array, process all
    if (Array.isArray(req.body.items)) {
      const items = req.body.items;
      let totalPoints = 0;
      let totalEstimatedPrice = 0;
      let itemResults = [];
      for (const item of items) {
        // Prepare data for ML prediction
        const itemData = {
          type: item.type,
          condition: item.condition,
          quantity: parseInt(item.quantity) || 1,
          weight: item.weight ? parseFloat(item.weight) : 0,
          brand: item.brand || 'Generic',
          age: item.age || 1,
          userFrequency: req.user.userFrequency,
          description: item.description,
          imageUrl: item.imageUrl
        };
        // Validate input data
        const pointsData = {
          type: item.type,
          condition: item.condition,
          quantity: parseInt(item.quantity) || 1,
          weight: item.weight ? parseFloat(item.weight) : 0,
          userFrequency: req.user.userFrequency
        };
        const validationErrors = validatePointsData(pointsData);
        if (validationErrors.length > 0) {
          return res.status(400).json({
            message: 'Validation failed',
            errors: validationErrors
          });
        }
        // Get AI prediction for points and price
        let prediction;
        try {
          prediction = await mlService.predictPoints(itemData);
        } catch (mlError) {
          prediction = await mlService.predictPoints(itemData);
        }
        const points = prediction.greenPoints;
        const estimatedPrice = prediction.estimatedPrice;
        totalPoints += points;
        totalEstimatedPrice += estimatedPrice;
        itemResults.push({
          ...itemData,
          points,
          estimatedPrice,
          breakdown: prediction.breakdown,
          confidence: prediction.confidence,
          predictionSource: prediction.source
        });
      }
      // Add total points to user's wallet as a single pickup
      const source = `Batch Pickup (${items.length} items)`;
      const metadata = {
        items: itemResults,
        totalPoints,
        totalEstimatedPrice,
        userFrequency: req.user.userFrequency
      };
      req.user.addPoints(totalPoints, source, metadata);
      await req.user.save();
      return res.json({
        message: `You've earned ${totalPoints} Green Points for ${items.length} items!`,
        points: totalPoints,
        estimatedPrice: totalEstimatedPrice,
        items: itemResults,
        newBalance: req.user.greenWallet.balance,
        userFrequency: req.user.userFrequency,
        transaction: {
          timestamp: new Date(),
          points: totalPoints,
          source,
          type: 'credit',
          metadata
        }
      });
    }

    const { type, condition, quantity, weight, description, imageUrl, brand, age } = req.body;

    // Prepare data for ML prediction
    const itemData = {
      type,
      condition,
      quantity: parseInt(quantity) || 1,
      weight: weight ? parseFloat(weight) : 0,
      brand: brand || 'Generic',
      age: age || 1,
      userFrequency: req.user.userFrequency,
      description,
      imageUrl
    };

    // Validate input data
    const pointsData = {
      type,
      condition,
      quantity: parseInt(quantity) || 1,
      weight: weight ? parseFloat(weight) : 0,
      userFrequency: req.user.userFrequency
    };

    const validationErrors = validatePointsData(pointsData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Get AI prediction for points and price
    let prediction;
    try {
      prediction = await mlService.predictPoints(itemData);
      console.log('✅ ML prediction successful:', prediction.source);
    } catch (mlError) {
      console.warn('⚠️ ML prediction failed, using fallback:', mlError.message);
      // Fallback is handled inside mlService
      prediction = await mlService.predictPoints(itemData);
    }

    const points = prediction.greenPoints;
    const estimatedPrice = prediction.estimatedPrice;

    // Add points to user's wallet
    const source = `Sold ${type}`;
    const metadata = {
      itemType: type,
      condition,
      quantity: parseInt(quantity) || 1,
      weight: weight ? parseFloat(weight) : 0,
      brand: brand || 'Generic',
      age: age || 1,
      userFrequency: req.user.userFrequency,
      description,
      imageUrl,
      estimatedPrice,
      mlPrediction: {
        source: prediction.source,
        confidence: prediction.confidence,
        modelVersion: prediction.modelVersion
      }
    };

    req.user.addPoints(points, source, metadata);
    await req.user.save();

    res.json({
      message: `You've earned ${points} Green Points!`,
      points,
      estimatedPrice,
      breakdown: prediction.breakdown,
      confidence: prediction.confidence,
      predictionSource: prediction.source,
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
    const { type, condition, quantity, weight, brand, age } = req.body;

    // Prepare data for ML prediction
    const itemData = {
      type,
      condition,
      quantity: parseInt(quantity) || 1,
      weight: weight ? parseFloat(weight) : 0,
      brand: brand || 'Generic',
      age: age || 1,
      userFrequency: req.user.userFrequency
    };

    // Validate input data
    const pointsData = {
      type,
      condition,
      quantity: parseInt(quantity) || 1,
      weight: weight ? parseFloat(weight) : 0,
      userFrequency: req.user.userFrequency
    };

    const validationErrors = validatePointsData(pointsData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Get AI prediction
    let prediction;
    try {
      prediction = await mlService.predictPoints(itemData);
    } catch (error) {
      console.warn('ML prediction failed, using fallback:', error.message);
      // Fallback is handled inside mlService
      prediction = await mlService.predictPoints(itemData);
    }

    res.json({
      estimatedPoints: prediction.greenPoints,
      estimatedPrice: prediction.estimatedPrice,
      breakdown: prediction.breakdown,
      confidence: prediction.confidence,
      predictionSource: prediction.source,
      userFrequency: req.user.userFrequency,
      metadata: prediction.metadata
    });

  } catch (error) {
    console.error('Points calculation error:', error);
    res.status(500).json({
      message: 'Failed to calculate points',
      error: error.message
    });
  }
});

/**
 * GET /api/points/ml-status
 * Get ML service health and model information
 */
router.get('/ml-status', authenticateToken, async (req, res) => {
  try {
    const health = await mlService.checkHealth();

    let modelInfo = null;
    if (health.status === 'healthy') {
      try {
        modelInfo = await mlService.getModelInfo();
      } catch (error) {
        console.warn('Failed to get model info:', error.message);
      }
    }

    res.json({
      mlService: health,
      modelInfo,
      fallbackEnabled: mlService.fallbackEnabled,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('ML status check error:', error);
    res.status(500).json({
      message: 'Failed to check ML service status',
      error: error.message
    });
  }
});

// GET /api/points/pickup-history
router.get('/pickup-history', authenticateToken, async (req, res) => {
  try {
    let history = req.user.greenWallet.history.filter(
      t => t.type === 'credit' && t.metadata && t.metadata.itemType
    );
    history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json({ history });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get pickup history', error: error.message });
  }
});

// GET /api/points/redemption-history
router.get('/redemption-history', authenticateToken, async (req, res) => {
  try {
    let history = req.user.greenWallet.history.filter(
      t => t.type === 'debit'
    );
    history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json({ history });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get redemption history', error: error.message });
  }
});

// GET /api/points/earned-history
router.get('/earned-history', authenticateToken, async (req, res) => {
  try {
    let history = req.user.greenWallet.history.filter(
      t => t.type === 'credit'
    );
    history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json({ history });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get earned history', error: error.message });
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
