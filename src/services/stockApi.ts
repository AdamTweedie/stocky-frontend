import { Stock, NewsArticle } from '@/types/stock';
import { USE_MOCK_DATA, API_CONFIG } from '@/config/features';
import { popularStocks, generateMockNews } from '@/data/mockData';

// ─── Helpers ───────────────────────────────────────────────

const apiHeaders = (): HeadersInit => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (API_CONFIG.API_KEY) {
    headers[API_CONFIG.API_KEY_HEADER] = API_CONFIG.API_KEY;
  }
  return headers;
};

const apiFetch = async <T>(baseUrl: string, path: string): Promise<T> => {
  const res = await fetch(`${baseUrl}${path}`, { headers: apiHeaders() });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json();
};

// ─── Stock Search ──────────────────────────────────────────

/**
 * Search stocks by query string.
 * Returns matching stocks from API or mock data.
 */
export const searchStocks = async (query: string): Promise<Stock[]> => {
  if (USE_MOCK_DATA) {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return popularStocks;
    return popularStocks.filter(
      (s) =>
        s.symbol.toLowerCase().includes(lowerQuery) ||
        s.name.toLowerCase().includes(lowerQuery),
    );
  }

  // ── Real API call ──
  // Adjust the endpoint / response shape to match your API
  const data = await apiFetch<{ results: Stock[] }>(
    API_CONFIG.STOCKS_BASE_URL,
    `/stocks/search?q=${encodeURIComponent(query)}`,
  );
  return data.results;
};

/**
 * Get the full list of popular / suggested stocks.
 */
export const getPopularStocks = async (): Promise<Stock[]> => {
  if (USE_MOCK_DATA) {
    return popularStocks;
  }

  const data = await apiFetch<{ results: Stock[] }>(
    API_CONFIG.STOCKS_BASE_URL,
    '/stocks/popular',
  );
  return data.results;
};

// ─── Stock Quotes / Prices ─────────────────────────────────

/**
 * Fetch real-time price data for a list of symbols.
 */
export const getStockQuotes = async (symbols: string[]): Promise<Stock[]> => {
  if (USE_MOCK_DATA) {
    return symbols
      .map((sym) => popularStocks.find((s) => s.symbol === sym))
      .filter((s): s is Stock => s !== undefined);
  }

  const data = await apiFetch<{ quotes: Stock[] }>(
    API_CONFIG.STOCKS_BASE_URL,
    `/stocks/quotes?symbols=${symbols.join(',')}`,
  );
  return data.quotes;
};

// ─── News ──────────────────────────────────────────────────

/**
 * Fetch news articles for a single stock symbol.
 */
export const getStockNews = async (symbol: string): Promise<NewsArticle[]> => {
  if (USE_MOCK_DATA) {
    return generateMockNews(symbol);
  }

  const data = await apiFetch<{ articles: NewsArticle[] }>(
    API_CONFIG.NEWS_BASE_URL,
    `/news?symbol=${encodeURIComponent(symbol)}`,
  );
  return data.articles;
};

/**
 * Fetch aggregated news for multiple symbols.
 */
export const getAggregatedNews = async (
  symbols: string[],
): Promise<NewsArticle[]> => {
  if (USE_MOCK_DATA) {
    const articles: NewsArticle[] = [];
    symbols.forEach((sym) => articles.push(...generateMockNews(sym)));
    return articles.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }

  const data = await apiFetch<{ articles: NewsArticle[] }>(
    API_CONFIG.NEWS_BASE_URL,
    `/news?symbols=${symbols.join(',')}`,
  );
  return data.articles;
};
