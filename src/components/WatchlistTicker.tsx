import { useEffect, useState, useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Stock } from '@/types/stock';

interface WatchlistTickerProps {
  stocks: Stock[];
}

const WatchlistTicker = ({ stocks }: WatchlistTickerProps) => {
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stocks.length <= 3) return;

    const interval = setInterval(() => {
      if (contentRef.current && containerRef.current) {
        const contentWidth = contentRef.current.scrollWidth / 2;
        setOffset((prev) => {
          const next = prev + 1;
          return next >= contentWidth ? 0 : next;
        });
      }
    }, 30);

    return () => clearInterval(interval);
  }, [stocks.length]);

  if (stocks.length === 0) return null;

  // Duplicate stocks for seamless loop
  const displayStocks = stocks.length > 3 ? [...stocks, ...stocks] : stocks;

  return (
    <div 
      ref={containerRef}
      className="overflow-hidden glass-card py-3 px-4"
    >
      <div
        ref={contentRef}
        className="flex gap-4 transition-none"
        style={{ 
          transform: stocks.length > 3 ? `translateX(-${offset}px)` : 'none',
          width: 'fit-content'
        }}
      >
        {displayStocks.map((stock, index) => {
          const isPositive = (stock.change ?? 0) >= 0;
          return (
            <div
              key={`${stock.symbol}-${index}`}
              className="flex items-center gap-3 px-4 py-2 bg-secondary/50 rounded-lg shrink-0"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                  <span className="stock-ticker text-xs font-semibold text-primary">
                    {stock.symbol.slice(0, 2)}
                  </span>
                </div>
                <span className="stock-ticker font-semibold text-sm">{stock.symbol}</span>
              </div>
              
              <span className="text-sm font-mono text-muted-foreground">
                ${stock.price?.toFixed(2)}
              </span>
              
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
                  isPositive ? 'text-success' : 'text-destructive'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>
                  {isPositive ? '+' : ''}
                  {stock.changePercent?.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WatchlistTicker;
