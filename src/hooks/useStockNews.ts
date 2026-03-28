import { useQuery } from '@tanstack/react-query';
import { getMultipleStockNews } from '@/services/newsApi';

export const useStockNews = (symbols: string[]) => {
  return useQuery({
    queryKey: ['stockNews', ...symbols],
    queryFn: () => getMultipleStockNews(symbols),
    enabled: symbols.length > 0,
    staleTime: 60_000,
  });
};