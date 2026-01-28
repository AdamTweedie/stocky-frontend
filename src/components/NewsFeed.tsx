import { useMemo } from 'react';
import { Newspaper, Sparkles } from 'lucide-react';
import NewsCard from './NewsCard';
import { Stock, NewsArticle } from '@/types/stock';
import { generateMockNews } from '@/data/mockData';

interface NewsFeedProps {
  watchlist: Stock[];
  activeStock: string | null;
}

const NewsFeed = ({ watchlist, activeStock }: NewsFeedProps) => {
  const news = useMemo(() => {
    if (watchlist.length === 0) return [];

    let articles: NewsArticle[] = [];

    if (activeStock) {
      articles = generateMockNews(activeStock);
    } else {
      watchlist.forEach((stock) => {
        articles.push(...generateMockNews(stock.symbol).slice(0, 2));
      });
    }

    return articles.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [watchlist, activeStock]);

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
      <div className="flex items-center gap-2 mb-6">
        <Newspaper className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">
          {activeStock ? `${activeStock} News` : 'Latest Headlines'}
        </h2>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {news.length} articles
        </span>
      </div>

      <div className="grid gap-4">
        {news.map((article, index) => (
          <NewsCard key={article.id} article={article} index={index} />
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
