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
              className="flex items-center justify-between gap-4 px-4 py-3 bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shrink-0 min-w-[200px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="stock-ticker text-xs font-bold text-primary">
                    {stock.symbol.slice(0, 2)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="stock-ticker font-semibold text-sm text-foreground">{stock.symbol}</span>
                  <span className="text-xs text-muted-foreground">${stock.price?.toFixed(2)}</span>
                </div>
              </div>
              
              <div
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  isPositive 
                    ? 'bg-success/20 text-success' 
                    : 'bg-destructive/20 text-destructive'
                }`}
              >
                {isPositive ? '+' : ''}
                {stock.changePercent?.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WatchlistTicker;
