import { User } from '@/types/stock';
import { API_CONFIG } from '@/config/features';

const BASE = API_CONFIG.AUTH_BASE_URL;

const jsonHeaders = (): HeadersInit => ({ 'Content-Type': 'application/json' });

const authHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface AuthResponse {
  session_token: string;
  ok: boolean;
}

export const register = async (email: string, name: string, password: string, tier: string): Promise<AuthResponse> => {
  const res = await fetch(`${BASE}/register`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ email, name, password, tier }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || `Registration failed (${res.status})`);
  }
  return res.json();
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || `Login failed (${res.status})`);
  }
  return res.json();
};

export const logout = async (): Promise<void> => {
  await fetch(`${BASE}/logout`, {
    method: 'POST',
    headers: authHeaders(),
  });
  localStorage.removeItem('token');
};

export const getMe = async (): Promise<User> => {
  const res = await fetch(`${BASE}/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
};

export const googleSignIn = (): void => {
  window.location.href = `${BASE}/google`;
};

export const handleGoogleCallback = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  if (token) {
    localStorage.setItem('token', token);
    window.history.replaceState({}, '', window.location.pathname);
  }
  return token;
};

export const forgotPassword = async (email: string): Promise<void> => {
  await fetch(`${BASE}/forgot-password`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const res = await fetch(`${BASE}/reset-password`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ token, new_password: newPassword }),
  });
  if (!res.ok) throw new Error('Invalid or expired reset token');
};