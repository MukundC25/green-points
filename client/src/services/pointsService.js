import api from './authService';

export const pointsService = {
  // Submit e-waste and earn points
  submitEWaste: async (ewasteData) => {
    const response = await api.post('/points/submit', ewasteData);
    return response.data;
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

  // Calculate points (preview)
  calculatePoints: async (ewasteData) => {
    const response = await api.post('/points/calculate', ewasteData);
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

  // Get dashboard data
  getDashboard: async () => {
    const response = await api.get('/user/dashboard');
    return response.data;
  },

  // Get user statistics
  getStats: async () => {
    const response = await api.get('/user/stats');
    return response.data;
  },
};
