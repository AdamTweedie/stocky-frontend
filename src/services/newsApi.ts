import { NewsArticle, NewsListResponse, AISummary } from '@/types/stock';
import { API_CONFIG } from '@/config/features';

const getHeaders = (requiresAuth: boolean = false): HeadersInit => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (requiresAuth) {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const apiFetch = async <T>(path: string, requiresAuth: boolean = false): Promise<T> => {
  const res = await fetch(`${API_CONFIG.NEWS_BASE_URL}${path}`, {
    headers: getHeaders(requiresAuth),
  });
  if (res.status === 401) throw new Error('unauthorized');
  if (res.status === 403) throw new Error('upgrade_required');
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json();
};

// ─── Public ────────────────────────────────────────────────

export const getFreeStockNews = async (symbol: string, since?: string): Promise<NewsArticle[]> => {
  const params = new URLSearchParams({ q: symbol });
  if (since) params.append('since', since);
  const data = await apiFetch<NewsListResponse>(`/symbol_free?${params.toString()}`);
  return data.results;
};

export const getMultipleStockNews = async (symbols: string[], since?: string): Promise<NewsArticle[]> => {
  const params = new URLSearchParams({ q: symbols.join(',') });
  if (since) params.append('since', since);
  const data = await apiFetch<NewsListResponse>(`/symbol_free?${params.toString()}`);
  return data.results;
};

// ─── Authenticated ─────────────────────────────────────────

export const getWatchlistNews = async (since?: string): Promise<NewsArticle[]> => {
  const params = since ? `?since=${since}` : '';
  const data = await apiFetch<NewsListResponse>(`/watchlist${params}`, true);
  return data.results;
};

export const getStockNews = async (symbol: string, since?: string): Promise<NewsArticle[]> => {
  const params = new URLSearchParams({ q: symbol });
  if (since) params.append('since', since);
  const data = await apiFetch<NewsListResponse>(`/symbol_premium?${params.toString()}`, true);
  return data.results;
};

export const getArticleAiSummary = async (id: number): Promise<AISummary> => {
  const data = await apiFetch<AISummary>(`/article/${id}/summary`, true);
  return data;
};

export const getStockAiSummary = async (symbol: string): Promise<AISummary> => {
  const data = await apiFetch<AISummary>(`/summary/${symbol}`, true);
  return data;
};