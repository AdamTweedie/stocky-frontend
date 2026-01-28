import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Stock } from '@/types/stock';

interface WatchlistCardProps {
  stock: Stock;
  onRemove: (symbol: string) => void;
  isActive: boolean;
  onClick: () => void;
}

const WatchlistCard = ({ stock, onRemove, isActive, onClick }: WatchlistCardProps) => {
  const isPositive = (stock.change ?? 0) >= 0;

  return (
    <div
      className={`glass-card p-4 cursor-pointer transition-all duration-300 ${
        isActive
          ? 'border-primary/50 glow-effect'
          : 'hover:border-primary/30'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="stock-ticker text-xs font-semibold text-primary">
              {stock.symbol.slice(0, 2)}
            </span>
          </div>
          <div>
            <p className="stock-ticker font-semibold">{stock.symbol}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[100px]">
              {stock.name}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(stock.symbol);
          }}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-end justify-between">
        <p className="text-lg font-semibold font-mono">
          ${stock.price?.toFixed(2)}
        </p>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            isPositive ? 'text-success' : 'text-destructive'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>
            {isPositive ? '+' : ''}
            {stock.changePercent?.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default WatchlistCard;
