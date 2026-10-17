'use client';

import React, { useState } from 'react';
import { Product } from '@/types/inventory';
import { X, Send, CheckCircle, RefreshCw, Zap, ShieldCheck } from 'lucide-react';

interface WebhookTesterModalProps {
  products: Product[];
  onClose: () => void;
  onRefreshData: () => void;
}

export const WebhookTesterModal: React.FC<WebhookTesterModalProps> = ({
  products,
  onClose,
  onRefreshData
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [eventType, setEventType] = useState<'order.created' | 'order.refunded'>('order.created');
  const [quantity, setQuantity] = useState<number>(2);
  const [orderId, setOrderId] = useState<string>(`WC-104${Math.floor(Math.random() * 90)}`);
  const [isDuplicateTest, setIsDuplicateTest] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [responseLog, setResponseLog] = useState<string | null>(null);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleSimulateWebhook = async () => {
    if (!selectedProduct) return;

    setIsSending(true);
    setResponseLog(null);

    const webhookId = isDuplicateTest ? 'wh-duplicate-test-123' : `wh-sim-${Date.now()}`;

    const payload = {
      id: orderId,
      status: eventType === 'order.created' ? 'processing' : 'refunded',
      line_items: [
        {
          product_id: selectedProduct.wcProductId,
          name: selectedProduct.name,
          quantity: quantity
        }
      ]
    };

    try {
      const res = await fetch('/api/webhooks/woocommerce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wc-webhook-event': eventType,
          'x-wc-webhook-id': webhookId
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setResponseLog(JSON.stringify(data, null, 2));
      onRefreshData();
    } catch (err: any) {
      setResponseLog(`Error sending webhook: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-modal w-full max-w-lg rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Live WooCommerce Webhook Tester</h3>
              <p className="text-xs text-slate-400">Simulate incoming WooCommerce customer orders & refunds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Hair Care Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              {products.map(p => (
                <option key={p.id} value={p.id} className="bg-slate-900">
                  {p.name} ({p.size}) - SKU: {p.sku} (Stock: {p.stockQuantity})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Webhook Event</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="order.created">order.created (Customer Bought)</option>
                <option value="order.refunded">order.refunded (Order Refunded)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Order Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">WooCommerce Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={isDuplicateTest}
                  onChange={(e) => setIsDuplicateTest(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span className="font-semibold text-amber-300">Test Webhook Idempotency</span>
              </label>
            </div>
          </div>

          {responseLog && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Webhook Server Response</label>
              <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-36">
                {responseLog}
              </pre>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              Close
            </button>
            <button
              onClick={handleSimulateWebhook}
              disabled={isSending}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition shadow-lg shadow-amber-900/30 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {isSending ? 'Triggering...' : 'Fire Webhook Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
