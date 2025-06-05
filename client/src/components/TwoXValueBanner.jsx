import React, { useState, useEffect } from 'react';
import { pointsService } from '../services/pointsService';
import { Clock, Zap } from 'lucide-react';

const TwoXValueBanner = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
    // Update every minute
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await pointsService.get2XStatus();
      setStatus(response);
    } catch (error) {
      console.error('Failed to fetch 2X status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !status || !status.canUse2X) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-4 mb-6 text-white shadow-md border border-blue-200">
      <div className="flex items-center space-x-3">
        <div className="bg-white bg-opacity-20 rounded-full p-2">
          <Zap className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-white">⚡ 2X Points Value Active</h3>
          <p className="text-blue-100">
            Use your Green Points now for <strong>double value</strong>! Limited time offer.
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 text-white bg-white bg-opacity-20 rounded-md px-3 py-1">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              {status.timeRemainingFormatted} left
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoXValueBanner;
