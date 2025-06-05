import React, { useState, useEffect } from 'react';
import { pointsService } from '../services/pointsService';
import { useAuth } from '../context/AuthContext';
import { Award } from 'lucide-react';

const BadgesDisplay = ({ showTitle = true, limit = null }) => {
  const [badges, setBadges] = useState([]);
  const [availableBadges, setAvailableBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchBadges();
    generateAvailableBadges();
  }, [user]);

  const fetchBadges = async () => {
    try {
      const response = await pointsService.getBadges();
      setBadges(response.badges);
    } catch (error) {
      console.error('Failed to fetch badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAvailableBadges = () => {
    if (!user) return;

    const totalEarned = user.greenWallet?.totalEarned || 0;
    const totalItems = user.totalItemsRecycled || 0;
    const totalWeight = user.totalWeightRecycled || 0;
    const userFrequency = user.userFrequency || 'First-time';

    const allBadges = [
      {
        name: 'Welcome',
        icon: '🎉',
        description: 'Welcome to Green Points!',
        earned: user.badges?.includes('Welcome') || false,
        requirement: 'Sign up',
        progress: 100
      },
      {
        name: 'Eco Hero',
        icon: '🌟',
        description: 'Earned 500+ Green Points',
        earned: user.badges?.includes('Eco Hero') || false,
        requirement: '500 points earned',
        progress: Math.min((totalEarned / 500) * 100, 100)
      },
      {
        name: 'Green Champion',
        icon: '🏆',
        description: 'Earned 1000+ Green Points',
        earned: user.badges?.includes('Green Champion') || false,
        requirement: '1000 points earned',
        progress: Math.min((totalEarned / 1000) * 100, 100)
      },
      {
        name: 'Bulk Recycler',
        icon: '♻️',
        description: 'Recycled 10+ items',
        earned: user.badges?.includes('Bulk Recycler') || false,
        requirement: '10 items recycled',
        progress: Math.min((totalItems / 10) * 100, 100)
      },
      {
        name: 'Heavy Lifter',
        icon: '💪',
        description: 'Recycled 50+ kg of e-waste',
        earned: user.badges?.includes('Heavy Lifter') || false,
        requirement: '50 kg recycled',
        progress: Math.min((totalWeight / 50) * 100, 100)
      },
      {
        name: 'Regular Recycler',
        icon: '🔄',
        description: 'Regular recycling contributor',
        earned: user.badges?.includes('Regular Recycler') || false,
        requirement: 'Regular user status',
        progress: userFrequency === 'Regular' ? 100 : userFrequency === 'Occasional' ? 50 : 0
      }
    ];

    setAvailableBadges(allBadges);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="loading-spinner mr-2"></div>
        <span className="text-gray-600">Loading badges...</span>
      </div>
    );
  }

  const displayBadges = limit ? availableBadges.slice(0, limit) : availableBadges;
  const earnedCount = availableBadges.filter(badge => badge.earned).length;

  return (
    <div>
      {showTitle && (
        <div className="flex items-center space-x-2 mb-4">
          <Award className="h-5 w-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Your Badges ({earnedCount}/{availableBadges.length})
          </h3>
        </div>
      )}

      {displayBadges.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {displayBadges.map((badge, index) => (
            <div
              key={index}
              className={`border rounded-lg p-3 text-center transition-all ${
                badge.earned
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-md'
                  : 'bg-gray-50 border-gray-200 opacity-75'
              }`}
            >
              <div className={`text-2xl mb-1 ${badge.earned ? '' : 'grayscale'}`}>
                {badge.icon}
              </div>
              <div className={`text-sm font-medium ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                {badge.name}
              </div>
              <div className={`text-xs mt-1 ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                {badge.description}
              </div>
              {!badge.earned && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${badge.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.round(badge.progress)}% - {badge.requirement}
                  </div>
                </div>
              )}
              {badge.earned && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Earned
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No badges available</p>
          <p className="text-sm text-gray-400 mt-1">
            Start recycling to earn your first badge!
          </p>
        </div>
      )}

      {limit && availableBadges.length > limit && (
        <div className="text-center mt-4">
          <span className="text-sm text-gray-500">
            +{availableBadges.length - limit} more badges
          </span>
        </div>
      )}
    </div>
  );
};

export default BadgesDisplay;
