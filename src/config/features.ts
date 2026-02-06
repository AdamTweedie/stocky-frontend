/**
 * Feature flags for StockPulse
 * 
 * ⚡ TOGGLE THIS to switch between mock data and real API calls.
 * 
 * When `true`:  All data comes from local mock generators (no network calls).
 * When `false`: Data is fetched from the configured API endpoints below.
 */
export const USE_MOCK_DATA = true;

/**
 * API configuration — only used when USE_MOCK_DATA is false.
 * Replace these with your actual API base URLs and keys.
 */
export const API_CONFIG = {
  /** Base URL for stock search / quote endpoints */
  STOCKS_BASE_URL: 'https://api.example.com/v1',

  /** Base URL for news endpoints */
  NEWS_BASE_URL: 'https://api.example.com/v1',

  /** Optional API key header name (e.g. 'X-Api-Key', 'Authorization') */
  API_KEY_HEADER: 'X-Api-Key',

  /** 
   * The API key value — for publishable (client-safe) keys only.
   * For private keys, move this to a Cloud secret + edge function.
   */
  API_KEY: '',
};
