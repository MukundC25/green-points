const axios = require('axios');

/**
 * ML Service for AI-powered e-waste pricing and green points prediction
 */
class MLService {
  constructor() {
    this.mlApiUrl = process.env.ML_API_URL || 'http://localhost:8000';
    this.timeout = 10000; // 10 seconds timeout
    this.retryAttempts = 3;
    this.fallbackEnabled = true;
  }

  /**
   * Predict price and green points using ML model
   * @param {Object} itemData - E-waste item data
   * @returns {Promise<Object>} Prediction result
   */
  async predictPoints(itemData) {
    try {
      // Prepare request data (includes mapping)
      const requestData = this.prepareRequestData(itemData);

      // Validate prepared data
      this.validatePreparedData(requestData);

      // Make prediction request with retry logic
      const prediction = await this.makeRequestWithRetry(requestData);

      // Process and return result
      return this.processMLResponse(prediction, itemData);

    } catch (error) {
      console.warn('ML service error:', error.message);

      if (this.fallbackEnabled) {
        console.log('🔄 Falling back to hardcoded calculation...');
        return this.fallbackCalculation(itemData);
      } else {
        throw error;
      }
    }
  }

  /**
   * Validate prepared data for ML prediction
   * @param {Object} requestData - Prepared request data to validate
   */
  validatePreparedData(requestData) {
    const required = ['product_type', 'condition', 'weight'];
    const missing = required.filter(field => !requestData[field]);

    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    // Validate condition values (after mapping)
    const validConditions = ['Working', 'Repairable', 'Dead'];
    if (!validConditions.includes(requestData.condition)) {
      throw new Error(`Invalid condition. Must be one of: ${validConditions.join(', ')}`);
    }

    // Validate weight
    if (requestData.weight <= 0 || requestData.weight > 50) {
      throw new Error('Weight must be between 0.01 and 50 kg');
    }
  }

  /**
   * Prepare request data for ML API
   * @param {Object} itemData - Raw item data
   * @returns {Object} Formatted request data
   */
  prepareRequestData(itemData) {
    return {
      product_type: this.mapProductType(itemData.type),
      brand: itemData.brand || 'Generic',
      condition: this.mapCondition(itemData.condition),
      age: this.calculateAge(itemData.age),
      weight: parseFloat(itemData.weight)
    };
  }

  /**
   * Map frontend product types to ML model types
   * @param {string} frontendType - Product type from frontend
   * @returns {string} ML model product type
   */
  mapProductType(frontendType) {
    const typeMapping = {
      'smartphone': 'Smartphone',
      'laptop': 'Laptop',
      'tablet': 'Tablet',
      'monitor': 'Monitor',
      'headphones': 'Headphones',
      'charger': 'Charger',
      'battery': 'Battery',
      'keyboard': 'Keyboard',
      'mouse': 'Mouse',
      'speaker': 'Speaker',
      'other': 'Speaker' // Default mapping
    };

    return typeMapping[frontendType.toLowerCase()] || 'Speaker';
  }

  /**
   * Map frontend condition to ML model condition
   * @param {string} frontendCondition - Condition from frontend
   * @returns {string} ML model condition
   */
  mapCondition(frontendCondition) {
    const conditionMapping = {
      'excellent': 'Working',
      'good': 'Working',
      'fair': 'Repairable',
      'poor': 'Repairable',
      'working': 'Working',
      'repairable': 'Repairable',
      'broken': 'Dead',
      'dead': 'Dead',
      'not working': 'Dead'
    };

    return conditionMapping[frontendCondition.toLowerCase()] || 'Working';
  }

  /**
   * Calculate age from various input formats
   * @param {*} ageInput - Age input (years, months, or date)
   * @returns {number} Age in years
   */
  calculateAge(ageInput) {
    if (!ageInput) return 1; // Default 1 year

    if (typeof ageInput === 'number') {
      return Math.max(0.1, ageInput);
    }

    if (typeof ageInput === 'string') {
      // Try to parse as number
      const parsed = parseFloat(ageInput);
      if (!isNaN(parsed)) {
        return Math.max(0.1, parsed);
      }

      // Try to parse as date
      const date = new Date(ageInput);
      if (!isNaN(date.getTime())) {
        const ageYears = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 365);
        return Math.max(0.1, ageYears);
      }
    }

