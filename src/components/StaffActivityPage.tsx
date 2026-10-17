'use client';

import React, { useState } from 'react';
import { StockLog } from '@/types/inventory';
import { UserCheck, ShieldCheck, ArrowDownRight, ArrowUpRight, Search, Filter, History } from 'lucide-react';

interface StaffActivityPageProps {
  logs: StockLog[];
}

export const StaffActivityPage: React.FC<StaffActivityPageProps> = ({ logs }) => {
  const [selectedUserFilter, setSelectedUserFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique staff/admin users from logs
  const userStatsMap: Record<string, { name: string; role: string; added: number; removed: number; totalActions: number }> = {};

  logs.forEach(log => {
    const user = log.user || 'Unknown User';
    const isStaff = user.toLowerCase().includes('staff') || user.toLowerCase().includes('hbtxstaff');
    const isAdmin = user.toLowerCase().includes('pawan') || user.toLowerCase().includes('admin');
    const role = isAdmin ? 'Admin' : (isStaff ? 'Staff' : 'System');

    if (!userStatsMap[user]) {
      userStatsMap[user] = {
        name: user,
        role: role,
        added: 0,
        removed: 0,
        totalActions: 0
      };
    }

    userStatsMap[user].totalActions += 1;
    if (log.quantityChange > 0) {
      userStatsMap[user].added += log.quantityChange;
    } else {
      userStatsMap[user].removed += Math.abs(log.quantityChange);
    }
  });

  const userStatsList = Object.values(userStatsMap);

  // Filter logs by selected user filter and search text
  const filteredLogs = logs.filter(log => {
    const matchesUser = selectedUserFilter === 'ALL' || log.user === selectedUserFilter;
    const matchesSearch = 
      log.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesUser && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Staff & Admin Stock Activity Tracker
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Live record of how much product each staff member and admin has added (+) or removed (-) from inventory
        </p>
      </div>

      {/* 1. Staff & Admin Leaderboard / Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {userStatsList.map((stat) => (
          <div 
            key={stat.name}
            onClick={() => setSelectedUserFilter(selectedUserFilter === stat.name ? 'ALL' : stat.name)}
            className={`dashboard-card dashboard-card-hover p-5 rounded-2xl cursor-pointer ${
              selectedUserFilter === stat.name ? 'ring-2 ring-blue-600 bg-blue-50/30' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                  stat.role === 'Admin' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {stat.role === 'Admin' ? <ShieldCheck className="h-6 w-6" /> : <UserCheck className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{stat.name}</h3>
                  <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    stat.role === 'Admin' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {stat.role} Role
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                {stat.totalActions} Actions
              </span>
            </div>

            {/* Added vs Removed Numbers */}
            <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                <span className="text-[11px] font-bold text-emerald-800 flex items-center justify-center gap-1">
                  <ArrowDownRight className="h-3.5 w-3.5" />
                  Total Added
                </span>
                <span className="text-xl font-extrabold text-emerald-700 font-mono block mt-0.5">
                  +{stat.added} units
                </span>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-center">
                <span className="text-[11px] font-bold text-rose-800 flex items-center justify-center gap-1">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  Total Removed
                </span>
                <span className="text-xl font-extrabold text-rose-700 font-mono block mt-0.5">
                  -{stat.removed} units
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Detailed Live Activity Log Table */}
      <div className="dashboard-card rounded-2xl overflow-hidden bg-white">
        {/* Filter Controls Bar */}
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <History className="h-5 w-5 text-blue-600" />
              Live Addition & Removal Log ({filteredLogs.length})
            </h3>
            {selectedUserFilter !== 'ALL' && (
              <button
                onClick={() => setSelectedUserFilter('ALL')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Clear User Filter ({selectedUserFilter})
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff, product or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-6">Staff / Admin Name</th>
                <th className="py-3.5 px-6">Product Name & SKU</th>
                <th className="py-3.5 px-6">Batch Lot</th>
                <th className="py-3.5 px-6 text-center">Added / Removed Qty</th>
                <th className="py-3.5 px-6 text-center">Stock Progression</th>
                <th className="py-3.5 px-6">Reason / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 font-semibold">
                    No activity logs recorded for the selected filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isAdd = log.quantityChange > 0;
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6 font-mono text-slate-500 text-[11px]">
                        {new Date(log.timestamp).toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                          <UserCheck className="h-3.5 w-3.5 text-blue-600" />
                          {log.user}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{log.productName}</div>
                        <div className="font-mono text-[10px] text-blue-600 font-bold">{log.sku}</div>
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-amber-700">
                        {log.batchNumber || 'MAIN'}
                      </td>
                      <td className="py-4 px-6 text-center font-mono font-extrabold text-sm">
                        <span className={`px-2.5 py-1 rounded-lg ${
                          isAdd ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isAdd ? `+${log.quantityChange} Added` : `${log.quantityChange} Removed`}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center font-mono text-slate-600">
                        {log.previousQuantity} &rarr; <strong className="text-slate-900">{log.newQuantity}</strong>
                      </td>
                      <td className="py-4 px-6 text-slate-700 font-semibold">
                        {log.reason}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
