import api from './authService';

export const pointsService = {
  // Submit e-waste and earn points (session-based)
  submitEWaste: async (ewasteData) => {
    // Always use direct fetch for consistency
    const payload = Array.isArray(ewasteData)
      ? { items: ewasteData }
      : { items: [ewasteData] };

    const response = await fetch('/api/points/submit-session', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Submit failed: ${response.status}`);
    }

    return await response.json();
  },

  // Redeem points
  redeemPoints: async (redeemData) => {
    const response = await api.post('/points/redeem', redeemData);
    return response.data;
  },

  // Get points balance
  getBalance: async () => {
    const response = await api.get('/points/balance');
    return response.data;
  },

  // Get transaction history
  getHistory: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/points/history?${queryParams}`);
    return response.data;
  },

  // Calculate points (preview) - session-based
  calculatePoints: async (ewasteData) => {
    const response = await fetch('/api/points/calculate-session', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ewasteData)
    });

    if (!response.ok) {
      throw new Error(`Calculate failed: ${response.status}`);
    }

    return await response.json();
  },

  // Get 2X value status
  get2XStatus: async () => {
    const response = await api.get('/points/2x-status');
    return response.data;
  },

  // Get user badges
  getBadges: async () => {
    const response = await api.get('/points/badges');
    return response.data;
  },

  // Add/fix history fetchers for TransactionHistory page
  getPickupHistory: async () => {
    const response = await api.get('/points/pickup-history');
    return response.data;
  },
  getRedemptionHistory: async () => {
    const response = await api.get('/points/redemption-history');
    return response.data;
  },
  getEarnedHistory: async () => {
    const response = await api.get('/points/earned-history');
    return response.data;
  },
};

export const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  },

  // Get dashboard data (session-based)
  getDashboard: async () => {
    const response = await fetch('/api/user/dashboard-session', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Dashboard failed: ${response.status}`);
    }

    return await response.json();
  },

  // Get user statistics
  getStats: async () => {
    const response = await api.get('/user/stats');
    return response.data;
  },
};
