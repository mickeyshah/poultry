
import React, { useState, useMemo } from 'react';
import { ShoppingCart, TrendingUp, Package, LayoutDashboard, History, Sparkles } from 'lucide-react';
import { InventoryItem, Transaction } from './types';
import BuyingSection from './components/BuyingSection';
import SellingSection from './components/SellingSection';
import InventoryTable from './components/InventoryTable';
import StatsOverview from './components/StatsOverview';
import TransactionHistory from './components/TransactionHistory';

const App: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'buying' | 'selling' | 'dashboard'>('dashboard');
  const [preselectedSellId, setPreselectedSellId] = useState<string | undefined>(undefined);

  // Business Logic: Add Buying Transaction
  const handleBuy = (itemName: string, quantity: number, pricePerUnit: number) => {
    const total = quantity * pricePerUnit;
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      itemId: itemName.toLowerCase().replace(/\s/g, '-'),
      itemName,
      type: 'BUY',
      quantity,
      pricePerUnit,
      total,
      timestamp: Date.now(),
    };

    setTransactions(prev => [newTransaction, ...prev]);

    setInventory(prev => {
      const existing = prev.find(i => i.name.toLowerCase() === itemName.toLowerCase());
      if (existing) {
        const newTotalQty = existing.quantity + quantity;
        const newTotalSpent = existing.totalSpent + total;
        return prev.map(i => 
          i.id === existing.id 
            ? { ...i, quantity: newTotalQty, totalSpent: newTotalSpent, avgBuyPrice: newTotalSpent / newTotalQty }
            : i
        );
      } else {
        return [...prev, {
          id: newTransaction.itemId,
          name: itemName,
          quantity,
          avgBuyPrice: pricePerUnit,
          totalSpent: total
        }];
      }
    });
  };

  // Business Logic: Add Selling Transaction
  const handleSell = (itemId: string, quantity: number, sellingPrice: number) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item || item.quantity < quantity) {
      alert("Insufficient stock!");
      return;
    }

    const profitPerUnit = sellingPrice - item.avgBuyPrice;
    const totalProfit = profitPerUnit * quantity;
    const total = sellingPrice * quantity;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      itemId: item.id,
      itemName: item.name,
      type: 'SELL',
      quantity,
      pricePerUnit: sellingPrice,
      total,
      timestamp: Date.now(),
      profitPerUnit,
      totalProfit,
    };

    setTransactions(prev => [newTransaction, ...prev]);

    setInventory(prev => prev.map(i => 
      i.id === itemId ? { ...i, quantity: i.quantity - quantity } : i
    ).filter(i => i.quantity >= 0));
    
    setPreselectedSellId(undefined);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm("Are you sure you want to remove this item from inventory? This won't delete transaction history.")) {
      setInventory(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleQuickSell = (id: string) => {
    setPreselectedSellId(id);
    setActiveTab('selling');
  };

  const totals = useMemo(() => {
    const revenue = transactions.filter(t => t.type === 'SELL').reduce((acc, t) => acc + (t.total || 0), 0);
    const cost = transactions.filter(t => t.type === 'BUY').reduce((acc, t) => acc + (t.total || 0), 0);
    const profit = transactions.filter(t => t.type === 'SELL').reduce((acc, t) => acc + (t.totalProfit || 0), 0);
    return { revenue, cost, profit };
  }, [transactions]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar - Desktop Only */}
      <nav className="w-full md:w-64 bg-white border-b md:border-r border-slate-200 p-6 space-y-8 sticky top-0 md:h-screen z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <TrendingUp size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-900">TradeFlow</h1>
        </div>

        <div className="space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => { setActiveTab('buying'); setPreselectedSellId(undefined); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'buying' ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <ShoppingCart size={20} /> Buying
          </button>
          <button 
            onClick={() => setActiveTab('selling')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'selling' ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <History size={20} /> Selling
          </button>
        </div>

        <div className="pt-8 border-t border-slate-100 hidden md:block">
          <div className="bg-indigo-900 text-white p-4 rounded-xl relative overflow-hidden">
            <Sparkles className="absolute -right-2 -top-2 opacity-20" size={60} />
            <p className="text-xs font-medium uppercase tracking-wider opacity-60">Pro Tip</p>
            <p className="text-sm mt-1 leading-relaxed">Use AI Insights in the Selling section to maximize your profits based on real market data.</p>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {activeTab === 'dashboard' && 'Market Dashboard'}
              {activeTab === 'buying' && 'Stock Procurement'}
              {activeTab === 'selling' && 'Sales Management'}
            </h2>
            <p className="text-slate-500 mt-1">
              {activeTab === 'dashboard' && 'Real-time overview of your trading activity'}
              {activeTab === 'buying' && 'Add new items to your inventory'}
              {activeTab === 'selling' && 'Record sales and track profitability'}
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-slate-600">Live Market Feed</span>
             </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3">
              <StatsOverview revenue={totals.revenue} cost={totals.cost} profit={totals.profit} />
            </div>
            <div className="lg:col-span-2">
              <InventoryTable 
                inventory={inventory} 
                onDelete={handleDeleteItem} 
                onSell={handleQuickSell}
              />
            </div>
            <div className="lg:col-span-1">
              <TransactionHistory transactions={transactions.slice(0, 10)} />
            </div>
          </div>
        )}

        {activeTab === 'buying' && (
          <div className="max-w-4xl mx-auto">
            <BuyingSection onAddBuy={handleBuy} />
          </div>
        )}

        {activeTab === 'selling' && (
          <div className="max-w-4xl mx-auto">
            <SellingSection 
              inventory={inventory} 
              onAddSell={handleSell} 
              preselectedId={preselectedSellId}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
