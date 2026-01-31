import { TrendingUp, Sun, Moon, BarChart3 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useWatchlist } from '@/hooks/useWatchlist';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { watchlist } = useWatchlist();
  const hasStocks = watchlist.length > 0;

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 glow-effect">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">StockPulse</h1>
              <p className="text-xs text-muted-foreground">Real-time market insights</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasStocks && (
              <Link to="/sentiment">
                <Button variant="ghost" size="sm" className="gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Sentiment</span>
                </Button>
              </Link>
            )}
            <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-xs font-medium text-primary">Live</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
