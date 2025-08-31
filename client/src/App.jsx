import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { sessionService } from './services/sessionService';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import SubmitEWaste from './pages/SubmitEWaste';
import RedeemPoints from './pages/RedeemPoints';
import TransactionHistory from './pages/TransactionHistory';
import Profile from './pages/Profile';
import Referral from './pages/Referral';

function App() {
  // Initialize session on app start
  useEffect(() => {
    const initializeSession = async () => {
      try {
        console.log('🚀 Initializing session on app start...');

        // Force session creation by calling dashboard
        const response = await fetch('/api/user/dashboard-session', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        console.log('✅ Session initialized with user:', data.user.email);

        // Store session info in localStorage for debugging
        localStorage.setItem('sessionUser', JSON.stringify(data.user));
      } catch (error) {
        console.error('❌ Session initialization failed:', error);
      }
    };

    initializeSession();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes with Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="submit" element={<SubmitEWaste />} />
              <Route path="redeem" element={<RedeemPoints />} />
              <Route path="history" element={<TransactionHistory />} />
              <Route path="profile" element={<Profile />} />
              <Route path="referral" element={<Referral />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
