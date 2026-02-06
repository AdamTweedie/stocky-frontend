import { useQuery } from '@tanstack/react-query';
import { getAggregatedNews } from '@/services/stockApi';
import { USE_MOCK_DATA } from '@/config/features';

/**
 * Hook that fetches aggregated news for a list of stock symbols.
 */
export const useStockNews = (symbols: string[]) => {
  return useQuery({
    queryKey: ['stockNews', ...symbols],
    queryFn: () => getAggregatedNews(symbols),
    enabled: symbols.length > 0,
    staleTime: USE_MOCK_DATA ? Infinity : 60_000,
  });
};
