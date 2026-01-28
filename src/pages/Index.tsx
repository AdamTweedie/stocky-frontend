import { useState } from 'react';
import Header from '@/components/Header';
import StockSearch from '@/components/StockSearch';
import Watchlist from '@/components/Watchlist';
import NewsFeed from '@/components/NewsFeed';
import { useWatchlist } from '@/hooks/useWatchlist';

const Index = () => {
  const { watchlist, addStock, removeStock, isInWatchlist } = useWatchlist();
  const [activeStock, setActiveStock] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
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

        {/* Watchlist Section */}
        <section className="mb-10 animate-slide-up relative z-10" style={{ animationDelay: '100ms' }}>
          <Watchlist
            stocks={watchlist}
            onRemove={removeStock}
            activeStock={activeStock}
            onSelectStock={setActiveStock}
          />
        </section>

        {/* News Feed Section */}
        <section className="animate-slide-up relative z-0" style={{ animationDelay: '200ms' }}>
          <NewsFeed watchlist={watchlist} activeStock={activeStock} />
        </section>
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

export default Index;
