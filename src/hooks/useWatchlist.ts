import { useState, useEffect } from 'react';
import { Stock } from '@/types/stock';
import {
  getWatchlist,
  getStockQuotes,
  addToWatchlist,
  removeFromWatchlist,
  reorderWatchlist,
} from '@/services/stockApi';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // authenticated — fetch watchlist from backend
      getWatchlist()
        .then(setWatchlist)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      // unauthenticated — load symbols from localStorage and fetch quotes
      const stored = localStorage.getItem('watchlist');
      if (stored) {
        try {
          const symbols = JSON.parse(stored) as string[];
          if (symbols.length === 0) {
            setLoading(false);
            return;
          }

          const placeholders: Stock[] = symbols.map(symbol => ({
            symbol,
            name: symbol,
            currencyCode: null,
            type: null,
            industry: null,
            price: null,
            change: null,
            changePercent: null,
            inFreeTier: null,
            inUse: null,
          }));
          setWatchlist(placeholders);

          getStockQuotes(symbols)
            .then(quotes => {
              setWatchlist(prev =>
                prev.map(s => quotes.find(q => q.symbol === s.symbol) ?? s)
              );
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
        } catch {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
  }, []);

  const addStock = async (stock: Stock): Promise<void> => {
    if (watchlist.some(s => s.symbol === stock.symbol)) return;

    const token = localStorage.getItem('token');

    if (token) {
      await addToWatchlist(stock.symbol);
      setWatchlist(prev => [...prev, stock]);
    } else {
      const newWatchlist = [...watchlist, stock];
      setWatchlist(newWatchlist);
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist.map(s => s.symbol)));
    }
  };

  const removeStock = async (symbol: string): Promise<void> => {
    const token = localStorage.getItem('token');

    if (token) {
      await removeFromWatchlist(symbol);
    } else {
      const newWatchlist = watchlist.filter(s => s.symbol !== symbol);
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist.map(s => s.symbol)));
    }
    setWatchlist(prev => prev.filter(s => s.symbol !== symbol));
  };

  const reorder = async (orderedSymbols: string[]): Promise<void> => {
    const token = localStorage.getItem('token');
    if (token) await reorderWatchlist(orderedSymbols);
    setWatchlist(prev =>
      orderedSymbols.map(sym => prev.find(s => s.symbol === sym)!).filter(Boolean)
    );
  };

  const isInWatchlist = (symbol: string): boolean =>
    watchlist.some(s => s.symbol === symbol);

  return { watchlist, loading, error, addStock, removeStock, reorder, isInWatchlist };
};