import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import SentimentCard from '@/components/SentimentCard';
import { Button } from '@/components/ui/button';
import { useWatchlist } from '@/hooks/useWatchlist';
import {
  generateSentimentData,
  TimeframeOption,
  timeframeToDays,
} from '@/data/sentimentMockData';
import { ArrowLeft } from 'lucide-react';

const timeframeOptions: TimeframeOption[] = ['1W', '1M', '3M', '6M', '1Y'];

const Sentiment = () => {
  const navigate = useNavigate();
  const { watchlist } = useWatchlist();
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<TimeframeOption>('1M');

  // Redirect if no stocks in watchlist
  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">No Stocks to Analyze</h1>
          <p className="text-muted-foreground mb-8">
            Add some stocks to your watchlist to view sentiment analysis.
          </p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go to Home
          </Button>
        </main>
      </div>
    );
  }

  const sentimentData = useMemo(() => {
    return generateSentimentData(watchlist, timeframeToDays[timeframe]);
  }, [watchlist, timeframe]);

  // Sort: selected stock first, then alphabetically
  const sortedData = useMemo(() => {
    return [...sentimentData].sort((a, b) => {
      if (selectedStock === a.symbol) return -1;
      if (selectedStock === b.symbol) return 1;
      return a.symbol.localeCompare(b.symbol);
    });
  }, [sentimentData, selectedStock]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Sentiment Analysis</h1>
              <p className="text-muted-foreground">
                Compare stock prices with news sentiment
              </p>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Timeframe:</span>
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              {timeframeOptions.map((option) => (
                <Button
                  key={option}
                  variant={timeframe === option ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeframe(option)}
                  className="px-3"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Stock Selector Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedStock === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStock(null)}
          >
            All Stocks
          </Button>
          {watchlist.map((stock) => (
            <Button
              key={stock.symbol}
              variant={selectedStock === stock.symbol ? 'default' : 'outline'}
              size="sm"
              onClick={() =>
                setSelectedStock(selectedStock === stock.symbol ? null : stock.symbol)
              }
            >
              {stock.symbol}
            </Button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {sortedData.map((stockData) => (
            <SentimentCard
              key={stockData.symbol}
              data={stockData}
              isSelected={selectedStock === stockData.symbol}
              onClick={() =>
                setSelectedStock(
                  selectedStock === stockData.symbol ? null : stockData.symbol
                )
              }
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>StockPulse • Market data for demonstration purposes</p>
        </div>
      </footer>
    </div>
  );
};

export default Sentiment;
