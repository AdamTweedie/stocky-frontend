import { useState, useMemo } from 'react';
import { X, Search, Plus, Check } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Stock } from '@/types/stock';
import { popularStocks } from '@/data/mockData';

interface EditPieDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stocks: Stock[];
  onAddStock: (stock: Stock) => void;
  onRemoveStock: (symbol: string) => void;
}

const COLORS = [
  'hsl(142, 70%, 45%)',
  'hsl(217, 91%, 60%)',
  'hsl(38, 92%, 50%)',
  'hsl(280, 65%, 60%)',
  'hsl(0, 72%, 51%)',
  'hsl(199, 89%, 48%)',
  'hsl(330, 80%, 60%)',
  'hsl(60, 70%, 50%)',
];

const EditPieDialog = ({ 
  open, 
  onOpenChange, 
  stocks, 
  onAddStock, 
  onRemoveStock 
}: EditPieDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const pieData = stocks.map((stock, index) => ({
    name: stock.symbol,
    value: 1,
    color: COLORS[index % COLORS.length],
  }));

  const emptyData = [{ name: 'Empty', value: 1, color: 'hsl(var(--muted))' }];
  const chartData = stocks.length > 0 ? pieData : emptyData;

  const filteredStocks = useMemo(() => {
    if (!searchQuery.trim()) return popularStocks;
    const query = searchQuery.toLowerCase();
    return popularStocks.filter(
      stock =>
        stock.symbol.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const isInWatchlist = (symbol: string) => stocks.some(s => s.symbol === symbol);

  const handleAddStock = (stock: Stock) => {
    onAddStock(stock);
    setSearchQuery('');
    setShowSearch(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-center">Edit Pie</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {/* Pie Chart */}
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={stocks.length > 1 ? 3 : 0}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{stocks.length}</span>
              <span className="text-xs text-muted-foreground">Stocks</span>
            </div>
          </div>

          {/* Add button */}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Plus className="w-4 h-4" />
            Add Stock
          </Button>

          {/* Search input */}
          {showSearch && (
            <div className="w-full space-y-2 animate-fade-in">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  autoFocus
                />
              </div>
              
              <ScrollArea className="h-40 rounded-md border">
                <div className="p-2 space-y-1">
                  {filteredStocks.map((stock) => {
                    const inList = isInWatchlist(stock.symbol);
                    return (
                      <div
                        key={stock.symbol}
                        className={`flex items-center justify-between p-2 rounded-md transition-colors ${
                          inList ? 'opacity-50' : 'hover:bg-accent cursor-pointer'
                        }`}
                        onClick={() => !inList && handleAddStock(stock)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="stock-ticker font-medium text-sm">{stock.symbol}</span>
                          <span className="text-xs text-muted-foreground">{stock.name}</span>
                        </div>
                        {inList ? (
                          <Check className="w-4 h-4 text-success" />
                        ) : (
                          <Plus className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Holdings list */}
          <div className="w-full space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Holdings ({stocks.length})</h4>
            <ScrollArea className="h-48">
              <div className="space-y-2 pr-4">
                {stocks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No stocks added yet. Click "Add Stock" to get started.
                  </p>
                ) : (
                  stocks.map((stock, index) => (
                    <div
                      key={stock.symbol}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div>
                          <span className="stock-ticker font-medium">{stock.symbol}</span>
                          <p className="text-xs text-muted-foreground">{stock.name}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onRemoveStock(stock.symbol)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPieDialog;
