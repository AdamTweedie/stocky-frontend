import { useState } from 'react';
import Header from '@/components/Header';
import StockSearch from '@/components/StockSearch';
import WatchlistTicker from '@/components/WatchlistTicker';
import StockPie from '@/components/StockPie';
import EditPieDialog from '@/components/EditPieDialog';
import NewsFeed from '@/components/NewsFeed';
import { useWatchlist } from '@/hooks/useWatchlist';

const Index = () => {
  const { watchlist, addStock, removeStock, isInWatchlist } = useWatchlist();
  const [editPieOpen, setEditPieOpen] = useState(false);
  const hasStocks = watchlist.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section - only show when no stocks */}
        {!hasStocks && (
          <section className="text-center mb-12 animate-fade-in relative z-40">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Track Stock News in{' '}
              <span className="gradient-text">Real-Time</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Stay ahead of the market with personalized news updates for the stocks you care about
            </p>
            
            <StockSearch onAddStock={addStock} isInWatchlist={isInWatchlist} />
          </section>
        )}

        {/* Compact Dashboard - show when stocks exist */}
        {hasStocks && (
          <section className="mb-8 animate-fade-in">
            <div className="flex items-center gap-6">
              {/* Pie Chart */}
              <StockPie stocks={watchlist} onClick={() => setEditPieOpen(true)} />
              
              {/* Rotating Ticker */}
              <div className="flex-1 min-w-0">
                <WatchlistTicker stocks={watchlist} />
              </div>
            </div>
          </section>
        )}

        {/* News Feed Section */}
        <section className="animate-slide-up relative z-0" style={{ animationDelay: hasStocks ? '0ms' : '200ms' }}>
          <NewsFeed watchlist={watchlist} />
        </section>
      </main>

      {/* Edit Pie Dialog */}
      <EditPieDialog
        open={editPieOpen}
        onOpenChange={setEditPieOpen}
        stocks={watchlist}
        onAddStock={addStock}
        onRemoveStock={removeStock}
      />

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>StockPulse • Market data for demonstration purposes</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
