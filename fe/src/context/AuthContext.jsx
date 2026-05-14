import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

/**
 * AuthProvider - Manages authentication state and tokens
 * Handles JWT token storage, refresh, and user session management
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [tokenRefreshTime, setTokenRefreshTime] = useState(null);

  const loadUser = useCallback(async () => {
    const t = localStorage.getItem('token');
    if (!t) {
      setUser(null);
      setLoading(false);
      return;
    }
    setToken(t);
    try {
      const me = await authService.getMe();
      setUser(me);
      // Set token refresh timer (refresh every 20 minutes, token expires in 24h)
      setTokenRefreshTime(Date.now() + 20 * 60 * 1000);
    } catch (err) {
      // Token invalid or expired
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load and periodic refresh
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!tokenRefreshTime) return;

    const now = Date.now();
    if (now >= tokenRefreshTime) {
      // Time to refresh
      authService
        .refreshToken()
        .then((res) => {
          localStorage.setItem('token', res.token);
          setToken(res.token);
          setTokenRefreshTime(Date.now() + 20 * 60 * 1000);
        })
        .catch(() => {
          // Refresh failed, user will be logged out on next request
        });
    } else {
      // Schedule refresh for later
      const timer = setTimeout(() => {
        setTokenRefreshTime(Date.now());
      }, tokenRefreshTime - now);

      return () => clearTimeout(timer);
    }
  }, [tokenRefreshTime]);

  const login = async ({ email, password }) => {
    try {
      const res = await authService.login({ email, password });
      localStorage.setItem('token', res.token);
      setToken(res.token);
      const me = await authService.getMe();
      setUser(me);
      setTokenRefreshTime(Date.now() + 20 * 60 * 1000);
      return me;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la connexion');
    }
  };

  const register = async (payload) => {
    try {
      const res = await authService.register(payload);
      localStorage.setItem('token', res.token);
      setToken(res.token);
      const me = await authService.getMe();
      setUser(me);
      setTokenRefreshTime(Date.now() + 20 * 60 * 1000);
      return me;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setTokenRefreshTime(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      refreshUser: loadUser,
    }),
    [user, token, loading, loadUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth doit être utilisé sous AuthProvider');
  }
  return ctx;
}
