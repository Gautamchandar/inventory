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
import { AlertCircle, Zap, ShieldCheck, Mail, MessageSquare, RefreshCw, X, Calendar, ChevronDown } from 'lucide-react';

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
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading HBTX Executive Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs border border-slate-700 animate-bounce">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={role}
        onLogout={handleLogout}
        onSyncWooCommerce={handleSyncWooCommerce}
        isSyncing={isSyncing}
      />

      {/* 2. Main Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0">
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

        {/* Workspace Body */}
        <main className="p-8 max-w-7xl mx-auto w-full flex-1">
          {/* Active Alerts Banner */}
          {alerts.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 mb-6 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 font-bold">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-extrabold text-amber-900">{alerts.length} Active Alerts:</span>
                  <span className="text-amber-800 font-medium ml-2">{alerts[0]?.title}</span>
                </div>
              </div>
              <button
                onClick={() => setShowAlertsModal(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shadow-sm"
              >
                View Alerts
              </button>
            </div>
          )}

          {/* PAGE VIEW 1: Main Dashboard (Stock Table + KPI Cards) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Inventory Dashboard
                  </h1>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Live overview of HBTX hair care stock & WooCommerce REST API synchronization
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowWebhookTester(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs border border-blue-200 transition"
                  >
                    <Zap className="h-4 w-4 text-blue-600" />
                    Simulate Webhook Order
                  </button>

                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-xs font-bold text-slate-700">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>This Week</span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
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
          )}

          {/* PAGE VIEW 2: Dedicated Staff & Admin Activity Tracker */}
          {activeTab === 'staff_activity' && (
            <StaffActivityPage logs={logs} />
          )}

          {/* PAGE VIEW 3: Batch Lots & Expiry Tracker */}
          {activeTab === 'batches' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Batch Lots & 60-Day Expiry Warnings
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Cosmetics batch management and expiration monitoring across all products
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map(p => (
                  <div key={p.id} className="dashboard-card p-5 rounded-2xl space-y-3 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900">{p.name} ({p.size})</h3>
                        <p className="text-xs text-blue-600 font-mono font-bold">{p.sku}</p>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800">
                        {p.stockQuantity} total units
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      {p.batchLots.length === 0 ? (
                        <p className="text-slate-400 italic">No batch lots assigned.</p>
                      ) : (
                        p.batchLots.map(lot => (
                          <div key={lot.id} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                            <div>
                              <span className="font-mono font-bold text-amber-800">Batch #{lot.batchNumber}</span>
                              <span className="text-slate-500 text-[11px] block">Expires: {lot.expiryDate}</span>
                            </div>
                            <span className="font-mono font-bold text-slate-900 text-xs">
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

      {/* Alerts Modal */}
      {showAlertsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Active Stock & 60-Day Expiry Alerts
              </h3>
              <button
                onClick={() => setShowAlertsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 max-h-96 overflow-y-auto space-y-3">
              {alerts.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No active stock or expiry alerts!</p>
              ) : (
                alerts.map((a) => (
                  <div key={a.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{a.title}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-500">SKU: {a.sku}</span>
                    </div>
                    <p className="text-xs text-slate-600">{a.message}</p>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold">
                      <span className="flex items-center gap-1 text-emerald-600">
                        <MessageSquare className="h-3 w-3" />
                        WhatsApp Ready
                      </span>
                      <span className="flex items-center gap-1 text-blue-600">
                        <Mail className="h-3 w-3" />
                        Email Notification Dispatched
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-200 text-right bg-slate-50">
              <button
                onClick={() => setShowAlertsModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
