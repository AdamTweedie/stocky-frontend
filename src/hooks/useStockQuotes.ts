import { useQuery } from '@tanstack/react-query';
import { getStockQuotes } from '@/services/stockApi';
import { USE_MOCK_DATA } from '@/config/features';

/**
 * Hook that fetches real-time price quotes for watchlist symbols.
 */
export const useStockQuotes = (symbols: string[]) => {
  return useQuery({
    queryKey: ['stockQuotes', ...symbols],
    queryFn: () => getStockQuotes(symbols),
    enabled: symbols.length > 0,
    staleTime: USE_MOCK_DATA ? Infinity : 15_000,
    refetchInterval: USE_MOCK_DATA ? false : 15_000,
  });
};
