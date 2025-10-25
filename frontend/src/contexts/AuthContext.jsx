import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to set auth token in API headers
  const setAuthToken = (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      console.log('Token set in localStorage and headers');
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      console.log('Token removed from localStorage and headers');
    }
  };

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Checking auth with token:', token ? 'Present' : 'Not present');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Set token in axios headers
        setAuthToken(token);
        
        const res = await api.get('/api/auth/me');
        console.log('Auth check response:', res.data);
        setUser(res.data.user);
      } catch (error) {
        console.error('Auth check error:', error.response?.data || error.message);
        // Clear token on auth error
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);



  // Login user
  const login = async (phone, password) => {
    try {
      setError(null);
      console.log('Attempting login for:', phone);
      const res = await api.post('/api/auth/login', { phone, password });
      
      console.log('Login response:', res.data);
      
      // Save token and set in headers
      setAuthToken(res.data.token);
      
      // Set user data
      setUser(res.data.user);
      
      return { success: true, data: res.data };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      console.log('Registering user:', userData.email);
      const res = await api.post('/api/auth/register', userData);
      
      console.log('Register response:', res.data);
      
      // Save token and set in headers
      setAuthToken(res.data.token);
      
      // Set user data
      setUser(res.data.user);
      
      return { success: true, data: res.data };
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout user
  const logout = () => {
    console.log('Logging out user');
    
    // Clear token and user data
    setAuthToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isFarmer: user?.role === 'farmer',
    isOwner: user?.role === 'owner'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
