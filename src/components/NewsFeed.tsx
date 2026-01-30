import { useMemo, useState, useCallback } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Stock, NewsArticle, NewsCategory } from '@/types/stock';
import { generateMockNews } from '@/data/mockData';
import LatestNewsSidebar from './LatestNewsSidebar';
import FocusSection from './FocusSection';
import FeaturedNewsCard from './FeaturedNewsCard';
import SecondaryNewsRow from './SecondaryNewsRow';
import { Button } from '@/components/ui/button';

interface NewsFeedProps {
  watchlist: Stock[];
}

const NewsFeed = ({ watchlist }: NewsFeedProps) => {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | null>(null);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  const allNews = useMemo(() => {
    if (watchlist.length === 0) return [];

    const articles: NewsArticle[] = [];
    watchlist.forEach((stock) => {
      articles.push(...generateMockNews(stock.symbol));
    });

    // Sort by date (most recent first)
    return articles.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [watchlist]);

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
    
    // Remove shake class after animation completes
    setTimeout(() => {
      setIsShaking(false);
    }, 500);
  }, []);

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Main Content Area - 3 columns */}
      <div className="lg:col-span-3 space-y-6">
        {/* Refresh Button */}
        <div className="flex justify-end">
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
            {/* Large featured article */}
            {featuredArticle && (
              <div className="md:col-span-2">
                <FeaturedNewsCard article={featuredArticle} size="large" />
              </div>
            )}
            
            {/* Stacked smaller articles on the right */}
            <div className="space-y-4">
              {secondFeatured && (
                <FeaturedNewsCard article={secondFeatured} size="small" />
              )}
              {thirdFeatured && (
                <FeaturedNewsCard article={thirdFeatured} size="small" />
              )}
            </div>
          </div>
        )}

        {/* Secondary Row - 3 equal columns */}
        {secondaryArticles.length > 0 && (
          <div className={isShaking ? 'animate-shake' : ''}>
            <SecondaryNewsRow articles={secondaryArticles} />
          </div>
        )}

        {/* Third featured section */}
        {fourthFeatured && shuffledMainNews.length > 4 && (
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border/30 pt-6 ${isShaking ? 'animate-shake' : ''}`}>
            <FeaturedNewsCard article={fourthFeatured} size="medium" />
            {shuffledMainNews[5] && (
              <div className="space-y-4">
                <FeaturedNewsCard article={shuffledMainNews[5]} size="small" />
                {shuffledMainNews[6] && (
                  <FeaturedNewsCard article={shuffledMainNews[6]} size="small" />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sidebar - 1 column */}
      <div className="space-y-8">
        {/* Latest News */}
        <div className="glass-card p-4">
          <LatestNewsSidebar articles={sidebarArticles} />
        </div>

        {/* In Focus Section */}
        <div className="glass-card p-4">
          <FocusSection 
            selectedCategory={selectedCategory} 
            onCategorySelect={setSelectedCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
