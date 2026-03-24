export interface Stock {
  symbol: string;
  name: string;
  price?: number;
  change?: number;
  changePercent?: number;
}

export type NewsCategory = 'Tech' | 'Finance' | 'Healthcare' | 'Energy' | 'Retail' | 'Auto' | 'Media';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
  stockSymbol: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  category?: NewsCategory;
  isExclusive?: boolean;
  isLive?: boolean;
  imageUrl?: string;
}
