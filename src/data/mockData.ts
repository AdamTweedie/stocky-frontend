import { Stock, NewsArticle } from '@/types/stock';

export const popularStocks: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.72, change: 2.34, changePercent: 1.33 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: -0.95, changePercent: -0.67 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.91, change: 4.12, changePercent: 1.10 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.25, change: 1.89, changePercent: 1.07 },
  { symbol: 'TSLA', name: 'Tesla, Inc.', price: 248.50, change: -3.22, changePercent: -1.28 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.28, change: 12.45, changePercent: 1.44 },
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 505.95, change: 8.30, changePercent: 1.67 },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 198.45, change: 1.25, changePercent: 0.63 },
];

export const generateMockNews = (symbol: string): NewsArticle[] => {
  const stockData = popularStocks.find(s => s.symbol === symbol);
  const companyName = stockData?.name || symbol;
  
  const newsTemplates = [
    {
      title: `${companyName} Reports Strong Q4 Earnings, Beats Analyst Expectations`,
      description: `${companyName} announced quarterly results that exceeded Wall Street estimates, driven by robust demand across key product segments.`,
      sentiment: 'positive' as const,
    },
    {
      title: `Analysts Upgrade ${symbol} Stock Following Product Launch Announcement`,
      description: `Several major investment banks have raised their price targets for ${symbol} after the company revealed plans for new product innovations.`,
      sentiment: 'positive' as const,
    },
    {
      title: `${companyName} Faces Regulatory Scrutiny in European Markets`,
      description: `EU regulators have opened an investigation into ${companyName}'s business practices, potentially impacting future operations in the region.`,
      sentiment: 'negative' as const,
    },
    {
      title: `${symbol} Stock Holds Steady Amid Market Volatility`,
      description: `Despite broader market fluctuations, ${companyName} shares have shown resilience, maintaining key support levels.`,
      sentiment: 'neutral' as const,
    },
    {
      title: `${companyName} Announces Strategic Partnership with Tech Giant`,
      description: `In a move to expand its market reach, ${companyName} has entered into a multi-year partnership agreement that could boost revenue.`,
      sentiment: 'positive' as const,
    },
  ];

  const sources = ['Bloomberg', 'Reuters', 'CNBC', 'MarketWatch', 'The Wall Street Journal'];
  
  return newsTemplates.map((template, index) => ({
    id: `${symbol}-${index}`,
    title: template.title,
    description: template.description,
    source: sources[index % sources.length],
    url: '#',
    publishedAt: new Date(Date.now() - index * 3600000 * (index + 1)).toISOString(),
    stockSymbol: symbol,
    sentiment: template.sentiment,
  }));
};
