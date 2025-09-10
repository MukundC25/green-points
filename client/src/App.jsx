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
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <nav style={{ backgroundColor: '#16a34a', color: 'white', padding: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>🌱 Green Points System</h1>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</a>
            <a href="/submit" style={{ color: 'white', textDecoration: 'none' }}>Submit E-Waste</a>
            <a href="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</a>
          </div>
        </div>
      </nav>
      <main style={{ padding: '20px' }}>
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
