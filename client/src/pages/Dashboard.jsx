import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Coins, Upload, TrendingUp, Award, Calendar, ArrowRight, Recycle } from 'lucide-react';
import { usePoints } from '../context/PointsContext';

const Dashboard = () => {
  const { userStats } = usePoints();

  const [user] = useState({
    name: 'Demo User',
    email: 'demo@greenpoints.com',
    badges: ['eco-warrior', 'recycling-champion']
  });

  // Use real-time points data from context
  const wallet = {
    balance: userStats.totalPoints,
    totalEarned: userStats.totalPoints,
    totalRedeemed: 0,
    thisMonthEarned: userStats.thisMonthPoints
  };

  const stats = {
    totalSubmissions: userStats.totalSubmissions,
    thisMonthSubmissions: userStats.thisMonthSubmissions
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {user?.name}! 🌱
            </h1>
            <p className="text-green-100">
              You're making a positive impact on the environment. Keep up the great work!
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Green Points Balance</h2>
            <div className="flex items-center space-x-2">
              <Coins className="h-8 w-8 text-green-600" />
              <span className="text-4xl font-bold text-green-600">
                {wallet.balance || 0}
              </span>
              <span className="text-lg text-gray-600">Green Points</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Total earned: {wallet.totalEarned} • This month: {wallet.thisMonthEarned}
            </p>
          </div>
          <div className="text-right">
            <Link
              to="/submit"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Submit E-Waste
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Recycle className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Submissions</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalSubmissions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.thisMonthSubmissions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Environmental Impact</p>
              <p className="text-2xl font-semibold text-gray-900">High</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/submit"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Submit E-Waste</p>
              <p className="text-sm text-gray-500">Get points for your electronic devices</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
          </Link>

          <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
            <TrendingUp className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">View Analytics</p>
              <p className="text-sm text-gray-500">Track your environmental impact</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
