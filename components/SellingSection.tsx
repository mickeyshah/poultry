
import React, { useState, useEffect } from 'react';
import { TrendingUp, Sparkles, Loader2, ArrowRight, DollarSign } from 'lucide-react';
import { InventoryItem, MarketInsight } from '../types';
import { getMarketAdvice } from '../services/geminiService';

interface Props {
  inventory: InventoryItem[];
  onAddSell: (itemId: string, qty: number, price: number) => void;
  preselectedId?: string;
}

const SellingSection: React.FC<Props> = ({ inventory, onAddSell, preselectedId }) => {
  const [selectedId, setSelectedId] = useState(preselectedId || '');
  const [qty, setQty] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [insight, setInsight] = useState<MarketInsight | null>(null);

  useEffect(() => {
    if (preselectedId) {
      setSelectedId(preselectedId);
    }
  }, [preselectedId]);

  const selectedItem = inventory.find(i => i.id === selectedId);
  const profitPerUnit = selectedItem ? (price - selectedItem.avgBuyPrice) : 0;
  const totalProfit = profitPerUnit * qty;

  const handleAIInsight = async () => {
    if (!selectedItem) return;
    setLoadingInsight(true);
    try {
      const result = await getMarketAdvice(selectedItem.name, selectedItem.avgBuyPrice);
      setInsight(result);
      setPrice(result.suggestedSellingPrice);
    } finally {
      setLoadingInsight(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || qty <= 0 || price <= 0) return;
    onAddSell(selectedId, qty, price);
    setSelectedId('');
    setQty(0);
    setPrice(0);
    setInsight(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-emerald-600 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-white" />
          <h3 className="text-xl font-bold text-white">Selling Entry</h3>
        </div>
        {selectedItem && (
          <button 
            type="button"
            onClick={handleAIInsight}
            disabled={loadingInsight}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all backdrop-blur-md"
          >
            {loadingInsight ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            AI Price Insight
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {insight && (
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex gap-4 animate-in slide-in-from-top-4 duration-300">
            <div className="p-2 bg-emerald-500 rounded-lg text-white self-start">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-emerald-900 text-sm leading-relaxed">
                <span className="font-bold">Recommendation:</span> {insight.reasoning}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${insight.marketTrend === 'UP' ? 'bg-emerald-200 text-emerald-800' : insight.marketTrend === 'DOWN' ? 'bg-amber-200 text-amber-800' : 'bg-slate-200 text-slate-700'}`}>
                   Trend: {insight.marketTrend}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Select Item</label>
            <select 
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              required
            >
              <option value="">-- Choose Stock --</option>
              {inventory.map(item => (
                <option key={item.id} value={item.id} disabled={item.quantity === 0}>
                  {item.name} ({item.quantity} available)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Quantity to Sell</label>
            <input 
              type="number" 
              value={qty || ''}
              onChange={(e) => setQty(Math.min(Number(e.target.value), selectedItem?.quantity || 0))}
              placeholder="0"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              required
              max={selectedItem?.quantity || 0}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Selling Price ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="number" 
                step="0.01"
                value={price || ''}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Profit Metrics</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
                <p className="text-[10px] text-emerald-600 font-bold uppercase">Per Unit</p>
                <p className={`font-bold ${profitPerUnit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                  ${profitPerUnit.toFixed(2)}
                </p>
              </div>
              <div className="px-3 py-2 bg-emerald-100 border border-emerald-200 rounded-xl">
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">Total Profit</p>
                <p className={`font-bold ${totalProfit >= 0 ? 'text-emerald-800' : 'text-red-700'}`}>
                  ${totalProfit.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2 group"
        >
          Complete Sale <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
};

export default SellingSection;
