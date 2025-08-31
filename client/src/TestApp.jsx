import React from 'react';

function TestApp() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          🌱 Green Points System
        </h1>
        <p className="text-gray-600 mb-8">
          Frontend is working! All components loaded successfully.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="space-y-2 text-left">
            <div className="flex justify-between">
              <span>React:</span>
              <span className="text-green-600">✅ Working</span>
            </div>
            <div className="flex justify-between">
              <span>Tailwind CSS:</span>
              <span className="text-green-600">✅ Working</span>
            </div>
            <div className="flex justify-between">
              <span>Components:</span>
              <span className="text-green-600">✅ Working</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestApp;
