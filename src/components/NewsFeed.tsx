import { useMemo, useState } from 'react';
import { Newspaper, Sparkles, Clock, Flame, Filter } from 'lucide-react';
import NewsCard from './NewsCard';
import { Stock, NewsArticle } from '@/types/stock';
import { generateMockNews } from '@/data/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NewsFeedProps {
  watchlist: Stock[];
}

type SortOption = 'recent' | 'hottest' | 'stock';

const NewsFeed = ({ watchlist }: NewsFeedProps) => {
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [stockFilter, setStockFilter] = useState<string>('all');

  const allNews = useMemo(() => {
    if (watchlist.length === 0) return [];

    const articles: NewsArticle[] = [];
    watchlist.forEach((stock) => {
      articles.push(...generateMockNews(stock.symbol));
    });

    return articles;
  }, [watchlist]);

  const sortedNews = useMemo(() => {
    let filtered = [...allNews];

    // Apply stock filter
    if (stockFilter !== 'all') {
      filtered = filtered.filter((article) => article.stockSymbol === stockFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        return filtered.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      case 'hottest':
        // Simulate "hotness" by prioritizing positive sentiment and recency
        return filtered.sort((a, b) => {
          const sentimentScore = { positive: 3, neutral: 2, negative: 1 };
          const aScore = sentimentScore[a.sentiment || 'neutral'];
          const bScore = sentimentScore[b.sentiment || 'neutral'];
          if (bScore !== aScore) return bScore - aScore;
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });
      case 'stock':
        return filtered.sort((a, b) => {
          const symbolCompare = a.stockSymbol.localeCompare(b.stockSymbol);
          if (symbolCompare !== 0) return symbolCompare;
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });
      default:
        return filtered;
    }
  }, [allNews, sortBy, stockFilter]);

  if (watchlist.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Start tracking stocks</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Search and add stocks to your watchlist to see the latest news and market updates
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Latest Headlines</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {sortedNews.length} articles
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Sort Tabs */}
          <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <TabsList className="h-9">
              <TabsTrigger value="recent" className="gap-1.5 text-xs px-3">
                <Clock className="w-3.5 h-3.5" />
                Recent
              </TabsTrigger>
              <TabsTrigger value="hottest" className="gap-1.5 text-xs px-3">
                <Flame className="w-3.5 h-3.5" />
                Hottest
              </TabsTrigger>
              <TabsTrigger value="stock" className="gap-1.5 text-xs px-3">
                <Filter className="w-3.5 h-3.5" />
                By Stock
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Stock Filter */}
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-[140px] h-9 text-xs">
              <SelectValue placeholder="Filter by stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stocks</SelectItem>
              {watchlist.map((stock) => (
                <SelectItem key={stock.symbol} value={stock.symbol}>
                  {stock.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {sortedNews.map((article, index) => (
          <NewsCard key={article.id} article={article} index={index} />
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
