export type UserRole = 'ADMIN' | 'STAFF';

export type Category = 'Nanoplastia' | 'Bo-tox' | 'Keratin' | 'Hair Care & Serums' | 'Smoothing & Blonder';

export type ProductSize = '50ml' | '250ml' | '300ml' | '500ml' | '1000ml' | '500g';

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRING_SOON';

export type LogType = 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT' | 'WOOCOMMERCE_ORDER' | 'WOOCOMMERCE_CANCEL' | 'WOOCOMMERCE_REFUND';

export type AdjustmentReason = 'Restock' | 'Damaged' | 'Returned' | 'Sample' | 'Sale' | 'Inventory Audit' | 'Customer Order';

export interface BatchLot {
  id: string;
  productId: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string; // ISO date format YYYY-MM-DD
  createdAt: string;
}

export interface Product {
  id: string;
  wcProductId: number;
  wcVariationId?: number;
  name: string;
  sku: string;
  category: Category;
  size: ProductSize;
  priceINR: number;
  reorderLevel: number;
  stockQuantity: number;
  batchLots: BatchLot[];
  status: StockStatus;
  imageUrl?: string;
  updatedAt: string;
}

export interface StockLog {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  batchNumber?: string;
  type: LogType;
  quantityChange: number;
  previousQuantity: number;
  newQuantity: number;
  reason: AdjustmentReason | string;
  user: string;
  timestamp: string;
}

export interface WebhookLog {
  id: string;
  eventId: string;
  eventName: string;
  payloadHash: string;
  status: 'PROCESSED' | 'IGNORED' | 'FAILED';
  timestamp: string;
}

export interface DailySummary {
  date: string;
  totalProducts: number;
  totalStockUnits: number;
  lowStockItemsCount: number;
  outOfStockItemsCount: number;
  expiringLotsCount: number;
  unitsInToday: number;
  unitsOutToday: number;
  wooOrdersCountToday: number;
  totalSalesValueINR: number;
}
