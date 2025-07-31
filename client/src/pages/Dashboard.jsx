import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // Removed auth
// Removed userService import - using direct fetch
import { 
  Coins, 
  Upload, 
  Gift, 
  TrendingUp, 
  Award, 
  Calendar,
  ArrowRight,
  Recycle
} from 'lucide-react';
import toast from 'react-hot-toast';
import TwoXValueBanner from '../components/TwoXValueBanner';
import BadgesDisplay from '../components/BadgesDisplay';

const Dashboard = () => {
  const [user, setUser] = useState({
    name: 'Demo User',
    email: 'demo@greenpoints.com',
    points: 0,
    badges: ['eco-warrior', 'recycling-champion']
  });

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // Set up real-time updates every 5 seconds for better responsiveness
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Also refresh when the page becomes visible (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchDashboardData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching dashboard data...');

      // Use direct fetch to ensure session persistence
      const response = await fetch('/api/user/dashboard-session', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Dashboard data received:', data);
      console.log('📊 Points:', data.totalPoints);
      console.log('📊 Submissions:', data.totalSubmissions);
      console.log('📊 Badges:', data.badges);
      console.log('📊 Transactions:', data.recentTransactions?.length || 0);

      setDashboardData(data);

      // Update user points from dashboard data
      setUser(prev => ({
        ...prev,
        points: data.totalPoints || 0,
        badges: data.badges || []
      }));

      console.log('✅ Dashboard state updated with real data');
      console.log('📊 Dashboard state:', {
        totalPoints: data.totalPoints,
        totalSubmissions: data.totalSubmissions,
        badges: data.badges?.length || 0,
        transactions: data.recentTransactions?.length || 0
      });

    } catch (error) {
      console.error('❌ Failed to fetch dashboard data:', error);
      // Use fallback only as last resort
      console.error('❌ Dashboard fetch failed:', error);
      const fallbackData = {
        user: { name: 'Session User', badges: [] },
        totalPoints: 0,
        totalSubmissions: 0,
        totalRedemptions: 0,
        recentTransactions: [],
        monthlyStats: { submissions: 0, points: 0 },
        badges: []
      };
      setDashboardData(fallbackData);
      setUser(prev => ({ ...prev, points: 0, badges: [] }));
      console.log('🔄 Using fallback data as last resort');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Unable to load dashboard data</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Map API response to expected format
  const wallet = {
    balance: dashboardData?.totalPoints || 0,
    totalEarned: dashboardData?.totalPoints || 0,
    totalRedeemed: dashboardData?.totalRedemptions || 0,
    thisMonthEarned: dashboardData?.monthlyStats?.points || 0
  };
  const stats = {
    totalSubmissions: dashboardData?.totalSubmissions || 0,
    thisMonthSubmissions: dashboardData?.monthlyStats?.submissions || 0
  };
  const recentTransactions = dashboardData?.recentTransactions || [];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-green-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {user?.name}! 🌱
            </h1>
            <p className="text-primary-100">
              You're making a positive impact on the environment. Keep up the great work!
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* 2X Value Banner */}
      <TwoXValueBanner />

      {/* Green Points Balance - Main Feature */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Green Points Balance</h2>
            <div className="flex items-center space-x-2">
              <Coins className="h-8 w-8 text-primary-600" />
              <span className="text-4xl font-bold text-primary-600">
                {wallet.balance || 0}
              </span>
              <span className="text-lg text-gray-600">Green Points</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Total earned: {wallet.totalEarned || 0} • Total redeemed: {wallet.totalRedeemed || 0}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-primary-50 rounded-lg p-4">
              <Award className="h-12 w-12 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-primary-700">
                {user?.userFrequency || 'First-time'} User
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/submit"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200 hover:border-primary-300"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 rounded-lg p-3">
              <Upload className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Submit E-Waste</h3>
              <p className="text-gray-600">Upload your electronic waste and earn points</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
        </Link>

        <Link
          to="/redeem"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200 hover:border-primary-300"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 rounded-lg p-3">
              <Gift className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Redeem Points</h3>
              <p className="text-gray-600">Use your points for eco-friendly rewards</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-lg p-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month Earned</p>
              <p className="text-2xl font-bold text-gray-900">{wallet.thisMonthEarned || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 rounded-lg p-3">
              <Recycle className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Items Submitted</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSubmissions || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 rounded-lg p-3">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{recentTransactions.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <Link
              to="/history"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'earned'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'earned' ? '+' : '-'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'earned' ? '+' : ''}{transaction.amount} points
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Coins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No transactions yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Start by submitting your first e-waste item!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <BadgesDisplay limit={4} />
      </div>

      {/* Items Submitted Breakdown */}
      {stats.itemsSubmittedByType && Object.keys(stats.itemsSubmittedByType).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Submitted by Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.itemsSubmittedByType).map(([type, count]) => (
              <div key={type} className="text-center">
                <div className="bg-gray-100 rounded-lg p-3 mb-2">
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
                <p className="text-sm text-gray-600">{type}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
