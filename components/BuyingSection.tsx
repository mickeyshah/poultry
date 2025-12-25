
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Package, DollarSign } from 'lucide-react';

interface Props {
  onAddBuy: (name: string, qty: number, price: number) => void;
}

const BuyingSection: React.FC<Props> = ({ onAddBuy }) => {
  const [name, setName] = useState('');
  const [qty, setQty] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    setTotal(qty * price);
  }, [qty, price]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || qty <= 0 || price <= 0) return;
    onAddBuy(name, qty, price);
    setName('');
    setQty(0);
    setPrice(0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-indigo-600 p-6 flex items-center gap-3">
        <ShoppingCart className="text-white" />
        <h3 className="text-xl font-bold text-white">Buying Entry</h3>
      </div>
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Item Name</label>
            <div className="relative">
              <Package className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mechanical Keyboard"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Quantity</label>
            <input 
              type="number" 
              value={qty || ''}
              onChange={(e) => setQty(Number(e.target.value))}
              placeholder="0"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              required
              min="1"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Price per Unit ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="number" 
                step="0.01"
                value={price || ''}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                required
                min="0.01"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Calculated Total</label>
            <div className="w-full px-4 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold rounded-xl flex items-center justify-between">
              <span>Total Cost</span>
              <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
        <button 
          type="submit"
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> 
          Record Purchase
        </button>
      </form>
    </div>
  );
};

export default BuyingSection;
