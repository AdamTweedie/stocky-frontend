import { NewsArticle } from '@/types/stock';

interface SecondaryNewsRowProps {
  articles: NewsArticle[];
  onArticleClick?: (article: NewsArticle) => void;
}

const SecondaryNewsRow = ({ articles, onArticleClick }: SecondaryNewsRowProps) => {
  // Take 3 articles for the secondary row
  const displayArticles = articles.slice(0, 3);

  if (displayArticles.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border/30 pt-6">
      {displayArticles.map((article) => (
        <button
          key={article.id}
          onClick={() => onArticleClick?.(article)}
          className="group text-left"
        >
          <div className="space-y-2">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {article.category || 'Markets'}
            </span>
            <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">
              {article.title}
            </h4>
          </div>
        </button>
      ))}
    </div>
  );
};

export default SecondaryNewsRow;
