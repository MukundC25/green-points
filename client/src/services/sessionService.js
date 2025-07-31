import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create dedicated session API instance
const sessionApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true, // Essential for session persistence
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request logging
sessionApi.interceptors.request.use(
  (config) => {
    console.log('🔄 Session API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Session API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response logging
sessionApi.interceptors.response.use(
  (response) => {
    console.log('✅ Session API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Session API Response Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const sessionService = {
  // Initialize session (call this on app start)
  initSession: async () => {
    try {
      const response = await sessionApi.get('/user/dashboard-session');
      console.log('✅ Session initialized:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Session initialization failed:', error);
      throw error;
    }
  },

  // Get dashboard data
  getDashboard: async () => {
    const response = await sessionApi.get('/user/dashboard-session');
    return response.data;
  },

  // Calculate points
  calculatePoints: async (ewasteData) => {
    const response = await sessionApi.post('/points/calculate-session', ewasteData);
    return response.data;
  },

  // Submit e-waste
  submitEWaste: async (ewasteData) => {
    // Always send as items array
    const payload = Array.isArray(ewasteData) 
      ? { items: ewasteData }
      : { items: [ewasteData] };
    
    const response = await sessionApi.post('/points/submit-session', payload);
    return response.data;
  },

  // Get transaction history
  getTransactionHistory: async () => {
    try {
      // First get dashboard data which includes recent transactions
      const dashboard = await sessionApi.get('/user/dashboard-session');
      return {
        pickupHistory: dashboard.data.recentTransactions.filter(t => t.type === 'earned'),
        redemptionHistory: dashboard.data.recentTransactions.filter(t => t.type === 'redeemed'),
        earnedHistory: dashboard.data.recentTransactions.filter(t => t.type === 'earned')
      };
    } catch (error) {
      console.error('❌ Failed to get transaction history:', error);
      return {
        pickupHistory: [],
        redemptionHistory: [],
        earnedHistory: []
      };
    }
  },

  // Get badges
  getBadges: async () => {
    try {
      const dashboard = await sessionApi.get('/user/dashboard-session');
      return dashboard.data.badges || [];
    } catch (error) {
      console.error('❌ Failed to get badges:', error);
      return [];
    }
  }
};

export default sessionApi;
