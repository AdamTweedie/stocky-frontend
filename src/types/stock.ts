export interface Stock {
  symbol: string;
  name: string | null;
  currencyCode: string | null;
  type: string | null;
  industry: string | null;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  inFreeTier: boolean | null;
  inUse: boolean | null;
}

export interface NewsArticle {
  // always present
  id: number;
  short_name: string;
  source: string;
  publish_time: string;
  url: string;
  title: string;

  // nullable
  source_url: string | null;
  source_country: string | null;
  source_type: string | null;
  lang: string | null;
  image: string | null;
  description: string | null;
  sentiment: number | null;   // float in TypeScript is just number
  ai_summary: string | null;
}

export type Tier = "free" | "pro" | "enterprise";
export type TierStatus = "active" | "cancelled" | "past_due" | "paused";

export interface User {
  id: number;
  email: string;
  name: string | null;
  avatar_url: string | null;
  email_verified: boolean;
  tier: Tier;
  tier_status: TierStatus;
  subscription_start: string | null;
  subscription_renewal: string | null;
  subscription_end: string | null;
  is_active: boolean;
  is_admin: boolean;
}

export interface TokenUsage {
  used: number;
  limit: number;
  remaining: number;
  reset_at: string | null;
}

export interface Subscription {
  tier: Tier;
  tier_status: TierStatus;
  subscription_id: string | null;
  subscription_start: string | null;
  subscription_renewal: string | null;
  subscription_end: string | null;
}

export interface SentimentHistory {
  short_name: string;
  date: string;
  avg_sentiment: number | null;
  article_count: number;
  positive_count: number;
  negative_count: number;
  neutral_count: number;
}

export interface AISummary {
    short_name: string
    summary: string
    articles_used: number
    tokens_in: number
    tokens_out: number
}

// API list response wrappers
export interface StockListResponse {
  results: Stock[];
}

export interface NewsListResponse {
  results: NewsArticle[];
}

export interface SentimentListResponse {
  results: SentimentHistory[];
}