import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { pointsService } from '../services/pointsService';
import { Gift, Coins, ShoppingCart, Leaf, Coffee, Shirt, Home, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import TwoXValueBanner from '../components/TwoXValueBanner';

const RedeemPoints = () => {
  const [loading, setLoading] = useState(false);
  const [twoXStatus, setTwoXStatus] = useState(null);
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    fetchTwoXStatus();
  }, []);

  const fetchTwoXStatus = async () => {
    try {
      const response = await pointsService.get2XStatus();
      setTwoXStatus(response);
    } catch (error) {
      console.error('Failed to fetch 2X status:', error);
    }
  };

  const rewardCategories = [
    {
      id: 'eco-products',
      name: 'Eco-Friendly Products',
      icon: Leaf,
      color: 'green',
      rewards: [
        { id: 1, name: 'Bamboo Water Bottle', points: 150, description: 'Sustainable bamboo water bottle', image: '🌿' },
        { id: 2, name: 'Organic Cotton Tote Bag', points: 100, description: 'Reusable organic cotton bag', image: '👜' },
        { id: 3, name: 'Solar Power Bank', points: 650, description: '10,000mAh solar power bank', image: '🔋' },
        { id: 4, name: 'Premium Eco Phone Case', points: 520, description: 'Premium biodegradable phone case', image: '📱' },
        { id: 15, name: 'Eco-Friendly Laptop Stand', points: 600, description: 'Sustainable bamboo laptop stand', image: '💻' },
      ]
    },
    {
      id: 'discounts',
      name: 'Store Discounts',
      icon: ShoppingCart,
      color: 'blue',
      rewards: [
        { id: 5, name: '10% Off Electronics Store', points: 50, description: 'Discount at partner electronics stores', image: '🏪' },
        { id: 6, name: '15% Off Green Products', points: 75, description: 'Discount on eco-friendly products', image: '🌱' },
        { id: 7, name: '20% Off Repair Services', points: 100, description: 'Discount on device repair services', image: '🔧' },
        { id: 8, name: '$100 Premium Gift Card', points: 800, description: 'Premium gift card for sustainable brands', image: '🎁' },
        { id: 16, name: '$50 Electronics Voucher', points: 550, description: 'Voucher for eco-friendly electronics', image: '🎫' },
      ]
    },
    {
      id: 'energy',
      name: 'Energy & Utilities',
      icon: Zap,
      color: 'yellow',
      rewards: [
        { id: 9, name: 'Energy Audit Discount', points: 200, description: 'Free home energy audit', image: '⚡' },
        { id: 10, name: 'LED Bulb Set', points: 80, description: 'Set of 6 energy-efficient LED bulbs', image: '💡' },
        { id: 11, name: 'Premium Smart Thermostat', points: 750, description: 'Complete smart thermostat system', image: '🌡️' },
      ]
    },
    {
      id: 'home',
      name: 'Home & Garden',
      icon: Home,
      color: 'purple',
      rewards: [
        { id: 12, name: 'Compost Bin', points: 180, description: 'Small home composting bin', image: '🗂️' },
        { id: 13, name: 'Seed Starter Kit', points: 60, description: 'Organic vegetable seed kit', image: '🌱' },
        { id: 14, name: 'Premium Rain Water System', points: 900, description: 'Complete eco-friendly rain water collection system', image: '🌧️' },
      ]
    }
  ];

  const handleRedeem = async (reward) => {
    if (!user || user.greenPoints < reward.points) {
      toast.error('Insufficient Green Points');
      return;
    }

    setLoading(true);
    try {
      const response = await pointsService.redeemPoints({
        points: reward.points,
        redeemFor: reward.name,
        description: reward.description
      });

      await refreshUser(); // Update user data
      toast.success(response.message);
      
    } catch (error) {
      console.error('Failed to redeem points:', error);
      const message = error.response?.data?.message || 'Failed to redeem points';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-800 border-green-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[color] || colors.green;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Redeem Green Points</h1>
            <p className="text-gray-600">
              Use your Green Points to get eco-friendly products and sustainable discounts.
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-1">
              <Coins className="h-6 w-6 text-primary-600" />
              <span className="text-2xl font-bold text-primary-600">
                {user?.greenPoints || 0}
              </span>
            </div>
            <p className="text-sm text-gray-500">Available Points</p>
          </div>
        </div>
      </div>

      {/* 2X Value Banner */}
      <TwoXValueBanner />

      {/* Reward Categories */}
      {rewardCategories.map((category) => {
        const Icon = category.icon;
        return (
          <div key={category.id} className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getColorClasses(category.color)}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.rewards.map((reward) => {
                  const canAfford = user?.greenPoints >= reward.points;
                  const canAffordWith2X = twoXStatus?.canUse2X && user?.greenPoints >= Math.ceil(reward.points / 2);
                  const showAs2XOption = !canAfford && canAffordWith2X;

                  return (
                    <div
                      key={reward.id}
                      className={`border rounded-lg p-4 transition-all ${
                        canAfford || showAs2XOption
                          ? 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                          : 'border-gray-100 bg-gray-50'
                      } ${showAs2XOption ? 'ring-2 ring-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50' : ''}`}
                    >
                      {showAs2XOption && (
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-md mb-2 text-center">
                          ⚡ 2X Value Available
                        </div>
                      )}

                      <div className="text-center mb-4">
                        <div className="text-4xl mb-2">{reward.image}</div>
                        <h3 className={`font-semibold ${canAfford || showAs2XOption ? 'text-gray-900' : 'text-gray-500'}`}>
                          {reward.name}
                        </h3>
                        <p className={`text-sm mt-1 ${canAfford || showAs2XOption ? 'text-gray-600' : 'text-gray-400'}`}>
                          {reward.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          <Coins className={`h-4 w-4 ${canAfford || showAs2XOption ? 'text-primary-600' : 'text-gray-400'}`} />
                          {showAs2XOption ? (
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500 line-through">{reward.points}</span>
                              <span className="font-semibold text-blue-600">
                                {Math.ceil(reward.points / 2)} (2X Value!)
                              </span>
                            </div>
                          ) : (
                            <span className={`font-semibold ${canAfford ? 'text-primary-600' : 'text-gray-400'}`}>
                              {reward.points}
                            </span>
                          )}
                        </div>
                        {!canAfford && !showAs2XOption && (
                          <span className="text-xs text-red-500 font-medium">
                            Need {reward.points - (user?.greenPoints || 0)} more
                          </span>
                        )}
                        {showAs2XOption && (
                          <span className="text-xs text-blue-600 font-medium">
                            ⚡ 2X Value Active!
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleRedeem(reward)}
                        disabled={(!canAfford && !showAs2XOption) || loading}
                        className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                          canAfford
                            ? 'bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50'
                            : showAs2XOption
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="loading-spinner mr-2"></div>
                            Redeeming...
                          </div>
                        ) : canAfford ? (
                          <>
                            <Gift className="h-4 w-4 inline mr-1" />
                            Redeem
                          </>
                        ) : showAs2XOption ? (
                          <>
                            <Zap className="h-4 w-4 inline mr-1" />
                            Redeem with 2X Value
                          </>
                        ) : (
                          'Insufficient Points'
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      {/* Verification Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-amber-900 mb-4">⚠️ Points Verification Required</h3>
        <div className="space-y-3 text-sm text-amber-800">
          <p className="leading-relaxed">
            <strong>Important:</strong> Only <strong>verified Green Points</strong> can be used for redemption.
            Points are verified after our certified team physically inspects your submitted e-waste items.
          </p>
          <p className="leading-relaxed">
            If you have recently submitted e-waste, please wait for verification to complete before your
            points become available for redemption. You will receive a notification once verification is done.
          </p>
          <div className="bg-amber-100 rounded-md p-3 mt-3">
            <p className="font-medium text-amber-900">
              💡 Verification typically takes 2-3 business days after item collection.
            </p>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-primary-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">How Redemption Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
            <div>
              <p className="font-medium text-primary-900">Choose Reward</p>
              <p className="text-primary-700">Select from our eco-friendly rewards catalog</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
            <div>
              <p className="font-medium text-primary-900">Redeem Verified Points</p>
              <p className="text-primary-700">Only verified points are deducted from your balance</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
            <div>
              <p className="font-medium text-primary-900">Receive Reward</p>
              <p className="text-primary-700">Get your discount code or product delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedeemPoints;
