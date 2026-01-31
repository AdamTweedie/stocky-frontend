import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { StockSentimentData } from '@/data/sentimentMockData';
import { cn } from '@/lib/utils';

interface SentimentCardProps {
  data: StockSentimentData;
  isSelected?: boolean;
  onClick?: () => void;
}

const SentimentCard = ({ data, isSelected, onClick }: SentimentCardProps) => {
  const sentimentColor = useMemo(() => {
    if (data.averageSentiment > 20) return 'text-green-500';
    if (data.averageSentiment < -20) return 'text-red-500';
    return 'text-yellow-500';
  }, [data.averageSentiment]);

  const priceChangeColor = data.priceChangePercent >= 0 ? 'text-green-500' : 'text-red-500';

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment > 40) return 'Very Bullish';
    if (sentiment > 20) return 'Bullish';
    if (sentiment > -20) return 'Neutral';
    if (sentiment > -40) return 'Bearish';
    return 'Very Bearish';
  };

  const getSentimentBadgeVariant = (sentiment: number) => {
    if (sentiment > 20) return 'default';
    if (sentiment < -20) return 'destructive';
    return 'secondary';
  };

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/50',
        isSelected && 'ring-2 ring-primary border-primary'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-xl font-bold">{data.symbol}</span>
              <span className="text-sm text-muted-foreground">{data.name}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-lg font-semibold">${data.currentPrice.toFixed(2)}</span>
            <div className={cn('flex items-center gap-1 text-sm', priceChangeColor)}>
              {data.priceChangePercent >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {data.priceChangePercent >= 0 ? '+' : ''}
                {data.priceChangePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={getSentimentBadgeVariant(data.averageSentiment)}>
            {getSentimentLabel(data.averageSentiment)}
          </Badge>
          <span className={cn('text-sm font-medium', sentimentColor)}>
            Avg Sentiment: {data.averageSentiment > 0 ? '+' : ''}{data.averageSentiment}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data.dataPoints}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
                className="text-muted-foreground"
              />
              <YAxis
                yAxisId="price"
                orientation="left"
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => `$${value}`}
                className="text-muted-foreground"
              />
              <YAxis
                yAxisId="sentiment"
                orientation="right"
                domain={[-100, 100]}
                tick={{ fontSize: 10 }}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number, name: string) => {
                  if (name === 'stockPrice') return [`$${value.toFixed(2)}`, 'Stock Price'];
                  return [value, 'Sentiment'];
                }}
              />
              <Legend
                formatter={(value) => (value === 'stockPrice' ? 'Stock Price' : 'Sentiment')}
              />
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="stockPrice"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                yAxisId="sentiment"
                type="monotone"
                dataKey="sentiment"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentCard;
