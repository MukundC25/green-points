/**
 * Green Points Calculator
 * Based on the design document by Mukund Chavan
 * Calculates points based on e-waste type, condition, quantity, and user frequency
 */

function calculateGreenPoints(data) {
  let points = 0;

  // Base points by item type
  if (data.type === 'Smartphone') {
    points += 50;
  } else if (data.type === 'Battery') {
    points += 30;
  } else if (data.type === 'Laptop') {
    points += 80;
  } else if (data.type === 'Tablet') {
    points += 40;
  } else if (data.type === 'Charger') {
    points += 15;
  } else if (data.type === 'Headphones') {
    points += 20;
  } else if (data.type === 'Monitor') {
    points += 60;
  } else if (data.type === 'Keyboard') {
    points += 10;
  } else if (data.type === 'Mouse') {
    points += 8;
  } else if (data.type === 'Cable') {
    points += 5;
  } else {
    // Default for other electronics
    points += 10;
  }

  // Condition bonus
  if (data.condition === 'Working') {
    points += 30;
  } else if (data.condition === 'Repairable') {
    points += 15;
  }
  // No bonus for 'Dead' condition

  // Quantity multiplier
  points += data.quantity * 5;

  // User frequency bonus
  if (data.userFrequency === 'Regular') {
    points += 20;
  } else if (data.userFrequency === 'Occasional') {
    points += 10;
  }
  // No bonus for 'First-time' users

  return Math.max(points, 5); // Minimum 5 points for any submission
}

/**
 * Calculate bonus points for special conditions
 */
function calculateBonusPoints(data) {
  let bonusPoints = 0;

  // Bulk submission bonus (5+ items)
  if (data.quantity >= 5) {
    bonusPoints += 25;
  }

  // Rare item bonus
  const rareItems = ['Smartphone', 'Laptop', 'Tablet', 'Monitor'];
  if (rareItems.includes(data.type)) {
    bonusPoints += 10;
  }

  // Perfect condition bonus
  if (data.condition === 'Working' && data.quantity >= 3) {
    bonusPoints += 15;
  }

  return bonusPoints;
}

/**
 * Get point breakdown for transparency
 */
function getPointsBreakdown(data) {
  const breakdown = {
    basePoints: 0,
    conditionBonus: 0,
    quantityBonus: 0,
    frequencyBonus: 0,
    bonusPoints: 0,
    total: 0
  };

  // Base points
  if (data.type === 'Smartphone') breakdown.basePoints = 50;
  else if (data.type === 'Battery') breakdown.basePoints = 30;
  else if (data.type === 'Laptop') breakdown.basePoints = 80;
  else if (data.type === 'Tablet') breakdown.basePoints = 40;
  else if (data.type === 'Charger') breakdown.basePoints = 15;
  else if (data.type === 'Headphones') breakdown.basePoints = 20;
  else if (data.type === 'Monitor') breakdown.basePoints = 60;
  else if (data.type === 'Keyboard') breakdown.basePoints = 10;
  else if (data.type === 'Mouse') breakdown.basePoints = 8;
  else if (data.type === 'Cable') breakdown.basePoints = 5;
  else breakdown.basePoints = 10;

  // Condition bonus
  if (data.condition === 'Working') breakdown.conditionBonus = 30;
  else if (data.condition === 'Repairable') breakdown.conditionBonus = 15;

  // Quantity bonus
  breakdown.quantityBonus = data.quantity * 5;

  // Frequency bonus
  if (data.userFrequency === 'Regular') breakdown.frequencyBonus = 20;
  else if (data.userFrequency === 'Occasional') breakdown.frequencyBonus = 10;

  // Bonus points
  breakdown.bonusPoints = calculateBonusPoints(data);

  // Total
  breakdown.total = Math.max(
    breakdown.basePoints + 
    breakdown.conditionBonus + 
    breakdown.quantityBonus + 
    breakdown.frequencyBonus + 
    breakdown.bonusPoints, 
    5
  );

  return breakdown;
}

/**
 * Validate input data
 */
function validatePointsData(data) {
  const errors = [];

  if (!data.type) {
    errors.push('Item type is required');
  }

  if (!data.condition) {
    errors.push('Item condition is required');
  }

  if (!data.quantity || data.quantity < 1) {
    errors.push('Quantity must be at least 1');
  }

  if (!data.userFrequency) {
    errors.push('User frequency is required');
  }

  const validTypes = [
    'Smartphone', 'Battery', 'Laptop', 'Tablet', 'Charger', 
    'Headphones', 'Monitor', 'Keyboard', 'Mouse', 'Cable', 'Other'
  ];
  
  if (data.type && !validTypes.includes(data.type)) {
    errors.push('Invalid item type');
  }

  const validConditions = ['Working', 'Repairable', 'Dead'];
  if (data.condition && !validConditions.includes(data.condition)) {
    errors.push('Invalid item condition');
  }

  const validFrequencies = ['First-time', 'Occasional', 'Regular'];
  if (data.userFrequency && !validFrequencies.includes(data.userFrequency)) {
    errors.push('Invalid user frequency');
  }

  return errors;
}

module.exports = {
  calculateGreenPoints,
  calculateBonusPoints,
  getPointsBreakdown,
  validatePointsData
};
