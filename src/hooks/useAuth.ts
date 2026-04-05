import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/stock';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  googleSignIn as apiGoogleSignIn,
  getMe,
  handleGoogleCallback,
} from '@/services/authApi';

const TOKEN_KEY = 'token';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!token;

  const persist = (t: string) => {
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
  };

  const clear = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setToken(null);
  };

  // fetch user profile when token is available
  useEffect(() => {
    if (token && !user) {
      getMe()
        .then(setUser)
        .catch(() => clear());
    }
  }, [token]);

  // handle Google OAuth callback token from URL
  useEffect(() => {
    const callbackToken = handleGoogleCallback();
    if (callbackToken) {
      persist(callbackToken);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiLogin(email, password);
      persist(res.session_token);
    } catch (e: any) {
      setError(e.message || 'Login failed');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, name: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRegister(email, name, password);
      persist(res.session_token);
    } catch (e: any) {
      setError(e.message || 'Registration failed');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try { await apiLogout(); } catch {}
    clear();
  }, []);

  const googleSignIn = useCallback(() => {
    apiGoogleSignIn();
  }, []);

  return { user, token, isAuthenticated, loading, error, login, register, logout, googleSignIn };
};