import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

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
    } catch {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async ({ email, password }) => {
    const res = await authService.login({ email, password });
    localStorage.setItem('token', res.token);
    setToken(res.token);
    const me = await authService.getMe();
    setUser(me);
    return me;
  };

  const register = async (payload) => {
    const res = await authService.register(payload);
    localStorage.setItem('token', res.token);
    setToken(res.token);
    const me = await authService.getMe();
    setUser(me);
    return me;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
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
