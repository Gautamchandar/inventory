'use client';

import React, { useState } from 'react';
import { StockLog } from '@/types/inventory';
import { History, Search, ArrowDownRight, ArrowUpRight, ShieldCheck, ShoppingBag, UserCheck, ShieldAlert, User } from 'lucide-react';

interface AuditLogTableProps {
  logs: StockLog[];
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs }) => {
  const [logSearch, setLogSearch] = useState('');
  const [selectedUserFilter, setSelectedUserFilter] = useState<'ALL' | 'ADMIN' | 'STAFF' | 'WOOCOMMERCE'>('ALL');

  // Calculate live statistics per user / role
  const adminLogs = logs.filter(l => l.user.toLowerCase().includes('admin') || l.user.toLowerCase().includes('pawan'));
  const staffLogs = logs.filter(l => l.user.toLowerCase().includes('staff') || l.user.toLowerCase().includes('hbtxstaff'));
  const wooLogs = logs.filter(l => l.user.toLowerCase().includes('woocommerce'));

  const adminIn = adminLogs.filter(l => l.quantityChange > 0).reduce((acc, l) => acc + l.quantityChange, 0);
  const adminOut = adminLogs.filter(l => l.quantityChange < 0).reduce((acc, l) => acc + Math.abs(l.quantityChange), 0);

  const staffIn = staffLogs.filter(l => l.quantityChange > 0).reduce((acc, l) => acc + l.quantityChange, 0);
  const staffOut = staffLogs.filter(l => l.quantityChange < 0).reduce((acc, l) => acc + Math.abs(l.quantityChange), 0);

  const wooOut = wooLogs.reduce((acc, l) => acc + Math.abs(l.quantityChange), 0);

  // Filter logs by user chip selection & search query
  const filteredLogs = logs.filter(l => {
    const matchesSearch = 
      l.productName.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.sku.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.reason.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.user.toLowerCase().includes(logSearch.toLowerCase());

    if (selectedUserFilter === 'ADMIN') {
      return matchesSearch && (l.user.toLowerCase().includes('admin') || l.user.toLowerCase().includes('pawan'));
    }
    if (selectedUserFilter === 'STAFF') {
      return matchesSearch && (l.user.toLowerCase().includes('staff') || l.user.toLowerCase().includes('hbtxstaff'));
    }
    if (selectedUserFilter === 'WOOCOMMERCE') {
      return matchesSearch && l.user.toLowerCase().includes('woocommerce');
    }
    return matchesSearch;
  });

  const getUserBadge = (userStr: string) => {
    const lower = userStr.toLowerCase();
    if (lower.includes('pawan') || lower.includes('admin')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <ShieldCheck className="h-3 w-3 text-amber-400" />
          Admin (pawan508)
        </span>
      );
    }
    if (lower.includes('staff') || lower.includes('hbtxstaff')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
          <UserCheck className="h-3 w-3 text-blue-400" />
          Staff (hbtxstaff)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
        <ShoppingBag className="h-3 w-3 text-purple-400" />
        WooCommerce Webhook
      </span>
    );
  };

  const getLogTypeBadge = (type: string, qtyChange: number) => {
    if (type === 'WOOCOMMERCE_ORDER') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
          Customer Sale
        </span>
      );
    }
    if (type === 'WOOCOMMERCE_REFUND') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
          Order Refund
        </span>
      );
    }
    if (qtyChange > 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
          <ArrowDownRight className="h-3 w-3" />
          Stock Added
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">
        <ArrowUpRight className="h-3 w-3" />
        Stock Removed
      </span>
    );
  };

  return (
    <div className="space-y-6 mb-8">
      {/* 1. Live Admin vs Staff Activity Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Admin Activity Card */}
        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 bg-amber-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              Admin Activity (pawan508)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
              {adminLogs.length} Actions
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">Units Added</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">+{adminIn}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">Units Removed</div>
              <div className="text-lg font-bold text-amber-400 font-mono">-{adminOut}</div>
            </div>
          </div>
        </div>

        {/* Staff Activity Card */}
        <div className="glass-panel p-4 rounded-2xl border border-blue-500/30 bg-blue-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-blue-400" />
              Staff Activity (hbtxstaff)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
              {staffLogs.length} Actions
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">Units Added</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">+{staffIn}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">Units Removed</div>
              <div className="text-lg font-bold text-rose-400 font-mono">-{staffOut}</div>
            </div>
          </div>
        </div>

        {/* WooCommerce Webhook Sales Card */}
        <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 bg-purple-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <ShoppingBag className="h-4 w-4 text-purple-400" />
              WooCommerce Sales
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
              {wooLogs.length} Orders
            </span>
          </div>
          <div className="mt-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <div className="text-[10px] text-slate-400 font-medium">Total Customer Units Sold</div>
            <div className="text-lg font-bold text-purple-300 font-mono">-{wooOut} units</div>
          </div>
        </div>
      </div>

      {/* 2. Main Audit Log Table */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden">
        {/* Header & User Filter Chips Bar */}
        <div className="p-4 lg:p-6 border-b border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <History className="h-5 w-5 text-amber-400" />
              Live Audit Trail & Staff/Admin Records
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time record of every addition and removal of stock by Admin, Staff, or WooCommerce
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* User Filter Chips */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedUserFilter('ALL')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  selectedUserFilter === 'ALL'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Records
              </button>
              <button
                onClick={() => setSelectedUserFilter('ADMIN')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  selectedUserFilter === 'ADMIN'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Admin (pawan508)
              </button>
              <button
                onClick={() => setSelectedUserFilter('STAFF')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  selectedUserFilter === 'STAFF'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Staff (hbtxstaff)
              </button>
              <button
                onClick={() => setSelectedUserFilter('WOOCOMMERCE')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  selectedUserFilter === 'WOOCOMMERCE'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                WooCommerce
              </button>
            </div>

            {/* Search Box */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search log reason, SKU or user..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>
        </div>

        {/* Log Entries Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Logged User / Role</th>
                <th className="py-3.5 px-4">Product Name & SKU</th>
                <th className="py-3.5 px-4">Batch Lot</th>
                <th className="py-3.5 px-4">Movement Action</th>
                <th className="py-3.5 px-4 text-center">Change Qty</th>
                <th className="py-3.5 px-4 text-center">Stock Before &rarr; After</th>
                <th className="py-3.5 px-4">Reason / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No stock logs match your user filter or search criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      {getUserBadge(log.user)}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      <div>{log.productName}</div>
                      <div className="font-mono text-[10px] text-slate-400">{log.sku}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-amber-300">
                      {log.batchNumber || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4">
                      {getLogTypeBadge(log.type, log.quantityChange)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-sm">
                      <span className={log.quantityChange > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                      {log.previousQuantity} &rarr; <strong className="text-slate-100">{log.newQuantity}</strong>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {log.reason}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
