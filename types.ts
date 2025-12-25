
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  totalSpent: number;
}

export interface Transaction {
  id: string;
  itemId: string;
  itemName: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  pricePerUnit: number;
  total: number;
  timestamp: number;
  profitPerUnit?: number;
  totalProfit?: number;
}

export interface MarketInsight {
  suggestedSellingPrice: number;
  reasoning: string;
  marketTrend: 'UP' | 'DOWN' | 'STABLE';
}
