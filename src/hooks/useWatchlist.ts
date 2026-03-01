import { useState, useEffect } from 'react';
import { Stock } from '@/types/stock';
// popularStocks import removed — price data now comes from the API
import { syncWatchlist, getStockQuote, getStockQuotes } from '@/services/stockApi';

const STORAGE_KEY = 'stock-watchlist';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<Stock[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const symbols = JSON.parse(stored) as string[];
        if (symbols.length === 0) return;

        // Set placeholder entries immediately so the UI shows symbols
        const placeholders = symbols.map(symbol => ({ symbol, name: symbol }));
        setWatchlist(placeholders);

        // Fetch real price data from the API
        getStockQuotes(symbols)
          .then((quotes) => {
            setWatchlist(prev =>
              prev.map(s => {
                const q = quotes.find(q => q.symbol === s.symbol);
                return q ? { ...s, ...q } : s;
              })
            );
          })
          .catch(err => console.error('Failed to fetch quotes on load:', err));
      } catch (e) {
        console.error('Failed to parse watchlist:', e);
      }
    }
  }, []);

  const addStock = (stock: Stock) => {
    if (watchlist.some(s => s.symbol === stock.symbol)) return;
    
    const newWatchlist = [...watchlist, stock];
    setWatchlist(newWatchlist);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newWatchlist.map(s => s.symbol)));

    // Fetch price data for the new stock
    getStockQuote([stock])
      .then((quotes) => {
        setWatchlist(prev =>
          prev.map(s => {
            const q = quotes.find(q => q.symbol === s.symbol);
            return q ? { ...s, ...q } : s;
          })
        );
      })
      .catch(err => console.error('Quote fetch failed:', err));

    // Sync full watchlist to backend
    syncWatchlist(newWatchlist.map(s => ({ symbol: s.symbol, name: s.name })))
      .catch(err => console.error('Watchlist sync failed:', err));
  };

  const removeStock = (symbol: string) => {
    const newWatchlist = watchlist.filter(s => s.symbol !== symbol);
    setWatchlist(newWatchlist);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newWatchlist.map(s => s.symbol)));
  };

  const isInWatchlist = (symbol: string) => {
    return watchlist.some(s => s.symbol === symbol);
  };

  return { watchlist, addStock, removeStock, isInWatchlist };
};
