'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/inventory';
import { Shield, ShieldAlert, RefreshCw, Bell, Sparkles, LogOut, User } from 'lucide-react';

interface HeaderProps {
  role: UserRole;
  userEmail?: string;
  userName?: string;
  onRoleChange: (newRole: UserRole) => void;
  alertCount: number;
  onOpenAlerts: () => void;
  onSyncWooCommerce: () => void;
  isSyncing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  userEmail,
  userName = 'Admin Manager',
  onRoleChange,
  alertCount,
  onOpenAlerts,
  onSyncWooCommerce,
  isSyncing
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-900/30 ring-1 ring-amber-400/30">
            <Sparkles className="h-5.5 w-5.5 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
                HBTX Professional
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Live Inventory
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              WooCommerce REST API & Webhooks Connected
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center flex-wrap gap-3">
          {/* WooCommerce Sync Button */}
          <button
            onClick={onSyncWooCommerce}
            disabled={isSyncing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-medium border border-slate-700 transition disabled:opacity-50"
            title="Sync stock with WooCommerce REST API"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-amber-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync WooCommerce'}</span>
          </button>

          {/* Alerts Trigger */}
          <button
            onClick={onOpenAlerts}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            <Bell className="h-3.5 w-3.5 text-amber-400" />
            <span>Alerts</span>
            {alertCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 animate-bounce">
                {alertCount}
              </span>
            )}
          </button>

          {/* Logged in User Profile & Role */}
          <div className="flex items-center gap-2 bg-slate-900/90 pl-3 pr-1 py-1 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <User className="h-3.5 w-3.5 text-amber-400" />
              <span>{userName}</span>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                role === 'ADMIN'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {role}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
