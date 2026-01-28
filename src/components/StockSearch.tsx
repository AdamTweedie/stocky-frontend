import { useState, useMemo } from 'react';
import { Search, Plus, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Stock } from '@/types/stock';
import { popularStocks } from '@/data/mockData';

interface StockSearchProps {
  onAddStock: (stock: Stock) => void;
  isInWatchlist: (symbol: string) => boolean;
}

const StockSearch = ({ onAddStock, isInWatchlist }: StockSearchProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const filteredStocks = useMemo(() => {
    if (!query.trim()) return popularStocks;
    
    const lowerQuery = query.toLowerCase();
    return popularStocks.filter(
      stock =>
        stock.symbol.toLowerCase().includes(lowerQuery) ||
        stock.name.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  const showResults = isFocused && filteredStocks.length > 0;

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
          {filteredStocks.map((stock) => {
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
          })}
        </div>
      )}
    </div>
  );
};

export default StockSearch;
