'use client';

import React from 'react';
import { Search, Calendar, Bell, ChevronDown, UserCheck, ShieldCheck } from 'lucide-react';
import { UserRole } from '@/types/inventory';

interface TopHeaderProps {
  userRole: UserRole;
  userName: string;
  userEmail: string;
  alertCount: number;
  onOpenAlerts: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  userRole,
  userName,
  userEmail,
  alertCount,
  onOpenAlerts,
  searchQuery,
  setSearchQuery
}) => {
  const currentDateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Search Input matching reference design */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search products, SKUs, orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-16 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white transition"
        />
        <span className="absolute right-3 top-2 text-[10px] font-mono font-medium text-slate-400 bg-slate-200/80 px-1.5 py-0.5 rounded">
          Ctrl + K
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-5">
        {/* Date Selector Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-200/70 transition">
          <Calendar className="h-4 w-4 text-slate-500" />
          <span>{currentDateStr}</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </div>

        {/* Notification Bell */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          title="Alerts & Notifications"
        >
          <Bell className="h-5 w-5" />
          {alertCount > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
              {alertCount}
            </span>
          )}
        </button>

        {/* User Profile Info */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 border border-blue-300 font-bold flex items-center justify-center text-xs shadow-sm">
            {userRole === 'ADMIN' ? 'PA' : 'ST'}
          </div>
          <div>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
              <span>{userName}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              {userRole === 'ADMIN' ? (
                <>
                  <ShieldCheck className="h-3 w-3 text-amber-500" />
                  Head Admin
                </>
              ) : (
                <>
                  <UserCheck className="h-3 w-3 text-blue-500" />
                  Salon Staff
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
