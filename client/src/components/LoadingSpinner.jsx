import React from 'react';
import { Leaf } from 'lucide-react';

const LoadingSpinner = ({ size = 'default', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex items-center space-x-2 mb-4">
        <Leaf className="h-8 w-8 text-primary-600" />
        <span className="text-2xl font-bold text-gray-900">Green Points</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className={`${sizeClasses[size]} animate-spin`}>
          <div className="h-full w-full rounded-full border-4 border-gray-200 border-t-primary-600"></div>
        </div>
        <span className="text-gray-600">{text}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
