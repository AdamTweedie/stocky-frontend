import { useState } from 'react';
import { NewsArticle } from '@/types/stock';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface LatestNewsSidebarProps {
  articles: NewsArticle[];
  onArticleClick?: (article: NewsArticle) => void;
}

const LatestNewsSidebar = ({ articles, onArticleClick }: LatestNewsSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter articles by search query
  const filteredArticles = articles
    .filter((article) =>
      searchQuery.trim() === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      article.short_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.publish_time).getTime() - new Date(a.publish_time).getTime());



  // Show only the most recent 8 articles
  const latestArticles = filteredArticles.slice(0, 8);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-primary">Latest</h3>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9 text-sm bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
        />
      </div>
      
      <div className="space-y-0 divide-y divide-border/30">
        {latestArticles.length > 0 ? (
          latestArticles.map((article) => (
            <button
              key={article.id}
              onClick={() => onArticleClick?.(article)}
              className="flex gap-3 py-3 group hover:bg-accent/30 -mx-2 px-2 rounded transition-colors w-full text-left"
            >
              <span className="text-xs text-primary font-medium shrink-0 w-12">
                {formatDistanceToNow(new Date(article.publish_time), { addSuffix: false })}
              </span>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                {article.title}
              </span>
            </button>
          ))
        ) : (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No articles found
          </div>
        )}
      </div>
      
      <button className="flex items-center gap-1 text-xs text-primary hover:underline mt-4 ml-auto">
        See all latest
        <ExternalLink className="w-3 h-3" />
      </button>
    </div>
  );
};

export default LatestNewsSidebar;
