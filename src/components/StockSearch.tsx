import { useState } from 'react';
import { Search, Plus, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Stock } from '@/types/stock';
import { useStockSearch } from '@/hooks/useStockSearch';
import { Skeleton } from '@/components/ui/skeleton';

interface StockSearchProps {
  onAddStock: (stock: Stock) => void;
  isInWatchlist: (symbol: string) => boolean;
}

const StockSearch = ({ onAddStock, isInWatchlist }: StockSearchProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const { data: filteredStocks = [], isLoading } = useStockSearch(query);

  const showResults = isFocused && (filteredStocks.length > 0 || isLoading);

  return (
    <div className="relative w-full max-w-xl mx-auto z-50">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search stocks by symbol or name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-12 pr-4 py-6 text-base bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
        />
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card p-2 max-h-80 overflow-y-auto z-50 animate-fade-in">
          {isLoading ? (
            <div className="space-y-2 p-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              ))}
            </div>
          ) : (
            filteredStocks.map((stock) => {
              const inWatchlist = isInWatchlist(stock.symbol);
              return (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => !inWatchlist && onAddStock(stock)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="stock-ticker font-semibold text-primary">
                        {stock.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium stock-ticker">{stock.symbol}</p>
                      <p className="text-sm text-muted-foreground">{stock.name}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={inWatchlist ? "secondary" : "default"}
                    className="gap-1.5"
                    disabled={inWatchlist}
                  >
                    {inWatchlist ? (
                      <>
                        <Check className="w-4 h-4" />
                        Added
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default StockSearch;
