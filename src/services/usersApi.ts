import { User, TokenUsage, Subscription } from '@/types/stock';
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