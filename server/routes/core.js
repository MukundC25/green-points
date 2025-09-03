const express = require('express');
const router = express.Router();

// Import models
const User = require('../models/User');
const EWasteSubmission = require('../models/EWasteSubmission');
const RedemptionRequest = require('../models/RedemptionRequest');

// Import services
const mlService = require('../services/mlService');

// User routes
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// E-waste submission routes
router.post('/ewaste/submit', async (req, res) => {
  try {
    const { deviceType, brand, model, condition, weight, userId } = req.body;
    
    // Get ML prediction
    const mlPrediction = await mlService.predictPrice({
      device_type: deviceType,
      brand,
      model,
      condition,
      weight: parseFloat(weight)
    });

    const submission = new EWasteSubmission({
      userId,
      deviceType,
      brand,
      model,
      condition,
      weight: parseFloat(weight),
      estimatedPrice: mlPrediction.estimated_price,
      pointsEarned: Math.floor(mlPrediction.estimated_price * 10), // 10 points per dollar
      status: 'pending'
    });

    await submission.save();

    // Update user points
    await User.findByIdAndUpdate(userId, {
      $inc: { totalPoints: submission.pointsEarned }
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/ewaste/submissions/:userId', async (req, res) => {
  try {
    const submissions = await EWasteSubmission.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ML prediction route
router.post('/ml/predict', async (req, res) => {
  try {
    const prediction = await mlService.predictPrice(req.body);
    res.json(prediction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Redemption routes
router.post('/redemptions', async (req, res) => {
  try {
    const { userId, itemName, pointsCost } = req.body;
    
    const user = await User.findById(userId);
    if (!user || user.totalPoints < pointsCost) {
      return res.status(400).json({ error: 'Insufficient points' });
    }

    const redemption = new RedemptionRequest({
      userId,
      itemName,
      pointsCost,
      status: 'pending'
    });

    await redemption.save();

    // Deduct points from user
    await User.findByIdAndUpdate(userId, {
      $inc: { totalPoints: -pointsCost }
    });

    res.status(201).json(redemption);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/redemptions/:userId', async (req, res) => {
  try {
    const redemptions = await RedemptionRequest.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(redemptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard stats
router.get('/dashboard/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const submissions = await EWasteSubmission.find({ userId: req.params.userId });
    const redemptions = await RedemptionRequest.find({ userId: req.params.userId });

    const stats = {
      totalPoints: user?.totalPoints || 0,
      totalSubmissions: submissions.length,
      totalRedemptions: redemptions.length,
      totalEarned: submissions.reduce((sum, sub) => sum + sub.pointsEarned, 0),
      totalSpent: redemptions.reduce((sum, red) => sum + red.pointsCost, 0)
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
