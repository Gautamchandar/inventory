'use client';

import React, { useState } from 'react';
import { Product, AdjustmentReason, LogType } from '@/types/inventory';
import { X, AlertCircle, Plus, Minus, Edit3, ShieldAlert, Check, Zap } from 'lucide-react';
import { check60DayExpiry, getDaysRemaining } from '@/lib/alerts';

interface StockAdjustModalProps {
  product: Product | null;
  initialType: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT';
  onClose: () => void;
  onSubmit: (params: {
    productId: string;
    batchNumber: string;
    expiryDate: string;
    type: LogType;
    quantityChange: number;
    reason: AdjustmentReason | string;
    user: string;
  }) => Promise<void>;
}

export const StockAdjustModal: React.FC<StockAdjustModalProps> = ({
  product,
  initialType,
  onClose,
  onSubmit
}) => {
  if (!product) return null;

  const [type, setType] = useState<LogType>(initialType);
  const [quantity, setQuantity] = useState<number>(1);
  const [batchNumber, setBatchNumber] = useState<string>(
    product.batchLots[0]?.batchNumber || `LOT-${new Date().getFullYear()}-01`
  );
  const [expiryDate, setExpiryDate] = useState<string>(
    product.batchLots[0]?.expiryDate || '2027-12-31'
  );
  const [reason, setReason] = useState<AdjustmentReason>(initialType === 'STOCK_IN' ? 'Restock' : 'Damaged');
  const [user, setUser] = useState<string>('pawan508 (ADMIN)');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const qtyDelta = type === 'STOCK_OUT' ? -Math.abs(quantity) : (type === 'STOCK_IN' ? Math.abs(quantity) : quantity);
  const predictedNewStock = product.stockQuantity + qtyDelta;

  const isNegativeStock = predictedNewStock < 0;
  const isExpiringSoon = check60DayExpiry(expiryDate);
  const daysRemaining = getDaysRemaining(expiryDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNegativeStock) {
      setError(`Stock cannot drop below zero. Current stock is ${product.stockQuantity}.`);
      return;
    }
    if (quantity === 0) {
      setError('Quantity change must not be zero.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit({
        productId: product.id,
        batchNumber,
        expiryDate,
        type,
        quantityChange: qtyDelta,
        reason,
        user
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record stock adjustment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setQuickQuantity = (val: number) => {
    setQuantity(val);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase ${
                type === 'STOCK_IN' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {type === 'STOCK_IN' ? 'Add Stock (+)' : 'Delete Stock (-)'}
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mt-1">
              {product.name} ({product.size})
            </h3>
            <p className="text-xs font-mono font-bold text-blue-600">
              SKU: {product.sku} • Current Stock: {product.stockQuantity} units
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Action Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Select Action</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setType('STOCK_IN'); setReason('Restock'); }}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-extrabold transition border ${
                  type === 'STOCK_IN'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Plus className="h-4 w-4" />
                Add Stock (+)
              </button>
              <button
                type="button"
                onClick={() => { setType('STOCK_OUT'); setReason('Damaged'); }}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-extrabold transition border ${
                  type === 'STOCK_OUT'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Minus className="h-4 w-4" />
                Delete Stock (-)
              </button>
            </div>
          </div>

          {/* Quick 1-Click Quantity Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
              <span>Quick Quantity Buttons</span>
              <span className="text-[10px] text-blue-600 font-semibold">1-Click Selection</span>
            </label>
            <div className="grid grid-cols-6 gap-2">
              {[1, 5, 10, 25, 50, 100].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setQuickQuantity(val)}
                  className={`py-2 px-1 rounded-xl text-xs font-extrabold border transition ${
                    quantity === val
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {type === 'STOCK_IN' ? `+${val}` : `-${val}`}
                </button>
              ))}
            </div>
          </div>

          {/* Exact Quantity Input & Reason */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Exact Units</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono font-extrabold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reason / Notes</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as AdjustmentReason)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
              >
                <option value="Restock">Restock / New Arrival</option>
                <option value="Damaged">Damaged Goods</option>
                <option value="Returned">Customer Return</option>
                <option value="Sample">Salon Sample / Tester</option>
                <option value="Inventory Audit">Inventory Audit Adjustment</option>
                <option value="Sale">Direct Sale</option>
              </select>
            </div>
          </div>

          {/* Logged User */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Staff / Admin Username</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="pawan508 (ADMIN) or hbtxstaff (STAFF)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              required
            />
          </div>

          {/* Stock Result Preview */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold ${
            isNegativeStock
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-slate-100 border-slate-200 text-slate-900'
          }`}>
            <span>Resulting Stock:</span>
            <span className="font-mono text-base">
              {product.stockQuantity} &rarr; <strong className={isNegativeStock ? 'text-rose-600 font-extrabold' : 'text-emerald-700 font-extrabold'}>{predictedNewStock}</strong> units
            </span>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 font-bold">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isNegativeStock}
              className={`flex items-center gap-1.5 px-6 py-3 rounded-xl text-xs font-extrabold text-white transition shadow-md disabled:opacity-50 ${
                type === 'STOCK_IN' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              <Check className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : (type === 'STOCK_IN' ? 'Confirm Add Stock (+)' : 'Confirm Delete Stock (-)')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
