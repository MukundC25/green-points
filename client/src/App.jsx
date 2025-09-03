import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PointsProvider } from './context/PointsContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import SubmitEWaste from './pages/SubmitEWaste';

// Simple Layout without auth dependency
function SimpleLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-600 text-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">🌱 Green Points System</h1>
          <div className="space-x-4">
            <a href="/dashboard" className="hover:underline">Dashboard</a>
            <a href="/submit" className="hover:underline">Submit E-Waste</a>
            <a href="/login" className="hover:underline">Login</a>
          </div>
        </div>
      </nav>
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}

function App() {
  console.log('🚀 Green Points App starting...');

  return (
    <PointsProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#4aed88',
              },
            },
          }}
        />

        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<SimpleLayout><Login /></SimpleLayout>} />
          <Route path="/register" element={<SimpleLayout><Register /></SimpleLayout>} />

          {/* Main routes */}
          <Route path="/dashboard" element={<SimpleLayout><Dashboard /></SimpleLayout>} />
          <Route path="/submit" element={<SimpleLayout><SubmitEWaste /></SimpleLayout>} />

          {/* Default route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </PointsProvider>
  );
}

export default App;
