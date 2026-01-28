import { ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { NewsArticle } from '@/types/stock';
import { formatDistanceToNow } from 'date-fns';

interface NewsCardProps {
  article: NewsArticle;
  index: number;
}

const NewsCard = ({ article, index }: NewsCardProps) => {
  const getSentimentIcon = () => {
    switch (article.sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getSentimentBg = () => {
    switch (article.sentiment) {
      case 'positive':
        return 'bg-success/10 border-success/20';
      case 'negative':
        return 'bg-destructive/10 border-destructive/20';
      default:
        return 'bg-muted border-border';
    }
  };

  return (
    <article
      className="glass-card p-5 news-card-hover animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <span className="stock-ticker text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
            {article.stockSymbol}
          </span>
          <span className="text-xs text-muted-foreground">{article.source}</span>
        </div>
        <div className={`p-1.5 rounded-md border ${getSentimentBg()}`}>
          {getSentimentIcon()}
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2 leading-tight hover:text-primary transition-colors">
        {article.title}
      </h3>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {article.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
        </span>
        <a
          href={article.url}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read more
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </article>
  );
};

export default NewsCard;
