import { Stock } from '@/types/stock';

export interface SentimentDataPoint {
  date: string;
  stockPrice: number;
  sentiment: number; // -100 to 100
}

export interface StockSentimentData {
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  averageSentiment: number;
  dataPoints: SentimentDataPoint[];
}

const generateMockDataPoints = (
  symbol: string,
  basePrice: number,
  days: number
): SentimentDataPoint[] => {
  const dataPoints: SentimentDataPoint[] = [];
  let price = basePrice * 0.9;
  let sentiment = Math.random() * 40 - 20;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Add some correlation between sentiment and price changes
    const sentimentChange = (Math.random() - 0.5) * 30;
    sentiment = Math.max(-100, Math.min(100, sentiment + sentimentChange));

    // Price tends to follow sentiment with some noise
    const priceChange = (sentiment / 100) * 0.02 + (Math.random() - 0.5) * 0.03;
    price = price * (1 + priceChange);

    dataPoints.push({
      date: date.toISOString().split('T')[0],
      stockPrice: Math.round(price * 100) / 100,
      sentiment: Math.round(sentiment),
    });
  }

  return dataPoints;
};

const stockBaseData: Record<string, { name: string; basePrice: number }> = {
  AAPL: { name: 'Apple Inc.', basePrice: 178.72 },
  GOOGL: { name: 'Alphabet Inc.', basePrice: 141.80 },
  MSFT: { name: 'Microsoft Corporation', basePrice: 378.91 },
  AMZN: { name: 'Amazon.com Inc.', basePrice: 178.25 },
  TSLA: { name: 'Tesla, Inc.', basePrice: 248.50 },
  NVDA: { name: 'NVIDIA Corporation', basePrice: 875.28 },
  META: { name: 'Meta Platforms Inc.', basePrice: 505.95 },
  JPM: { name: 'JPMorgan Chase & Co.', basePrice: 198.45 },
};

export const generateSentimentData = (
  stocks: Stock[],
  days: number = 30
): StockSentimentData[] => {
  return stocks.map((stock) => {
    const baseData = stockBaseData[stock.symbol] || {
      name: stock.name,
      basePrice: stock.price || 100,
    };
    
    const dataPoints = generateMockDataPoints(stock.symbol, baseData.basePrice, days);
    const lastPoint = dataPoints[dataPoints.length - 1];
    const firstPoint = dataPoints[0];
    const priceChange = lastPoint.stockPrice - firstPoint.stockPrice;
    const priceChangePercent = (priceChange / firstPoint.stockPrice) * 100;
    const averageSentiment =
      dataPoints.reduce((sum, p) => sum + p.sentiment, 0) / dataPoints.length;

    return {
      symbol: stock.symbol,
      name: baseData.name,
      currentPrice: lastPoint.stockPrice,
      priceChange,
      priceChangePercent,
      averageSentiment: Math.round(averageSentiment),
      dataPoints,
    };
  });
};

export type TimeframeOption = '1W' | '1M' | '3M' | '6M' | '1Y';

export const timeframeToDays: Record<TimeframeOption, number> = {
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '6M': 180,
  '1Y': 365,
};
