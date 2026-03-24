import { useMemo, useState, useCallback } from 'react';
import { Sparkles, RefreshCw, Bot, ArrowUpDown } from 'lucide-react';
import { Stock, NewsArticle, NewsCategory } from '@/types/stock';
import { useStockNews } from '@/hooks/useStockNews';
import LatestNewsSidebar from './LatestNewsSidebar';
import FocusSection from './FocusSection';
import FeaturedNewsCard from './FeaturedNewsCard';
import SecondaryNewsRow from './SecondaryNewsRow';
import NewsDetailDialog from './NewsDetailDialog';
import AiStockSummaryDialog from './AiStockSummaryDialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NewsFeedProps {
  watchlist: Stock[];
}

const NewsFeed = ({ watchlist }: NewsFeedProps) => {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | null>(null);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aiSummaryOpen, setAiSummaryOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('date');
  const [filterStock, setFilterStock] = useState<string>('all');
  const [filterSentiment, setFilterSentiment] = useState<string>('all');

  const symbols = useMemo(() => watchlist.map((s) => s.symbol), [watchlist]);
  const { data: allNews = [], isLoading, refetch } = useStockNews(symbols);

  const handleArticleClick = useCallback((article: NewsArticle) => {
    setSelectedArticle(article);
    setDialogOpen(true);
  }, []);

  // Filtered and sorted news
  const shuffledMainNews = useMemo(() => {
    let filtered = selectedCategory 
      ? allNews.filter((article) => article.category === selectedCategory)
      : [...allNews];

    // Filter by stock
    if (filterStock !== 'all') {
      filtered = filtered.filter((a) => a.stockSymbol === filterStock);
    }

    // Filter by sentiment
    if (filterSentiment !== 'all') {
      filtered = filtered.filter((a) => a.sentiment === filterSentiment);
    }

    // Sort
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortBy === 'stock') {
      filtered.sort((a, b) => a.stockSymbol.localeCompare(b.stockSymbol));
    } else if (sortBy === 'sentiment') {
      const order = { positive: 0, neutral: 1, negative: 2 };
      filtered.sort((a, b) => (order[a.sentiment ?? 'neutral'] ?? 1) - (order[b.sentiment ?? 'neutral'] ?? 1));
    } else if (sortBy === 'industry') {
      filtered.sort((a, b) => (a.category ?? '').localeCompare(b.category ?? ''));
    }

    // Shuffle on top if requested
    if (shuffleKey > 0 && sortBy === 'date') {
      for (let i = filtered.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
      }
    }
    
    return filtered;
  }, [allNews, selectedCategory, shuffleKey, sortBy, filterStock, filterSentiment]);

  const handleRefresh = useCallback(() => {
    setIsShaking(true);
    setShuffleKey((prev) => prev + 1);
    // Also refetch from API when not using mock data
    refetch();
    
    setTimeout(() => {
      setIsShaking(false);
    }, 500);
  }, [refetch]);

  // Show more articles - split for layout
  const featuredArticle = shuffledMainNews[0];
  const secondFeatured = shuffledMainNews[1];
  const thirdFeatured = shuffledMainNews[2];
  const fourthFeatured = shuffledMainNews[3];
  const secondaryArticles = shuffledMainNews.slice(4, 7);
  const additionalFeatured = shuffledMainNews.slice(7, 13);
  const sidebarArticles = allNews;

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="md:col-span-2 h-64 rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-[7.5rem] rounded-xl" />
              <Skeleton className="h-[7.5rem] rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        </div>
        <div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Main Content Area - 3 columns */}
      <div className="lg:col-span-3 space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[130px] h-9 text-xs border-border/50">
                <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="stock">Stock</SelectItem>
                <SelectItem value="sentiment">Sentiment</SelectItem>
                <SelectItem value="industry">Industry</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStock} onValueChange={setFilterStock}>
              <SelectTrigger className="w-[130px] h-9 text-xs border-border/50">
                <SelectValue placeholder="All Stocks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stocks</SelectItem>
                {watchlist.map((s) => (
                  <SelectItem key={s.symbol} value={s.symbol}>{s.symbol}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterSentiment} onValueChange={setFilterSentiment}>
              <SelectTrigger className="w-[140px] h-9 text-xs border-border/50">
                <SelectValue placeholder="All Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiment</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAiSummaryOpen(true)}
              className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all"
            >
              <Bot className="w-4 h-4" />
              AI Summary
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isShaking ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Featured Grid - Asymmetric layout */}
        {shuffledMainNews.length > 0 && (
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${isShaking ? 'animate-shake' : ''}`}>
            {featuredArticle && (
              <div className="md:col-span-2">
                <FeaturedNewsCard article={featuredArticle} size="large" onArticleClick={handleArticleClick} />
              </div>
            )}
            <div className="space-y-4">
              {secondFeatured && (
                <FeaturedNewsCard article={secondFeatured} size="small" onArticleClick={handleArticleClick} />
              )}
              {thirdFeatured && (
                <FeaturedNewsCard article={thirdFeatured} size="small" onArticleClick={handleArticleClick} />
              )}
            </div>
          </div>
        )}

        {/* Secondary Row */}
        {secondaryArticles.length > 0 && (
          <div className={isShaking ? 'animate-shake' : ''}>
            <SecondaryNewsRow articles={secondaryArticles} onArticleClick={handleArticleClick} />
          </div>
        )}

        {/* Third featured section */}
        {fourthFeatured && shuffledMainNews.length > 4 && (
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border/30 pt-6 ${isShaking ? 'animate-shake' : ''}`}>
            <FeaturedNewsCard article={fourthFeatured} size="medium" onArticleClick={handleArticleClick} />
            {shuffledMainNews[5] && (
              <div className="space-y-4">
                <FeaturedNewsCard article={shuffledMainNews[5]} size="small" onArticleClick={handleArticleClick} />
                {shuffledMainNews[6] && (
                  <FeaturedNewsCard article={shuffledMainNews[6]} size="small" onArticleClick={handleArticleClick} />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-8">
        <div className="glass-card p-4">
          <LatestNewsSidebar articles={sidebarArticles} onArticleClick={handleArticleClick} />
        </div>
        <div className="glass-card p-4">
          <FocusSection 
            selectedCategory={selectedCategory} 
            onCategorySelect={setSelectedCategory}
          />
        </div>
      </div>

      <NewsDetailDialog
        article={selectedArticle}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <AiStockSummaryDialog
        open={aiSummaryOpen}
        onOpenChange={setAiSummaryOpen}
        stocks={watchlist}
      />
    </div>
  );
};

export default NewsFeed;
