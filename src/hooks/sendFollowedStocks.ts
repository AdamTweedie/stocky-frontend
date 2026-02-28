import { useQuery } from '@tanstack/react-query';
import { postFollowedStocks } from '@/services/stockApi';

/**
 * Hook that fetches aggregated news for a list of stock symbols.
 */
export const sendFollowedStocks = (symbols: string[]) => {
  return useQuery({
    queryKey: ['followedStocks', ...symbols],
    queryFn: () => postFollowedStocks(symbols),
  });
};
