import { BarChart3 } from 'lucide-react';
import WatchlistCard from './WatchlistCard';
import { Stock } from '@/types/stock';

interface WatchlistProps {
  stocks: Stock[];
  onRemove: (symbol: string) => void;
  activeStock: string | null;
  onSelectStock: (symbol: string | null) => void;
}

const Watchlist = ({ stocks, onRemove, activeStock, onSelectStock }: WatchlistProps) => {
  if (stocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Your Watchlist</h2>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {stocks.length} stocks
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {stocks.map((stock) => (
          <WatchlistCard
            key={stock.symbol}
            stock={stock}
            onRemove={onRemove}
            isActive={activeStock === stock.symbol}
            onClick={() =>
              onSelectStock(activeStock === stock.symbol ? null : stock.symbol)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
