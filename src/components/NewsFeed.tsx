import { useMemo, useState, useCallback } from 'react';
import { Sparkles, RefreshCw, Bot } from 'lucide-react';
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

  const symbols = useMemo(() => watchlist.map((s) => s.symbol), [watchlist]);
  const { data: allNews = [], isLoading, refetch } = useStockNews(symbols);

  const handleArticleClick = useCallback((article: NewsArticle) => {
    setSelectedArticle(article);
    setDialogOpen(true);
  }, []);

  // Shuffled news for main content (affected by refresh)
  const shuffledMainNews = useMemo(() => {
    const filtered = selectedCategory 
      ? allNews.filter((article) => article.category === selectedCategory)
      : [...allNews];
    
    // Shuffle the array based on shuffleKey
    if (shuffleKey > 0) {
      for (let i = filtered.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
      }
    }
    
    return filtered;
  }, [allNews, selectedCategory, shuffleKey]);

  const handleRefresh = useCallback(() => {
    setIsShaking(true);
    setShuffleKey((prev) => prev + 1);
    // Also refetch from API when not using mock data
    refetch();
    
    setTimeout(() => {
      setIsShaking(false);
    }, 500);
  }, [refetch]);

  // Split articles for layout
  const featuredArticle = shuffledMainNews[0];
  const secondFeatured = shuffledMainNews[1];
  const thirdFeatured = shuffledMainNews[2];
  const fourthFeatured = shuffledMainNews[3];
  const secondaryArticles = shuffledMainNews.slice(4, 7);
  const sidebarArticles = allNews; // Sidebar always shows all news (unaffected by refresh)

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
        {/* Refresh Button */}
        <div className="flex justify-end gap-2">
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
            Refresh News
          </Button>
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
