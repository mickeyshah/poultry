
import React from 'react';
import { Transaction } from '../types';
import { ShoppingBag, Tag, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface Props {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<Props> = ({ transactions }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Recent Activity</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            Recent activity will appear here.
          </div>
        ) : (
          <div className="space-y-1">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.type === 'BUY' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {tx.type === 'BUY' ? <ShoppingBag size={18} /> : <Tag size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-none">{tx.itemName}</p>
                    <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-tight font-medium">
                      {tx.type === 'BUY' ? 'Purchased' : 'Sold'} • {tx.quantity} units
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.type === 'BUY' ? 'text-slate-900' : 'text-emerald-600'}`}>
                    {tx.type === 'BUY' ? '-' : '+'}${tx.total.toLocaleString()}
                  </p>
                  {tx.type === 'SELL' && (
                    <p className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
                      +${tx.totalProfit?.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <button className="m-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100">
        View Full History
      </button>
    </div>
  );
};

export default TransactionHistory;
