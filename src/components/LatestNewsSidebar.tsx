import { NewsArticle } from '@/types/stock';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink } from 'lucide-react';

interface LatestNewsSidebarProps {
  articles: NewsArticle[];
}

const LatestNewsSidebar = ({ articles }: LatestNewsSidebarProps) => {
  // Show only the most recent 8 articles
  const latestArticles = articles.slice(0, 8);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-primary">Latest</h3>
      </div>
      
      <div className="space-y-0 divide-y divide-border/30">
        {latestArticles.map((article) => (
          <a
            key={article.id}
            href={article.url}
            className="flex gap-3 py-3 group hover:bg-accent/30 -mx-2 px-2 rounded transition-colors"
          >
            <span className="text-xs text-primary font-medium shrink-0 w-12">
              {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: false })}
            </span>
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
              {article.title}
            </span>
          </a>
        ))}
      </div>
      
      <button className="flex items-center gap-1 text-xs text-primary hover:underline mt-4 ml-auto">
        See all latest
        <ExternalLink className="w-3 h-3" />
      </button>
    </div>
  );
};

export default LatestNewsSidebar;
