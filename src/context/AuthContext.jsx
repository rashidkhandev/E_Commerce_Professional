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
    if (!token) {
      setLoading(false);
      return;
    }

    // Preserve demo/offline session without requesting backend
    if (token.startsWith('demo_')) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await API.get('/auth/me');
      if (res.data?.success && res.data?.data) {
        setUser(res.data.data);
        localStorage.setItem('rashid_user', JSON.stringify(res.data.data));
      }
    } catch (err) {
      // If unauthorized, clear session
      if (!token || err.response?.status === 401) {
        setUser(null);
        setToken(null);
        localStorage.removeItem('rashid_user');
        localStorage.removeItem('rashid_token');
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
      // Check if this is a demo account attempt when live backend is offline / unreachable (404, 405, Network Error, etc.)
      const isDemoAdmin = email === 'admin@rashidstore.com' && (password === 'Admin@123456' || password === 'admin');
      const isDemoCustomer = email === 'user@rashidstore.com' && (password === 'User@123456' || password === 'user');

      if (isDemoAdmin) {
        const demoAdmin = {
          _id: 'demo-admin-id-2026',
          name: 'Muhammad Rashid (Demo Admin)',
          email: 'admin@rashidstore.com',
          role: 'admin',
          phone: '03347784456',
        };
        setUser(demoAdmin);
        setToken('demo_admin_token_2026');
        localStorage.setItem('rashid_user', JSON.stringify(demoAdmin));
        localStorage.setItem('rashid_token', 'demo_admin_token_2026');
        return { success: true, user: demoAdmin };
      }

      if (isDemoCustomer) {
        const demoUser = {
          _id: 'demo-user-id-2026',
          name: 'Customer Demo User',
          email: 'user@rashidstore.com',
          role: 'customer',
          phone: '03347784456',
        };
        setUser(demoUser);
        setToken('demo_user_token_2026');
        localStorage.setItem('rashid_user', JSON.stringify(demoUser));
        localStorage.setItem('rashid_token', 'demo_user_token_2026');
        return { success: true, user: demoUser };
      }

      const isUnreachable = !err.response || err.response?.status === 405 || err.response?.status === 404 || err.code === 'ERR_NETWORK';
      let errMsg = err.response?.data?.message;
      if (!errMsg) {
        if (isUnreachable) {
          errMsg = 'Live Backend server is not connected yet. Click "Demo Admin" or "Demo Customer" below to log in!';
        } else {
          errMsg = err.message || 'Login failed';
        }
      }

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
      const isUnreachable = !err.response || err.response?.status === 405 || err.response?.status === 404 || err.code === 'ERR_NETWORK';
      if (isUnreachable) {
        // Allow creating demo account locally when live backend is unreachable
        const localUser = {
          _id: 'demo-reg-' + Date.now(),
          name,
          email,
          role: 'customer',
          phone: phone || '',
        };
        setUser(localUser);
        setToken('demo_reg_token_' + Date.now());
        localStorage.setItem('rashid_user', JSON.stringify(localUser));
        localStorage.setItem('rashid_token', 'demo_reg_token_' + Date.now());
        return { success: true, user: localUser };
      }

      const errMsg = err.response?.data?.message || err.message || 'Registration failed';
      setAuthError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  // Logout action
  const logout = async () => {
    try {
      if (!token?.startsWith('demo_')) {
        await API.post('/auth/logout');
      }
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
