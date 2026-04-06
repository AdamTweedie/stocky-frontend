import { User, TokenUsage, Subscription, Stock, StockListResponse } from '@/types/stock';
import { API_CONFIG } from '@/config/features';

const BASE = API_CONFIG.USER_BASE_URL;

const authHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getProfile = async (): Promise<User> => {
  const res = await fetch(`${BASE}/profile`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
};

export const updateProfile = async (fields: { name?: string; avatar_url?: string }): Promise<User> => {
  const res = await fetch(`${BASE}/profile`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(fields),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
};

export const updatePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  const res = await fetch(`${BASE}/password`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });
  if (!res.ok) throw new Error('Failed to update password');
};

export const getTokenUsage = async (): Promise<TokenUsage> => {
  const res = await fetch(`${BASE}/tokens`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch token usage');
  return res.json();
};

export const getSubscription = async (): Promise<Subscription> => {
  const res = await fetch(`${BASE}/subscription`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch subscription');
  return res.json();
};

export const getFollowedIndustries = async (): Promise<string[]> => {
  const res = await fetch(`${BASE}/industries`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch industries');
  const data = await res.json();
  return data.results;
};

export const followIndustry = async (industry: string): Promise<void> => {
  const res = await fetch(`${BASE}/industries`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ industry }),
  });
  if (!res.ok) throw new Error('Failed to follow industry');
};

export const unfollowIndustry = async (industry: string): Promise<void> => {
  const res = await fetch(`${BASE}/industries/${encodeURIComponent(industry)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to unfollow industry');
};

export const upgradeSubscription = async (tier: string): Promise<{ checkout_url?: string }> => {
  const res = await fetch(`${BASE}/subscription/upgrade`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ tier }),
  });
  if (!res.ok) throw new Error('Failed to upgrade subscription');
  return res.json();
};

// ─── Authenticated ─────────────────────────────────────────

const getHeaders = (requiresAuth: boolean = false): HeadersInit => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (requiresAuth) {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const apiFetch = async <T>(path: string, requiresAuth: boolean = false): Promise<T> => {
  const res = await fetch(`${BASE}${path}`, {
    headers: getHeaders(requiresAuth),
  });
  if (res.status === 401) throw new Error('unauthorized');
  if (res.status === 403) throw new Error('upgrade_required');
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json();
};

export const getWatchlist = async (): Promise<Stock[]> => {
  const data = await apiFetch<StockListResponse>('/watchlist', true);
  return data.results;
};

export const addToWatchlist = async (shortName: string): Promise<void> => {
  const res = await fetch(`${BASE}/watchlist`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({ short_name: shortName }),
  });
  if (res.status === 403) throw new Error('upgrade_required');
  if (res.status === 409) throw new Error('already_in_watchlist');
  if (!res.ok) throw new Error(`Failed to add to watchlist: ${res.statusText}`);
};

export const removeFromWatchlist = async (shortName: string): Promise<void> => {
  const res = await fetch(`${BASE}/watchlist/${shortName}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });
  if (!res.ok) throw new Error(`Failed to remove from watchlist: ${res.statusText}`);
};

export const reorderWatchlist = async (orderedShortNames: string[]): Promise<void> => {
  const res = await fetch(`${BASE}/watchlist/reorder`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify({ ordered_short_names: orderedShortNames }),
  });
  if (!res.ok) throw new Error(`Failed to reorder watchlist: ${res.statusText}`);
};