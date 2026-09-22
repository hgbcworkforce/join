import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const cachedUser = localStorage.getItem('user');
      return cachedUser ? JSON.parse(cachedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Normalize user object fields
  const normalizeUserData = (rawUser) => {
    if (!rawUser) return null;
    return {
      id: rawUser.id || rawUser._id,
      fullName: rawUser.fullName || rawUser.full_name || rawUser.name || 'Team Member',
      email: rawUser.email || '',
      role: rawUser.role || 'team_member',
      createdAt: rawUser.createdAt || rawUser.created_at || null,
    };
  };

  // Fetch real user data from backend
  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null') {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const response = await API.get('/auth/me');
      if (response.data && response.data.data) {
        const normalized = normalizeUserData(response.data.data);
        setUser(normalized);
        localStorage.setItem('user', JSON.stringify(normalized));
        return normalized;
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // If 401 Unauthorized, token is expired or invalid
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const login = (token, userData) => {
    if (token) {
      localStorage.setItem('token', token);
    }
    if (userData) {
      const normalized = normalizeUserData(userData);
      setUser(normalized);
      localStorage.setItem('user', JSON.stringify(normalized));
    } else {
      fetchUserProfile();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const merged = normalizeUserData({ ...user, ...updatedData });
    setUser(merged);
    localStorage.setItem('user', JSON.stringify(merged));
  };

  const isAuthenticated = Boolean(localStorage.getItem('token') && user);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser,
        refreshUser: fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
