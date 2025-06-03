import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/pointsService';
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

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await userService.getDashboard();
      setDashboardData(data);
      await refreshUser(); // Update user data in context
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  const wallet = dashboardData?.wallet || {};
  const stats = dashboardData?.statistics || {};
  const recentTransactions = dashboardData?.recentTransactions || [];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-green-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {user?.name}! 🌱
        </h1>
        <p className="text-primary-100">
          You're making a positive impact on the environment. Keep up the great work!
        </p>
      </div>

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
              <p className="text-2xl font-bold text-gray-900">{stats.totalItemsSubmitted || 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions || 0}</p>
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
                      transaction.type === 'credit' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.source}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : ''}{transaction.points} points
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
