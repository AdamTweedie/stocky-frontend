import { useQuery } from '@tanstack/react-query';
import { searchStocks, getPopularStocks } from '@/services/stockApi';
import { USE_MOCK_DATA } from '@/config/features';

/**
 * Hook that provides stock search results.
 * When query is empty, returns popular stocks.
 */
export const useStockSearch = (query: string) => {
  return useQuery({
    queryKey: ['stockSearch', query],
    queryFn: () => (query.trim() ? searchStocks(query) : getPopularStocks()),
    // Mock data doesn't need refetching
    staleTime: USE_MOCK_DATA ? Infinity : 30_000,
    // Keep previous results while typing
    placeholderData: (prev) => prev,
  });
};

