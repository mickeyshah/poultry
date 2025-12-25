
import React from 'react';
import { Package, Trash2, AlertCircle, Tag } from 'lucide-react';
import { InventoryItem } from '../types';

interface Props {
  inventory: InventoryItem[];
  onDelete: (id: string) => void;
  onSell: (id: string) => void;
}

const InventoryTable: React.FC<Props> = ({ inventory, onDelete, onSell }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="text-indigo-600" size={24} />
          <h3 className="font-bold text-slate-900">Current Inventory</h3>
        </div>
        <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-bold">
          {inventory.length} SKUs
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Item Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Avg. Buy Price</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Investment</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inventory.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle size={32} strokeWidth={1.5} />
                    <p>No inventory found. Start by buying some stock!</p>
                  </div>
                </td>
              </tr>
            ) : (
              inventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">{item.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${item.quantity < 5 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                      {item.quantity} units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    ${item.avgBuyPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    ${item.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onSell(item.id)}
                        title="Quick Sell"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-all"
                      >
                        <Tag size={14} />
                        <span>Sell</span>
                      </button>
                      <button 
                        onClick={() => onDelete(item.id)}
                        title="Delete Item"
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
