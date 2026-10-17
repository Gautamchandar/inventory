import { Product, BatchLot } from '../types/inventory';

export interface AlertNotification {
  id: string;
  type: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRING_SOON';
  title: string;
  message: string;
  productId: string;
  productName: string;
  sku: string;
  timestamp: string;
  channel: 'EMAIL' | 'WHATSAPP' | 'DASHBOARD';
}

export function check60DayExpiry(expiryDateStr: string): boolean {
  const expiry = new Date(expiryDateStr);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 60 && diffDays >= 0;
}

export function getDaysRemaining(expiryDateStr: string): number {
  const expiry = new Date(expiryDateStr);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function generateAlertsForProducts(products: Product[]): AlertNotification[] {
  const alerts: AlertNotification[] = [];
  const nowStr = new Date().toISOString();

  products.forEach((product) => {
    // 1. Out of stock alert
    if (product.stockQuantity <= 0) {
      alerts.push({
        id: `alert-out-${product.id}-${Date.now()}`,
        type: 'OUT_OF_STOCK',
        title: `CRITICAL: ${product.name} is Out of Stock!`,
        message: `SKU ${product.sku} (${product.size}) has reached 0 stock in inventory. Restock immediately to avoid missed sales.`,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        timestamp: nowStr,
        channel: 'WHATSAPP'
      });
    } 
    // 2. Low stock alert
    else if (product.stockQuantity <= product.reorderLevel) {
      alerts.push({
        id: `alert-low-${product.id}-${Date.now()}`,
        type: 'LOW_STOCK',
        title: `WARNING: Low Stock for ${product.name}`,
        message: `Current stock (${product.stockQuantity} units) is below reorder level (${product.reorderLevel} units) for SKU ${product.sku}.`,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        timestamp: nowStr,
        channel: 'EMAIL'
      });
    }

    // 3. Batch 60-day expiry check
    product.batchLots.forEach((lot) => {
      const daysLeft = getDaysRemaining(lot.expiryDate);
      if (daysLeft <= 60 && lot.quantity > 0) {
        alerts.push({
          id: `alert-exp-${lot.id}-${Date.now()}`,
          type: 'EXPIRING_SOON',
          title: `EXPIRY WARNING: Batch #${lot.batchNumber} Expires in ${daysLeft} Days`,
          message: `${product.name} (${product.size}) Batch ${lot.batchNumber} (${lot.quantity} units) expires on ${lot.expiryDate}.`,
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          timestamp: nowStr,
          channel: 'WHATSAPP'
        });
      }
    });
  });

  return alerts;
}

export function formatWhatsAppPayload(alert: AlertNotification) {
  return {
    template_name: 'inventory_alert_hbtx',
    broadcast_name: alert.title,
    parameters: [
      { name: 'product_name', value: alert.productName },
      { name: 'sku', value: alert.sku },
      { name: 'details', value: alert.message },
      { name: 'timestamp', value: new Date(alert.timestamp).toLocaleString('en-IN') }
    ]
  };
}
