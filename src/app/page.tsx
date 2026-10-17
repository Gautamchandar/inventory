'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Product, StockLog, WebhookLog, DailySummary, UserRole } from '@/types/inventory';
import { AlertNotification } from '@/lib/alerts';
import { Sidebar } from '@/components/Sidebar';
import { TopHeader } from '@/components/TopHeader';
import { ExecutiveSummaryCards } from '@/components/ExecutiveSummaryCards';
import { StockTable } from '@/components/StockTable';
import { StockAdjustModal } from '@/components/StockAdjustModal';
import { BatchLotDrawer } from '@/components/BatchLotDrawer';
import { StaffActivityPage } from '@/components/StaffActivityPage';
import { WebhookTesterModal } from '@/components/WebhookTesterModal';
import { AlertCircle, Zap, ShieldCheck, Mail, MessageSquare, RefreshCw, X, Calendar, ChevronDown, Menu } from 'lucide-react';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2';

export default function InventoryDashboard() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('ADMIN');
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; role: UserRole } | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [logs, setLogs] = useState<StockLog[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [summary, setSummary] = useState<DailySummary>({
    date: new Date().toISOString().split('T')[0],
    totalProducts: 0,
    totalStockUnits: 0,
    lowStockItemsCount: 0,
    outOfStockItemsCount: 0,
    expiringLotsCount: 0,
    unitsInToday: 0,
    unitsOutToday: 0,
    wooOrdersCountToday: 0,
    totalSalesValueINR: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Navigation Tab State
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Active Modals state
  const [adjustModalProduct, setAdjustModalProduct] = useState<Product | null>(null);
  const [adjustModalType, setAdjustModalType] = useState<'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT'>('STOCK_IN');
  const [batchDrawerProduct, setBatchDrawerProduct] = useState<Product | null>(null);
  const [showWebhookTester, setShowWebhookTester] = useState<boolean>(false);
  const [showAlertsModal, setShowAlertsModal] = useState<boolean>(false);

  // Mobile navigation drawer (UI only)
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileNavOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileNavOpen]);

  // Close the drawer if the screen grows to desktop width (rotate tablet / resize window)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileNavOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      // Check User Session
      const meRes = await fetch('/api/auth/me');
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.authenticated && meData.user) {
          setUserProfile(meData.user);
          setRole(meData.user.role);
        }
      }

      const res = await fetch('/api/inventory');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setLogs(data.logs);
        setWebhookLogs(data.webhookLogs);
        setAlerts(data.alerts);
        setSummary(data.dailySummary);
      }
    } catch (err) {
      console.error('Failed to load inventory data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 4000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleSyncWooCommerce = async () => {
    setIsSyncing(true);
    await fetchDashboardData();
    setTimeout(() => {
      setIsSyncing(false);
      showToast('WooCommerce stock catalog bi-directionally synchronized.');
    }, 800);
  };

  const handleStockAdjustmentSubmit = async (params: any) => {
    const res = await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error);
    }
    showToast(data.message);
    await fetchDashboardData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen supports-[height:100dvh]:min-h-[100dvh] bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div aria-hidden className="absolute -inset-3 rounded-full bg-blue-500/15 blur-xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg shadow-slate-900/10 ring-1 ring-slate-200">
              <RefreshCw className="h-7 w-7 text-blue-600 animate-spin" />
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-600">Loading HBTX Executive Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen supports-[height:100dvh]:min-h-[100dvh] overflow-x-clip bg-slate-50 flex text-slate-800 antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-center pb-[env(safe-area-inset-bottom)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:justify-end"
        >
          <div className="pointer-events-auto flex w-full max-w-sm items-start gap-3 break-words rounded-2xl border border-slate-700/80 bg-slate-900/95 px-4 py-3.5 text-sm text-white shadow-2xl shadow-slate-950/40 backdrop-blur motion-safe:animate-[toastIn_220ms_ease-out]">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/30">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            </span>
            <span className="leading-snug">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 1. Left Sidebar */}
      {/* Desktop: fixed column. Phones/tablets: slide-in drawer. */}
      {mobileNavOpen && (
        <div
          aria-hidden
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm motion-safe:animate-[fadeIn_160ms_ease-out] lg:hidden"
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] sm:w-80 overflow-y-auto overscroll-contain bg-slate-900 shadow-2xl transition-[transform,visibility] duration-300 ease-out motion-reduce:transition-none lg:z-30 lg:w-64 lg:max-w-none lg:translate-x-0 lg:overflow-visible lg:shadow-none lg:transition-none ${
          mobileNavOpen ? 'translate-x-0 max-lg:visible' : '-translate-x-full max-lg:invisible'
        }`}
      >
        <button
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close menu"
          className={`absolute right-3 top-3 z-10 rounded-lg p-2.5 text-slate-300 transition hover:bg-slate-800 hover:text-white lg:hidden ${focusRing}`}
        >
          <X className="h-5 w-5" />
        </button>

        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab: React.SetStateAction<string>) => {
            setActiveTab(tab);
            setMobileNavOpen(false);
          }}
          role={role}
          onLogout={handleLogout}
          onSyncWooCommerce={handleSyncWooCommerce}
          isSyncing={isSyncing}
        />
      </div>

      {/* 2. Main Workspace Container (lg:ml-64 = fixed sidebar ki width) */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Mobile bar with menu button (hidden on desktop) */}
        <div className="z-30 [@media(min-height:560px)]:sticky [@media(min-height:560px)]:top-0 lg:contents">
          <div className="flex items-center gap-3 border-b border-slate-200 bg-white/90 pb-2.5 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] pt-[max(0.625rem,env(safe-area-inset-top))] backdrop-blur-xl sm:px-6 lg:hidden">
            <button
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileNavOpen}
              className={`rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 ${focusRing}`}
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="truncate text-sm font-bold tracking-tight text-slate-900">HBTX Professional</span>
          </div>

          {/* Top Header Navigation */}
          <TopHeader
            userRole={role}
            userName={userProfile?.name || (role === 'ADMIN' ? 'Pawan (pawan508)' : 'HBTX Salon Staff')}
            userEmail={userProfile?.email || 'pawan508'}
            alertCount={alerts.length}
            onOpenAlerts={() => setShowAlertsModal(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* Workspace Body */}
        <main className="relative mx-auto w-full max-w-7xl flex-1 py-4 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-6 lg:px-8 lg:py-8 2xl:max-w-[1600px]">
          {/* Soft background wash */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-blue-50/80 via-slate-50/0 to-transparent"
          />

          {/* Active Alerts Banner */}
          {alerts.length > 0 && (
            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50/60 p-3.5 shadow-sm sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:p-4">
              <div className="flex min-w-0 items-start gap-3 sm:items-center">
                <div className="shrink-0 rounded-xl bg-amber-100 p-2 text-amber-700 ring-1 ring-inset ring-amber-200">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div className="min-w-0 text-sm leading-snug">
                  <span className="font-bold text-amber-900">{alerts.length} Active Alerts:</span>
                  <span className="ml-1.5 font-medium text-amber-800 sm:block sm:truncate md:inline">
                    {alerts[0]?.title}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowAlertsModal(true)}
                className={`w-full shrink-0 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-amber-700/20 transition hover:bg-amber-700 active:scale-[0.98] sm:w-auto sm:py-2 ${focusRing} focus-visible:ring-amber-500/70`}
              >
                View Alerts
              </button>
            </div>
          )}

          {/* PAGE VIEW 1: Main Dashboard (Stock Table + KPI Cards) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-5 sm:space-y-6">
              {/* Header Title */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                  <h1 className="text-[clamp(1.375rem,1rem+1.8vw,1.875rem)] font-bold leading-tight tracking-tight text-slate-900">
                    Inventory Dashboard
                  </h1>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-500">
                    Live overview of HBTX hair care stock & WooCommerce REST API synchronization
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
                  <button
                    onClick={() => setShowWebhookTester(true)}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[0.98] sm:w-auto ${focusRing}`}
                  >
                    <Zap className="h-4 w-4 text-blue-100" />
                    Simulate Webhook Order
                  </button>

                  <div className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm sm:w-auto sm:justify-start">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>This Week</span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* 4 KPI Summary Cards */}
              <ExecutiveSummaryCards
                summary={summary}
                onFilterStatus={(status) => setSelectedStatusFilter(status)}
                activeFilter={selectedStatusFilter}
              />

              {/* Live Stock Table */}
              <div className="min-w-0 max-w-full overflow-x-auto overscroll-x-contain rounded-2xl [&_table]:min-w-[720px] xl:[&_table]:min-w-0">
                <StockTable
                  products={products.filter(p =>
                    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase())
                  )}
                  role={role}
                  onOpenAdjustModal={(product, type) => {
                    setAdjustModalProduct(product);
                    setAdjustModalType(type);
                  }}
                  onOpenBatchDrawer={(product) => setBatchDrawerProduct(product)}
                  selectedStatusFilter={selectedStatusFilter}
                  onClearStatusFilter={() => setSelectedStatusFilter(null)}
                />
              </div>
            </div>
          )}

          {/* PAGE VIEW 2: Dedicated Staff & Admin Activity Tracker */}
          {activeTab === 'staff_activity' && (
            <StaffActivityPage logs={logs} />
          )}

          {/* PAGE VIEW 3: Batch Lots & Expiry Tracker */}
          {activeTab === 'batches' && (
            <div className="space-y-5 sm:space-y-6">
              <div>
                <h2 className="text-[clamp(1.125rem,0.9rem+1.2vw,1.5rem)] font-bold leading-tight tracking-tight text-slate-900">
                  Batch Lots & 60-Day Expiry Warnings
                </h2>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-500">
                  Cosmetics batch management and expiration monitoring across all products
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {products.map(p => (
                  <div
                    key={p.id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-900/[0.03] transition-shadow hover:shadow-md hover:shadow-slate-900/[0.06] sm:p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2 border-b border-slate-100 pb-4">
                      <div className="min-w-0 flex-1 basis-40">
                        <h3 className="break-words text-sm font-semibold leading-snug text-slate-900 sm:text-base">
                          {p.name} <span className="font-medium text-slate-500">({p.size})</span>
                        </h3>
                        <p className="mt-1.5 inline-block rounded-md bg-blue-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-100">
                          {p.sku}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold tabular-nums text-slate-800">
                        {p.stockQuantity} total units
                      </span>
                    </div>

                    <div className="space-y-2">
                      {p.batchLots.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-3 py-4 text-center text-xs italic text-slate-400">
                          No batch lots assigned.
                        </p>
                      ) : (
                        p.batchLots.map(lot => (
                          <div
                            key={lot.id}
                            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-3"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <span aria-hidden className="h-8 w-1 shrink-0 rounded-full bg-amber-400" />
                              <div className="min-w-0">
                                <span className="block truncate font-mono text-xs font-bold text-amber-800 sm:text-[13px]">
                                  Batch #{lot.batchNumber}
                                </span>
                                <span className="block text-[11px] text-slate-500">Expires: {lot.expiryDate}</span>
                              </div>
                            </div>
                            <span className="shrink-0 rounded-lg bg-white px-2 py-1 font-mono text-xs font-bold tabular-nums text-slate-900 ring-1 ring-inset ring-slate-200">
                              {lot.quantity} units
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Stock Adjustment Modal */}
      {adjustModalProduct && (
        <StockAdjustModal
          product={adjustModalProduct}
          initialType={adjustModalType}
          onClose={() => setAdjustModalProduct(null)}
          onSubmit={handleStockAdjustmentSubmit}
        />
      )}

      {/* Batch Lots Drawer */}
      {batchDrawerProduct && (
        <BatchLotDrawer
          product={batchDrawerProduct}
          onClose={() => setBatchDrawerProduct(null)}
        />
      )}

      {/* Webhook Simulator Modal */}
      {showWebhookTester && (
        <WebhookTesterModal
          products={products}
          onClose={() => setShowWebhookTester(false)}
          onRefreshData={fetchDashboardData}
        />
      )}

      {/* Alerts Modal: bottom sheet on phones, centered dialog from sm up */}
      {showAlertsModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 backdrop-blur-sm motion-safe:animate-[fadeIn_160ms_ease-out] sm:items-center sm:p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="alerts-title"
            className="flex max-h-[88vh] supports-[height:100dvh]:max-h-[88dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl motion-safe:animate-[sheetIn_220ms_ease-out] sm:max-h-[85vh] sm:supports-[height:100dvh]:max-h-[85dvh] sm:rounded-3xl"
          >
            {/* Drag-handle affordance on mobile */}
            <div aria-hidden className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-slate-300 sm:hidden" />

            <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-5">
              <h3 id="alerts-title" className="flex min-w-0 items-center gap-2.5 text-base font-bold text-slate-900">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 ring-1 ring-inset ring-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-700" />
                </span>
                <span className="leading-tight">Active Stock & 60-Day Expiry Alerts</span>
              </h3>
              <button
                onClick={() => setShowAlertsModal(false)}
                aria-label="Close alerts"
                className={`shrink-0 rounded-lg p-2.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600 ${focusRing}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4 sm:p-5">
              {alerts.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">No active stock or expiry alerts!</p>
              ) : (
                alerts.map((a) => (
                  <div
                    key={a.id}
                    className="space-y-2.5 rounded-2xl border border-slate-200 border-l-4 border-l-amber-400 bg-slate-50 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                      <span className="text-sm font-semibold leading-snug text-slate-900">{a.title}</span>
                      <span className="rounded-md bg-white px-1.5 py-0.5 font-mono text-[11px] font-semibold text-slate-500 ring-1 ring-inset ring-slate-200">
                        SKU: {a.sku}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">{a.message}</p>
                    <div className="flex flex-col gap-1.5 border-t border-slate-200 pt-2.5 text-xs font-semibold sm:flex-row sm:items-center sm:justify-between">
                      <span className="flex items-center gap-1.5 text-emerald-600">
                        <MessageSquare className="h-3.5 w-3.5" />
                        WhatsApp Ready
                      </span>
                      <span className="flex items-center gap-1.5 text-blue-600">
                        <Mail className="h-3.5 w-3.5" />
                        Email Notification Dispatched
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-200 bg-slate-50/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:text-right">
              <button
                onClick={() => setShowAlertsModal(false)}
                className={`w-full rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98] sm:w-auto ${focusRing} focus-visible:ring-slate-900/70`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations (scoped here so no extra CSS file is needed) */}
      <style jsx global>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes sheetIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}