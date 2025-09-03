import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Start as false to prevent blocking
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Non-blocking auth initialization
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
          console.log('Found saved token, will validate in background');
          // Don't block the UI - validate token in background
          setTimeout(async () => {
            try {
              const userData = await authService.getCurrentUser();
              setUser(userData.user);
              setToken(savedToken);
              console.log('✅ User session restored');
            } catch (error) {
              console.log('⚠️ Token expired, clearing session');
              localStorage.removeItem('token');
              setToken(null);
            }
          }, 500);
        }
      } catch (error) {
        console.log('Auth init error (non-critical):', error.message);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      
      toast.success('Welcome back!');
      return response;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      
      toast.success('Account created successfully!');
      return response;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
