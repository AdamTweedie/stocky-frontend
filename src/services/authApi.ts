import { API_CONFIG } from '@/config/features';

const apiHeaders = (): HeadersInit => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (API_CONFIG.API_KEY) {
    headers[API_CONFIG.API_KEY_HEADER] = API_CONFIG.API_KEY;
  }
  return headers;
};

export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  displayName?: string;
  avatar?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export const signup = async (username: string, password: string): Promise<AuthResponse> => {
  const res = await fetch(`${API_CONFIG.STOCKS_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: apiHeaders(),
    body: JSON.stringify({ username: username.trim(), password }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Signup failed (${res.status})`);
  }
  return res.json();
};

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const res = await fetch(`${API_CONFIG.STOCKS_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: apiHeaders(),
    body: JSON.stringify({ username: username.trim(), password }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Login failed (${res.status})`);
  }
  return res.json();
};

export const googleSignIn = (): void => {
  window.location.href = `${API_CONFIG.STOCKS_BASE_URL}/auth/google`;
};

export const logout = async (token: string): Promise<void> => {
  await fetch(`${API_CONFIG.STOCKS_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { ...apiHeaders(), Authorization: `Bearer ${token}` },
  });
};
