import { Stock, StockListResponse, NewsArticle, NewsListResponse } from '@/types/stock';
import { API_CONFIG } from '@/config/features';

// ─── Helpers ───────────────────────────────────────────────

const getHeaders = (requiresAuth: boolean = false): HeadersInit => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (requiresAuth) {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const apiFetch = async <T>(path: string, requiresAuth: boolean = false): Promise<T> => {
  const res = await fetch(`${API_CONFIG.STOCKS_BASE_URL}${path}`, {
    headers: getHeaders(requiresAuth),
  });
  if (res.status === 401) throw new Error('unauthorized');
  if (res.status === 403) throw new Error('upgrade_required');
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json();
};

// ─── Public ────────────────────────────────────────────────

export const getFreeStocks = async (): Promise<Stock[]> => {
  const data = await apiFetch<StockListResponse>('/free');
  return data.results;
};

export const getPopularStocks = async (): Promise<Stock[]> => {
  const data = await apiFetch<StockListResponse>('/popular');
  return data.results;
};

export const searchStocks = async (query: string): Promise<Stock[]> => {
  const data = await apiFetch<StockListResponse>(`/search?q=${encodeURIComponent(query)}`);
  return data.results;
};

export const getStockQuotes = async (symbols: string[]): Promise<Stock[]> => {
  const data = await apiFetch<StockListResponse>(`/quotes?q=${encodeURIComponent(symbols.join(','))}`);
  return data.results;
};

export const getStockQuote = async (symbol: string): Promise<Stock[]> => {
  const data = await apiFetch<StockListResponse>(`/quotes?q=${encodeURIComponent(symbol)}`);
  return data.results;
};

export const isStockFree = async (symbol: string): Promise<boolean> => {
  const data = await apiFetch<{ is_free: string }>(`/is_free?q=${encodeURIComponent(symbol)}`);
  return data.is_free === 'True';
};

