
import React from 'react';
import { DollarSign, ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';

interface Props {
  revenue: number;
  cost: number;
  profit: number;
}

const StatsOverview: React.FC<Props> = ({ revenue, cost, profit }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
        </div>
        <p className="text-3xl font-bold text-slate-900">${revenue.toLocaleString()}</p>
        <div className="mt-2 flex items-center gap-1 text-emerald-600 font-medium text-sm">
          <ArrowUpRight size={16} />
          <span>Inflow</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Wallet size={24} />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Expenses</span>
        </div>
        <p className="text-3xl font-bold text-slate-900">${cost.toLocaleString()}</p>
        <div className="mt-2 flex items-center gap-1 text-amber-600 font-medium text-sm">
          <ArrowDownRight size={16} />
          <span>Outflow</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-900 shadow-xl shadow-slate-200 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <TrendingUp size={24} />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Profit</span>
        </div>
        <p className="text-3xl font-bold text-slate-900">${profit.toLocaleString()}</p>
        <div className="mt-2 flex items-center gap-1 text-indigo-600 font-medium text-sm">
          <ArrowUpRight size={16} />
          <span>Growth</span>
        </div>
      </div>
    </div>
  );
};

const TrendingUp = ({ size, className }: { size?: number; className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

export default StatsOverview;
