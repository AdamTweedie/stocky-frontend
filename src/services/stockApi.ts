import { Stock, NewsArticle } from '@/types/stock';
import { USE_MOCK_DATA, API_CONFIG } from '@/config/features';
import { popularStocks, generateMockNews } from '@/data/mockData';
import { List } from 'postcss/lib/list';

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
/**
 * Fetch a real-time price quote for a single stock.
 * Sends: GET /stocks/quotes?q=[{symbol,name,price,change,changePercent}]
 * Expects: a flat array back; returns the first match merged onto the input.
 */
interface QuoteResponse {
  symbol: string;
  price: number;
  change: number;
  priceChange: number;
}

export const getStockQuote = async (query: string): Promise<Stock[]> => {
  
  const data = await apiFetch<{ results: Stock[] }>(
    API_CONFIG.STOCKS_BASE_URL,
    `/stocks/quotes?q=${encodeURIComponent(query)}`,
  );
  return data.results;
};

/**
 * Fetch real-time price data for a list of symbols (batch).
 */
export const getStockQuotes = async (symbols: string[]): Promise<Stock[]> => {
  if (USE_MOCK_DATA) {
    return symbols
      .map((sym) => popularStocks.find((s) => s.symbol === sym))
      .filter((s): s is Stock => s !== undefined);
  }

  const trimmed = symbols.map((s) => s.trim());

  const res = await fetch(
    `${API_CONFIG.STOCKS_BASE_URL}/stocks/quotes?q=${encodeURIComponent(JSON.stringify(trimmed))}`,
    { headers: apiHeaders() },
  );
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);

  const raw: QuoteResponse[] = await res.json();
  return raw.map((q) => ({
    symbol: q.symbol,
    name: q.symbol,
    price: q.price,
    change: q.change,
    changePercent: q.priceChange,
  }));
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

// ─── Watchlist Sync ────────────────────────────────────────

/**
 * Send the full watchlist to the backend whenever a stock is added.
 * Payload: { stocks: Array<{ symbol: string; name: string }> }
 */
export const syncWatchlist = async (
  stocks: Pick<Stock, 'symbol' | 'name'>[],
): Promise<void> => {
  if (USE_MOCK_DATA) {
    console.log('[mock] syncWatchlist →', stocks);
    return;
  }

  const res = await fetch(`${API_CONFIG.STOCKS_BASE_URL}/watchlist/sync`, {
    method: 'POST',
    headers: apiHeaders(),
    body: JSON.stringify({ stocks }),
  });

  if (!res.ok) {
    throw new Error(`Watchlist sync failed ${res.status}: ${res.statusText}`);
  }
};

// ─── AI Summaries ──────────────────────────────────────────

/**
 * Get an AI summary for a single news article.
 */
export const getArticleAiSummary = async (articleId: string, title: string, description: string): Promise<string> => {
  if (USE_MOCK_DATA) {
    return `AI Summary: This article discusses "${title}". Key takeaways include market implications and potential investor impact. The sentiment analysis suggests monitoring this development closely for trading opportunities.`;
  }

  const res = await fetch(`${API_CONFIG.STOCKS_BASE_URL}/ai/article-summary`, {
    method: 'POST',
    headers: apiHeaders(),
    body: JSON.stringify({ article_id: articleId, title, description }),
  });

  if (!res.ok) throw new Error(`AI summary failed ${res.status}: ${res.statusText}`);
  const data = await res.json();
  return data.summary;
};

/**
 * Get an AI summary of all recent news for a specific stock symbol.
 */
export const getStockAiSummary = async (symbol: string): Promise<string> => {
  if (USE_MOCK_DATA) {
    return `AI Summary for ${symbol}: Recent developments show mixed signals. The stock has seen increased institutional interest amid sector-wide shifts. Key catalysts include upcoming earnings reports and regulatory changes. Overall market sentiment remains cautiously optimistic with analysts maintaining a moderate outlook.`;
  }

  const res = await fetch(`${API_CONFIG.STOCKS_BASE_URL}/ai/stock-summary`, {
    method: 'POST',
    headers: apiHeaders(),
    body: JSON.stringify({ symbol }),
  });

  if (!res.ok) throw new Error(`AI summary failed ${res.status}: ${res.statusText}`);
  const data = await res.json();
  return data.summary;
};
