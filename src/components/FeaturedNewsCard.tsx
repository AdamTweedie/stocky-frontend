import { ExternalLink } from 'lucide-react';
import { NewsArticle } from '@/types/stock';
import { formatDistanceToNow } from 'date-fns';

interface FeaturedNewsCardProps {
  article: NewsArticle;
  size: 'large' | 'medium' | 'small';
  onArticleClick?: (article: NewsArticle) => void;
}

const FeaturedNewsCard = ({ article, size, onArticleClick }: FeaturedNewsCardProps) => {
  const isLarge = size === 'large';
  const isMedium = size === 'medium';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onArticleClick?.(article);
  };

  return (
    <article className={`group relative ${isLarge ? 'col-span-2 row-span-2' : isMedium ? 'col-span-1 row-span-2' : ''}`}>
      <button onClick={handleClick} className="block h-full w-full text-left">
        {/* Card with gradient background */}
        <div className={`h-full glass-card overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)] ${
          isLarge ? 'p-6' : isMedium ? 'p-5' : 'p-4'
        }`}>
          {/* Tags row */}
          <div className="flex items-center gap-2 mb-3">
            {article.isExclusive && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
                Exclusive
              </span>
            )}
            {article.isLive && (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-success">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Live
              </span>
            )}
            {article.category && (
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {article.category}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className={`font-bold leading-tight text-foreground group-hover:text-primary transition-colors mb-3 ${
            isLarge ? 'text-2xl md:text-3xl' : isMedium ? 'text-xl' : 'text-base'
          }`}>
            {article.title}
          </h3>

          {/* Description - only for large/medium */}
          {(isLarge || isMedium) && (
            <p className={`text-muted-foreground leading-relaxed mb-4 ${
              isLarge ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'
            }`}>
              {article.description}
            </p>
          )}

          {/* Stock badge */}
          <div className="flex items-center gap-2 mt-auto">
            <span className="stock-ticker text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
              {article.stockSymbol}
            </span>
            <span className="text-xs text-muted-foreground">
              {article.source} • {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
            </span>
          </div>

          {/* Hover arrow */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="w-4 h-4 text-primary" />
          </div>
        </div>
      </button>
    </article>
  );
};

export default FeaturedNewsCard;
