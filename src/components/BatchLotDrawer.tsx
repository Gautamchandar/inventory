'use client';

import React from 'react';
import { Product } from '@/types/inventory';
import { X, Calendar, Clock, AlertTriangle, Layers, Tag } from 'lucide-react';
import { check60DayExpiry, getDaysRemaining } from '@/lib/alerts';

interface BatchLotDrawerProps {
  product: Product | null;
  onClose: () => void;
}

export const BatchLotDrawer: React.FC<BatchLotDrawerProps> = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="glass-modal w-full max-w-md h-full border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Batch Lots & Expiry Tracking</h3>
                <p className="text-xs text-amber-400 font-semibold">{product.name} ({product.size})</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Product Overview */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 mb-6 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">SKU Code:</span>
              <span className="font-mono text-slate-200">{product.sku}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">WooCommerce Product ID:</span>
              <span className="font-mono text-slate-200">#{product.wcProductId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Live Stock:</span>
              <span className="font-bold text-emerald-400">{product.stockQuantity} units</span>
            </div>
          </div>

          {/* Lots List */}
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>Active Cosmetics Lots ({product.batchLots.length})</span>
            <span className="text-[10px] text-amber-400 font-normal">FIFO Order</span>
          </h4>

          {product.batchLots.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-400 text-xs">
              No batch lots assigned to this product yet. Click 'Stock In' to add a new batch.
            </div>
          ) : (
            <div className="space-y-3">
              {product.batchLots.map((lot) => {
                const isExpiring = check60DayExpiry(lot.expiryDate);
                const daysLeft = getDaysRemaining(lot.expiryDate);

                return (
                  <div
                    key={lot.id}
                    className={`p-4 rounded-xl border transition ${
                      isExpiring && lot.quantity > 0
                        ? 'bg-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-900/20'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5" />
                        Batch #{lot.batchNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 text-slate-200">
                        {lot.quantity} units
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        Expires: <strong className="text-slate-200">{lot.expiryDate}</strong>
                      </span>
                      
                      {isExpiring && lot.quantity > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                          <AlertTriangle className="h-3 w-3" />
                          {daysLeft} days left!
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          ({daysLeft} days left)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 mt-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
