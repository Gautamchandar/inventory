'use client';

import React from 'react';
import { DailySummary } from '@/types/inventory';
import { Package, AlertTriangle, AlertCircle, Clock, ArrowDownRight, ArrowUpRight, ShoppingBag } from 'lucide-react';

interface SummaryCardsProps {
  summary: DailySummary;
  onFilterStatus: (status: string | null) => void;
  activeFilter: string | null;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  summary,
  onFilterStatus,
  activeFilter
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* 1. Total Stock Units */}
      <div 
        onClick={() => onFilterStatus(null)}
        className={`glass-panel p-4 rounded-xl cursor-pointer transition transform hover:-translate-y-0.5 ${
          activeFilter === null ? 'ring-2 ring-amber-500/60 bg-slate-800/90' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Total Stock</span>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Package className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-100">{summary.totalStockUnits}</span>
          <span className="text-xs text-slate-400">{summary.totalProducts} SKUs</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Across 50ml to 1000ml sizes</p>
      </div>

      {/* 2. Low Stock Alert */}
      <div 
        onClick={() => onFilterStatus('LOW_STOCK')}
        className={`glass-panel p-4 rounded-xl cursor-pointer transition transform hover:-translate-y-0.5 ${
          activeFilter === 'LOW_STOCK' ? 'ring-2 ring-amber-500/80 bg-amber-950/20' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-amber-300">Low Stock</span>
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-amber-400">{summary.lowStockItemsCount}</span>
          <span className="text-xs text-amber-500 font-semibold">Below Reorder</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Click to filter low stock items</p>
      </div>

      {/* 3. Out of Stock */}
      <div 
        onClick={() => onFilterStatus('OUT_OF_STOCK')}
        className={`glass-panel p-4 rounded-xl cursor-pointer transition transform hover:-translate-y-0.5 ${
          activeFilter === 'OUT_OF_STOCK' ? 'ring-2 ring-rose-500/80 bg-rose-950/20' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-rose-300">Out of Stock</span>
          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
            <AlertCircle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-rose-400">{summary.outOfStockItemsCount}</span>
          <span className="text-xs text-rose-500 font-semibold">Immediate Action</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">0 units remaining in warehouse</p>
      </div>

      {/* 4. Expiring Lots (60 Days Warning) */}
      <div 
        onClick={() => onFilterStatus('EXPIRING_SOON')}
        className={`glass-panel p-4 rounded-xl cursor-pointer transition transform hover:-translate-y-0.5 ${
          activeFilter === 'EXPIRING_SOON' ? 'ring-2 ring-amber-400/80 bg-amber-900/30' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-amber-200">Expiring in 60 Days</span>
          <div className="p-2 rounded-lg bg-amber-400/20 text-amber-300">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-amber-300">{summary.expiringLotsCount}</span>
          <span className="text-xs text-amber-400 font-semibold">Batch Lots</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Cosmetics batch expiration check</p>
      </div>

      {/* 5. Today's Movements */}
      <div className="glass-panel p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Today's Summary</span>
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <ShoppingBag className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ArrowDownRight className="h-3.5 w-3.5" />
            <span>+{summary.unitsInToday} In</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 font-semibold">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>-{summary.unitsOutToday} Out</span>
          </div>
        </div>
        <div className="mt-2 pt-1 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
          <span>Woo Orders: {summary.wooOrdersCountToday}</span>
        </div>
      </div>
    </div>
  );
};
