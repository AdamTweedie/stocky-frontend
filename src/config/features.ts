/**
 * Feature flags for StockPulse
 * 
 * ⚡ TOGGLE THIS to switch between mock data and real API calls.
 * 
 * When `true`:  All data comes from local mock generators (no network calls).
 * When `false`: Data is fetched from the configured API endpoints below.
 */
export const USE_MOCK_DATA = false;

/**
 * API configuration — only used when USE_MOCK_DATA is false.
 * Replace these with your actual API base URLs and keys.
 */
export const API_CONFIG = {
  /** Base URL for stock search / quote endpoints */
  STOCKS_BASE_URL: 'http://127.0.0.1:5000/stocks',
  AUTH_BASE_URL: 'http://127.0.0.1:5000/auth',
  NEWS_BASE_URL: 'http://127.0.0.1:5000/news',
  USER_BASE_URL: 'http://127.0.0.1:5000/user',

  /** Optional API key header name (e.g. 'X-Api-Key', 'Authorization') */
  API_KEY_HEADER: 'X-Api-Key',
  /** 
   * The API key value — for publishable (client-safe) keys only.
   * For private keys, move this to a Cloud secret + edge function.
   */
  API_KEY: '',
};
