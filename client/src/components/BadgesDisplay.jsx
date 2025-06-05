import React, { useState, useEffect } from 'react';
import { pointsService } from '../services/pointsService';
import { Award } from 'lucide-react';

const BadgesDisplay = ({ showTitle = true, limit = null }) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="loading-spinner mr-2"></div>
        <span className="text-gray-600">Loading badges...</span>
      </div>
    );
  }

  const displayBadges = limit ? badges.slice(0, limit) : badges;

  return (
    <div>
      {showTitle && (
        <div className="flex items-center space-x-2 mb-4">
          <Award className="h-5 w-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Your Badges ({badges.length})
          </h3>
        </div>
      )}
      
      {displayBadges.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {displayBadges.map((badge, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-shadow"
            >
              <div className="text-2xl mb-1">{badge.icon}</div>
              <div className="text-sm font-medium text-gray-900">{badge.name}</div>
              <div className="text-xs text-gray-500 mt-1">{badge.description}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No badges earned yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Start recycling to earn your first badge!
          </p>
        </div>
      )}
      
      {limit && badges.length > limit && (
        <div className="text-center mt-4">
          <span className="text-sm text-gray-500">
            +{badges.length - limit} more badges
          </span>
        </div>
      )}
    </div>
  );
};

export default BadgesDisplay;
