'use client';

import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Users,
  Sparkles,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { UserRole } from '@/types/inventory';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  onLogout: () => void;
  onSyncWooCommerce: () => void;
  isSyncing: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  role,
  onLogout,
  onSyncWooCommerce,
  isSyncing
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'staff_activity', label: 'Staff & Admin Activity', icon: Users },
    { id: 'batches', label: 'Batch Lots & Expiry (60d)', icon: Layers },
  ];

  return (
    <aside className="w-full lg:w-64 h-full overflow-y-auto bg-slate-900 text-white flex flex-col justify-between shadow-xl">
      <div>
        {/* Logo Header */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg font-bold">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-white leading-tight">
              HBTX Pro
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Inventory Dashboard</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-4 space-y-2 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition text-left ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom WooCommerce Sync & Logout Box */}
      <div className="p-4 space-y-3">
        {/* WooCommerce Sync Banner Box */}
        <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-white space-y-2">
          <p className="text-xs font-bold leading-tight flex items-center gap-1.5 text-blue-400">
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            WooCommerce Source of Truth
          </p>
          <p className="text-[11px] text-slate-400 leading-snug">
            Syncing with hbtxprofessional.com
          </p>
          <button
            onClick={onSyncWooCommerce}
            disabled={isSyncing}
            className="w-full mt-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <span>{isSyncing ? 'Syncing...' : 'Sync Stock Now'}</span>
          </button>
        </div>

        {/* Logout button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-200 text-xs font-semibold transition border border-slate-700"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};