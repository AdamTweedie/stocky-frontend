import { useState, useEffect } from 'react';
import { Stock } from '@/types/stock';
import { popularStocks } from '@/data/mockData';

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
