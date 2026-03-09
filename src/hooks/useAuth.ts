import { useState, useEffect, useCallback } from 'react';
import { AuthUser, login as apiLogin, signup as apiSignup, logout as apiLogout, googleSignIn as apiGoogleSignIn } from '@/services/authApi';

const TOKEN_KEY = 'stockpulse_token';
const USER_KEY = 'stockpulse_user';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!token;

  const persist = (u: AuthUser, t: string) => {
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    localStorage.setItem(TOKEN_KEY, t);
    setUser(u);
    setToken(t);
  };

  const clear = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setToken(null);
  };

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiLogin(username, password);
      persist(res.user, res.token);
    } catch (e: any) {
      setError(e.message || 'Login failed');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiSignup(username, password);
      persist(res.user, res.token);
    } catch (e: any) {
      setError(e.message || 'Signup failed');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      try { await apiLogout(token); } catch {}
    }
    clear();
  }, [token]);

  const googleSignIn = useCallback(() => {
    apiGoogleSignIn();
  }, []);

  // Handle Google OAuth callback token from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const callbackToken = params.get('token');
    const callbackUser = params.get('user');
    if (callbackToken && callbackUser) {
      try {
        const parsed = JSON.parse(decodeURIComponent(callbackUser));
        persist(parsed, callbackToken);
        window.history.replaceState({}, '', window.location.pathname);
      } catch {}
    }
  }, []);

  return { user, token, isAuthenticated, loading, error, login, signup, logout, googleSignIn };
};
