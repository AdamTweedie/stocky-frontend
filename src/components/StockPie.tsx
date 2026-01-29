import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Stock } from '@/types/stock';

interface StockPieProps {
  stocks: Stock[];
  onClick: () => void;
}

// Vibrant colors for the pie segments
const COLORS = [
  'hsl(142, 70%, 45%)',   // green
  'hsl(217, 91%, 60%)',   // blue
  'hsl(38, 92%, 50%)',    // orange
  'hsl(280, 65%, 60%)',   // purple
  'hsl(0, 72%, 51%)',     // red
  'hsl(199, 89%, 48%)',   // cyan
  'hsl(330, 80%, 60%)',   // pink
  'hsl(60, 70%, 50%)',    // yellow
];

const StockPie = ({ stocks, onClick }: StockPieProps) => {
  // Create equal slices for each stock
  const data = stocks.map((stock, index) => ({
    name: stock.symbol,
    value: 1, // Equal weight for visual purposes
    color: COLORS[index % COLORS.length],
  }));

  // If no stocks, show empty ring
  const emptyData = [{ name: 'Empty', value: 1, color: 'hsl(var(--muted))' }];
  const chartData = stocks.length > 0 ? data : emptyData;

  return (
    <div 
      className="relative w-28 h-28 cursor-pointer group shrink-0"
      onClick={onClick}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={32}
            outerRadius={50}
            paddingAngle={stocks.length > 1 ? 4 : 0}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                className="transition-opacity group-hover:opacity-80"
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Your</span>
        <span className="text-xs font-bold text-foreground">News</span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Pie</span>
      </div>
      
      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute inset-0 bg-background/60 rounded-full" />
        <span className="relative text-xs font-medium text-primary">Edit</span>
      </div>
    </div>
  );
};

export default StockPie;
