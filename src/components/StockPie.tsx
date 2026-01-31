import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Stock } from '@/types/stock';

interface StockPieProps {
  stocks: Stock[];
  onClick: () => void;
}

// Neon/tech-style colors (matching EditPieDialog)
const COLORS = [
  'hsl(150, 100%, 50%)',  // neon green
  'hsl(190, 100%, 50%)',  // neon cyan
  'hsl(280, 100%, 65%)',  // neon purple
  'hsl(320, 100%, 60%)',  // neon pink
  'hsl(45, 100%, 50%)',   // neon yellow
  'hsl(200, 100%, 55%)',  // electric blue
  'hsl(0, 100%, 60%)',    // neon red
  'hsl(260, 100%, 70%)',  // lavender neon
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
      className="relative w-36 h-36 cursor-pointer group shrink-0"
      onClick={onClick}
    >
      {/* Glow effect */}
      <div className="absolute inset-2 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all" />
      
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={58}
            outerRadius={65}
            paddingAngle={stocks.length > 1 ? 3 : 0}
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
        <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors uppercase underline underline-offset-2">Edit</span>
      </div>
    </div>
  );
};

export default StockPie;
