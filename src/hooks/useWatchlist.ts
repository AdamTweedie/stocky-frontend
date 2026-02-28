import { useState, useEffect } from 'react';
import { Stock } from '@/types/stock';
import { popularStocks } from '@/data/mockData';
import { syncWatchlist, getStockQuotes } from '@/services/stockApi';

const STORAGE_KEY = 'stock-watchlist';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<Stock[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const symbols = JSON.parse(stored) as string[];
        const stocks = symbols
          .map(symbol => popularStocks.find(s => s.symbol === symbol))
          .filter((s): s is Stock => s !== undefined);
        setWatchlist(stocks);
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
    getStockQuotes([stock.symbol])
      .then(([quote]) => {
        if (quote) {
          setWatchlist(prev =>
            prev.map(s => s.symbol === quote.symbol ? { ...s, ...quote } : s)
          );
        }
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
