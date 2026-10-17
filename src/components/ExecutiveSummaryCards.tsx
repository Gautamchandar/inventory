'use client';

import React from 'react';
import { DailySummary } from '@/types/inventory';
import { Package, AlertTriangle, Clock, TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';

interface ExecutiveSummaryCardsProps {
  summary: DailySummary;
  onFilterStatus: (status: string | null) => void;
  activeFilter: string | null;
}

export const ExecutiveSummaryCards: React.FC<ExecutiveSummaryCardsProps> = ({
  summary,
  onFilterStatus,
  activeFilter
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {/* Card 1: Total Stock Units */}
      <div
        onClick={() => onFilterStatus(null)}
        className={`dashboard-card dashboard-card-hover p-5 rounded-2xl cursor-pointer ${
          activeFilter === null ? 'ring-2 ring-blue-600 bg-blue-50/20' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Stock Units</span>
            <div className="text-2xl font-extrabold text-slate-900 leading-tight">
              {summary.totalStockUnits}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
            <TrendingUp className="h-3.5 w-3.5" />
            +12% <span className="font-normal text-slate-400">vs last week</span>
          </span>
          {/* Sparkline mini chart */}
          <svg className="h-5 w-16 text-blue-500 overflow-visible" fill="none" viewBox="0 0 60 20">
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M2 15 L15 10 L30 14 L45 5 L58 8" />
          </svg>
        </div>
      </div>

      {/* Card 2: Low Stock Items */}
      <div
        onClick={() => onFilterStatus('LOW_STOCK')}
        className={`dashboard-card dashboard-card-hover p-5 rounded-2xl cursor-pointer ${
          activeFilter === 'LOW_STOCK' ? 'ring-2 ring-amber-500 bg-amber-50/20' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Low Stock Items</span>
            <div className="text-2xl font-extrabold text-amber-600 leading-tight">
              {summary.lowStockItemsCount}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
            <TrendingDown className="h-3.5 w-3.5" />
            Below Reorder Level
          </span>
          <svg className="h-5 w-16 text-emerald-500 overflow-visible" fill="none" viewBox="0 0 60 20">
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M2 18 L15 12 L30 15 L45 8 L58 4" />
          </svg>
        </div>
      </div>

      {/* Card 3: Expiring Batches (60d) */}
      <div
        onClick={() => onFilterStatus('EXPIRING_SOON')}
        className={`dashboard-card dashboard-card-hover p-5 rounded-2xl cursor-pointer ${
          activeFilter === 'EXPIRING_SOON' ? 'ring-2 ring-orange-500 bg-orange-50/20' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Expiring (&lt;60d)</span>
            <div className="text-2xl font-extrabold text-orange-600 leading-tight">
              {summary.expiringLotsCount}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
            <TrendingDown className="h-3.5 w-3.5" />
            Cosmetics Warning
          </span>
          <svg className="h-5 w-16 text-orange-500 overflow-visible" fill="none" viewBox="0 0 60 20">
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M2 5 L15 12 L30 8 L45 16 L58 14" />
          </svg>
        </div>
      </div>

      {/* Card 4: Inventory Valuation (INR) */}
      <div className="dashboard-card dashboard-card-hover p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
            <IndianRupee className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Inventory Valuation</span>
            <div className="text-2xl font-extrabold text-purple-700 leading-tight">
              ₹4.2M
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-600">
            <TrendingUp className="h-3.5 w-3.5" />
            +18% <span className="font-normal text-slate-400">vs last week</span>
          </span>
          <svg className="h-5 w-16 text-purple-500 overflow-visible" fill="none" viewBox="0 0 60 20">
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M2 16 L15 14 L30 8 L45 10 L58 2" />
          </svg>
        </div>
      </div>
    </div>
  );
};
