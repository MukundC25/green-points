import React, { createContext, useContext, useState, useEffect } from 'react';

const PointsContext = createContext();

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};

export const PointsProvider = ({ children }) => {
  const [userStats, setUserStats] = useState({
    totalPoints: 150,
    totalSubmissions: 5,
    totalValue: 250,
    thisMonthSubmissions: 2,
    thisMonthPoints: 75
  });

  // Load stats from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('greenPointsStats');
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        setUserStats(parsed);
      } catch (error) {
        console.error('Error loading saved stats:', error);
      }
    }
  }, []);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('greenPointsStats', JSON.stringify(userStats));
  }, [userStats]);

  const addSubmission = (submissionData) => {
    const { estimatedPoints, estimatedPrice, items } = submissionData;
    
    let pointsToAdd = 0;
    let priceToAdd = 0;
    let itemsCount = 0;

    if (items && items.length > 0) {
      // Multiple items submission
      pointsToAdd = items.reduce((sum, item) => sum + (item.estimatedPoints || 0), 0);
      priceToAdd = items.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);
      itemsCount = items.length;
    } else {
      // Single item submission
      pointsToAdd = estimatedPoints || 0;
      priceToAdd = estimatedPrice || 0;
      itemsCount = 1;
    }

    setUserStats(prevStats => ({
      ...prevStats,
      totalPoints: prevStats.totalPoints + pointsToAdd,
      totalSubmissions: prevStats.totalSubmissions + itemsCount,
      totalValue: prevStats.totalValue + priceToAdd,
      thisMonthSubmissions: prevStats.thisMonthSubmissions + itemsCount,
      thisMonthPoints: prevStats.thisMonthPoints + pointsToAdd
    }));

    console.log('✅ Points updated:', {
      pointsAdded: pointsToAdd,
      priceAdded: priceToAdd,
      itemsAdded: itemsCount,
      newTotal: userStats.totalPoints + pointsToAdd
    });
  };

  const resetStats = () => {
    const defaultStats = {
      totalPoints: 0,
      totalSubmissions: 0,
      totalValue: 0,
      thisMonthSubmissions: 0,
      thisMonthPoints: 0
    };
    setUserStats(defaultStats);
    localStorage.removeItem('greenPointsStats');
  };

  const value = {
    userStats,
    addSubmission,
    resetStats,
    // Convenience getters
    totalPoints: userStats.totalPoints,
    totalSubmissions: userStats.totalSubmissions,
    totalValue: userStats.totalValue,
    thisMonthSubmissions: userStats.thisMonthSubmissions,
    thisMonthPoints: userStats.thisMonthPoints
  };

  return (
    <PointsContext.Provider value={value}>
      {children}
    </PointsContext.Provider>
  );
};
