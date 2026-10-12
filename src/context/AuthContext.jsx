import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('rashid_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('rashid_token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check current session from backend
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/auth/me');
      if (res.data?.success && res.data?.data) {
        setUser(res.data.data);
        localStorage.setItem('rashid_user', JSON.stringify(res.data.data));
      }
    } catch (err) {
      // If error (e.g. 401 or network), clear out invalid state
      if (!token) {
        setUser(null);
        localStorage.removeItem('rashid_user');
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login action
  const login = async (email, password) => {
    try {
      setAuthError(null);
      const res = await API.post('/auth/login', { email, password });
      if (res.data?.success) {
        const { token: receivedToken, data: userData } = res.data;
        setUser(userData);
        setToken(receivedToken);
        localStorage.setItem('rashid_user', JSON.stringify(userData));
        if (receivedToken) {
          localStorage.setItem('rashid_token', receivedToken);
        }
        return { success: true, user: userData };
      }
      throw new Error(res.data?.message || 'Login failed');
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Login failed';
      setAuthError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  // Register action
  const register = async (name, email, password, phone) => {
    try {
      setAuthError(null);
      const res = await API.post('/auth/register', { name, email, password, phone });
      if (res.data?.success) {
        const { token: receivedToken, data: userData } = res.data;
        setUser(userData);
        setToken(receivedToken);
        localStorage.setItem('rashid_user', JSON.stringify(userData));
        if (receivedToken) {
          localStorage.setItem('rashid_token', receivedToken);
        }
        return { success: true, user: userData };
      }
      throw new Error(res.data?.message || 'Registration failed');
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Registration failed';
      setAuthError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  // Logout action
  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('rashid_user');
      localStorage.removeItem('rashid_token');
    }
  };

  // Update profile details locally
  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('rashid_user', JSON.stringify(updatedUser));
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        isAdmin,
        login,
        register,
        logout,
        checkAuth,
        updateUserState,
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