    return 1; // Default fallback
  }

  /**
   * Make HTTP request with retry logic
   * @param {Object} requestData - Request payload
   * @returns {Promise<Object>} API response
   */
  async makeRequestWithRetry(requestData) {
    let lastError;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        console.log(`🔄 ML API request attempt ${attempt}/${this.retryAttempts}`);
        
        const response = await axios.post(`${this.mlApiUrl}/predict`, requestData, {
          timeout: this.timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('✅ ML API request successful');
        return response.data;

      } catch (error) {
        lastError = error;
        console.warn(`❌ ML API attempt ${attempt} failed:`, error.message);

        if (attempt < this.retryAttempts) {
          // Wait before retry (exponential backoff)
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(`ML API failed after ${this.retryAttempts} attempts: ${lastError.message}`);
  }

  /**
   * Process ML API response
   * @param {Object} mlResponse - Response from ML API
   * @param {Object} originalData - Original item data
   * @returns {Object} Processed prediction result
   */
  processMLResponse(mlResponse, originalData) {
    return {
      estimatedPrice: mlResponse.predicted_price || mlResponse.estimated_price,
      greenPoints: mlResponse.green_points,
      confidence: mlResponse.confidence,
      breakdown: {
        basePoints: mlResponse.breakdown?.base_points || 0,
        conditionBonus: mlResponse.breakdown?.condition_bonus || 0,
        weightBonus: mlResponse.breakdown?.weight_bonus || 0,
        brandBonus: mlResponse.breakdown?.brand_bonus || 0,
        environmentalBonus: mlResponse.breakdown?.environmental_bonus || 0,
        total: mlResponse.green_points
      },
      source: 'ml_model',
      modelVersion: mlResponse.model_version || '1.0.0',
      metadata: {
        originalInput: originalData,
        predictionTime: new Date().toISOString(),
        confidenceLevel: mlResponse.breakdown?.confidence_level || 'Medium'
      }
    };
  }

  /**
   * Fallback calculation using existing hardcoded logic
   * @param {Object} itemData - Item data
   * @returns {Object} Fallback calculation result
   */
  fallbackCalculation(itemData) {
    try {
      // Import existing points calculator
      const { calculateGreenPoints, getPointsBreakdown } = require('../utils/pointsCalculator');

      // Convert data format for existing calculator
      const pointsData = {
        type: itemData.type,
        condition: itemData.condition,
        quantity: itemData.quantity || 1,
        weight: itemData.weight || 0,
        userFrequency: 'Regular' // Default for fallback
      };

      const points = calculateGreenPoints(pointsData);
      const breakdown = getPointsBreakdown(pointsData);

      // Estimate price based on points (rough conversion)
      const estimatedPrice = Math.round(points * 8); // ₹8 per point approximation

      return {
        estimatedPrice,
        greenPoints: points,
        confidence: 0.6, // Lower confidence for fallback
        breakdown: {
          basePoints: breakdown.basePoints || 0,
          conditionBonus: breakdown.conditionBonus || 0,
          weightBonus: breakdown.weightBonus || 0,
          quantityBonus: breakdown.quantityBonus || 0,
          frequencyBonus: breakdown.frequencyBonus || 0,
          total: points
        },
        source: 'fallback_hardcoded',
        modelVersion: 'fallback',
        metadata: {
          originalInput: itemData,
          predictionTime: new Date().toISOString(),
          confidenceLevel: 'Low',
          fallbackReason: 'ML service unavailable'
        }
      };

    } catch (fallbackError) {
      console.error('Fallback calculation failed:', fallbackError);
      
      // Ultimate fallback - basic calculation
      return this.basicFallback(itemData);
    }
  }

  /**
   * Basic fallback calculation when everything else fails
   * @param {Object} itemData - Item data
   * @returns {Object} Basic calculation result
   */
  basicFallback(itemData) {
    // Very basic point calculation
    const basePoints = {
      'smartphone': 50, 'laptop': 80, 'tablet': 40,
      'monitor': 60, 'headphones': 20, 'charger': 15,
      'battery': 30, 'keyboard': 25, 'mouse': 15, 'speaker': 30
    };

    const points = (basePoints[itemData.type?.toLowerCase()] || 20) + 
                   (itemData.weight ? Math.round(itemData.weight * 2) : 0);

    return {
      estimatedPrice: points * 5, // Very rough estimate
      greenPoints: points,
      confidence: 0.3,
      breakdown: { total: points },
      source: 'basic_fallback',
      modelVersion: 'basic',
      metadata: {
        originalInput: itemData,
        predictionTime: new Date().toISOString(),
        confidenceLevel: 'Very Low',
        fallbackReason: 'All calculation methods failed'
      }
    };
  }

  /**
   * Check ML service health
   * @returns {Promise<Object>} Health status
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${this.mlApiUrl}/health`, {
        timeout: 5000
      });
      
      return {
        status: 'healthy',
        mlService: response.data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get ML model information
   * @returns {Promise<Object>} Model info
   */
  async getModelInfo() {
    try {
      const response = await axios.get(`${this.mlApiUrl}/model/info`, {
        timeout: 5000
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get model info: ${error.message}`);
    }
  }

  /**
   * Enable or disable fallback mode
   * @param {boolean} enabled - Whether fallback is enabled
   */
  setFallbackEnabled(enabled) {
    this.fallbackEnabled = enabled;
    console.log(`🔧 Fallback mode ${enabled ? 'enabled' : 'disabled'}`);
  }
}

module.exports = new MLService();
