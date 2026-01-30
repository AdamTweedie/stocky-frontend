import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Stock, NewsArticle, NewsCategory } from '@/types/stock';
import { generateMockNews } from '@/data/mockData';
import LatestNewsSidebar from './LatestNewsSidebar';
import FocusSection from './FocusSection';
import FeaturedNewsCard from './FeaturedNewsCard';
import SecondaryNewsRow from './SecondaryNewsRow';

interface NewsFeedProps {
  watchlist: Stock[];
}

const NewsFeed = ({ watchlist }: NewsFeedProps) => {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | null>(null);

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

  const filteredNews = useMemo(() => {
    if (!selectedCategory) return allNews;
    return allNews.filter((article) => article.category === selectedCategory);
  }, [allNews, selectedCategory]);

  // Split articles for layout
  const featuredArticle = filteredNews[0];
  const secondFeatured = filteredNews[1];
  const thirdFeatured = filteredNews[2];
  const fourthFeatured = filteredNews[3];
  const secondaryArticles = filteredNews.slice(4, 7);
  const sidebarArticles = allNews; // Sidebar always shows all news

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
        {/* Featured Grid - Asymmetric layout */}
        {filteredNews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <SecondaryNewsRow articles={secondaryArticles} />
        )}

        {/* Third featured section */}
        {fourthFeatured && filteredNews.length > 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border/30 pt-6">
            <FeaturedNewsCard article={fourthFeatured} size="medium" />
            {filteredNews[5] && (
              <div className="space-y-4">
                <FeaturedNewsCard article={filteredNews[5]} size="small" />
                {filteredNews[6] && (
                  <FeaturedNewsCard article={filteredNews[6]} size="small" />
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
