import { useQuery } from '@tanstack/react-query';
import { getStockQuotes } from '@/services/stockApi';

/**
 * Hook that fetches real-time price quotes for watchlist symbols.
 */
export const useStockQuotes = (symbols: string[]) => {
  return useQuery({
    queryKey: ['stockQuotes', ...symbols],
    queryFn: () => getStockQuotes(symbols),
    enabled: symbols.length > 0,
    staleTime: 15_000,
    refetchInterval: 15_000,
  });
};
