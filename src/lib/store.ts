import { Product, BatchLot, StockLog, WebhookLog, LogType, AdjustmentReason, UserRole, Category, ProductSize } from '../types/inventory';
import { updateWooCommerceStock } from './woocommerce';
import { check60DayExpiry } from './alerts';

// Official HBTX Professional Catalog with images matching PDF product catalog
const initialProducts: Product[] = [
  // --- NANOPLASTIA SHINE BOOST SERIES ---
  {
    id: 'prod-nano-1',
    wcProductId: 3381,
    name: 'Shine Boost Nanoplastia Clarifying Shampoo',
    sku: 'HBTX-NANO-CLSH-500',
    category: 'Nanoplastia',
    size: '500ml',
    priceINR: 1200,
    reorderLevel: 15,
    stockQuantity: 42,
    status: 'IN_STOCK',
    updatedAt: new Date().toISOString(),
    batchLots: [
      {
        id: 'lot-nano-101',
        productId: 'prod-nano-1',
        batchNumber: 'NANO-CL-2025-01',
        quantity: 42,
        expiryDate: '2027-11-15',
        createdAt: '2025-01-10'
      }
    ]
  },
  {
    id: 'prod-nano-2',
    wcProductId: 3382,
    name: 'Shine Boost Nanoplastia Treatment',
    sku: 'HBTX-NANO-TRT-1000',
    category: 'Nanoplastia',
    size: '1000ml',
    priceINR: 28999,
    reorderLevel: 5,
    stockQuantity: 4,
    status: 'LOW_STOCK',
    updatedAt: new Date().toISOString(),
    batchLots: [
      {
        id: 'lot-nano-102',
        productId: 'prod-nano-2',
        batchNumber: 'NANO-TRT-2026-X',
        quantity: 4,
        expiryDate: '2026-11-28',
        createdAt: '2026-01-05'
      }
    ]
  },
  {
    id: 'prod-nano-3',
    wcProductId: 3383,
    name: 'Shine Boost Nanoplastia Hair Shampoo (300ml)',
    sku: 'HBTX-NANO-SH-300',
    category: 'Nanoplastia',
    size: '300ml',
    priceINR: 1200,
    reorderLevel: 20,
    stockQuantity: 35,
    status: 'IN_STOCK',
    updatedAt: new Date().toISOString(),
    batchLots: [
      {
        id: 'lot-nano-103',
        productId: 'prod-nano-3',
        batchNumber: 'NANO-SH300-25',
        quantity: 35,
        expiryDate: '2027-08-20',
        createdAt: '2025-06-12'
      }
    ]
  },
  {
    id: 'prod-nano-4',
    wcProductId: 3384,
    name: 'Shine Boost Nanoplastia Hair Shampoo (500ml)',
    sku: 'HBTX-NANO-SH-500',
    category: 'Nanoplastia',
    size: '500ml',
    priceINR: 1200,
    reorderLevel: 15,
    stockQuantity: 18,
    status: 'IN_STOCK',
    updatedAt: new Date().toISOString(),
    batchLots: [
      {
        id: 'lot-nano-104',
        productId: 'prod-nano-4',
        batchNumber: 'NANO-SH500-26',
        quantity: 18,
        expiryDate: '2027-09-10',
        createdAt: '2026-02-14'
      }
    ]
  },
  {
    id: 'prod-nano-5',
    wcProductId: 3385,
    name: 'Shine Boost Nanoplastia Hair Conditioner',
    sku: 'HBTX-NANO-CND-500',
    category: 'Nanoplastia',
    size: '500ml',
    priceINR: 1200,
    reorderLevel: 15,
    stockQuantity: 28,
    status: 'IN_STOCK',
    updatedAt: new Date().toISOString(),
    batchLots: [
      {
        id: 'lot-nano-105',
        productId: 'prod-nano-5',
        batchNumber: 'NANO-CND-2026-A',
        quantity: 28,
        expiryDate: '2027-10-05',
        createdAt: '2026-03-01'
      }
    ]
  },
  {
    id: 'prod-nano-6',
    wcProductId: 3386,
    name: 'Shine Boost Nanoplastia Hair Mask',
    sku: 'HBTX-NANO-MSK-250',
    category: 'Nanoplastia',
    size: '250ml',
    priceINR: 1200,
    reorderLevel: 10,
    stockQuantity: 0,
    status: 'OUT_OF_STOCK',
    updatedAt: new Date().toISOString(),
    batchLots: []
  },
  {
    id: 'prod-nano-7',
    wcProductId: 3387,
    name: 'Shine Boost Argan Oil Hair Serum',
    sku: 'HBTX-NANO-SER-50',
    category: 'Hair Care & Serums',
    size: '50ml',
    priceINR: 1200,
    reorderLevel: 25,
    stockQuantity: 60,
    status: 'IN_STOCK',
    updatedAt: new Date().toISOString(),
    batchLots: [
      {
        id: 'lot-nano-107',
        productId: 'prod-nano-7',
        batchNumber: 'SER-ARGAN-2026',
        quantity: 60,
        expiryDate: '2028-04-15',
        createdAt: '2026-04-01'
      }
    ]
  },

  // --- BOTOX PREMIUM SERIES ---
  {
    id: 'prod-btx-1',
    wcProductId: 3470,
    name: 'Botox Post Care Shampoo',
    sku: 'HBTX-BTX-PCSH-300',
    category: 'Bo-tox',
    size: '300ml',
    priceINR: 1050,
    reorderLevel: 15,
    stockQuantity: 50,
    status: 'IN_STOCK',
    updatedAt: new Date().toISOString(),
    batchLots: [
      {
        id: 'lot-btx-201',
        productId: 'prod-btx-1',
        batchNumber: 'BTX-PCSH-2025-01',
        quantity: 50,
        expiryDate: '2027-08-30',
        createdAt: '2025-08-10'
      }
    ]
  },
  {
    id: 'prod-btx-2',
    wcProductId: 3471,
    name: 'Botox Conditioning Hair Mask (300ml)',
    sku: 'HBTX-BTX-CNDMSK-300',
    category: 'Bo-tox',
    size: '300ml',
    priceINR: 1250,
    reorderLevel: 15,
    stockQuantity: 22,
    status: 'IN_STOCK',
    updatedAt: new Date().toISOString(),
    batchLots: [
      {
        id: 'lot-btx-202',
        productId: 'prod-btx-2',
        batchNumber: 'BTX-CMSK-2026-02',
        quantity: 22,
        expiryDate: '2027-09-12',
        createdAt: '2026-02-01'
      }
    ]
  },
  {
    id: 'prod-btx-3',
    wcProductId: 3472,
    name: 'Botox Premium Hair Mask (500ml)',
    sku: 'HBTX-BTX-MSK-500',
    category: 'Bo-tox',
    size: '500ml',
    priceINR: 1950,
    reorderLevel: 12,
    stockQuantity: 14,
    status: 'IN_STOCK',
    updatedAt: new Date().toISOString(),
    batchLots: [
      {
        id: 'lot-btx-203',
        productId: 'prod-btx-3',
        batchNumber: 'BTX-MSK500-2025',
        quantity: 14,
        expiryDate: '2027-07-20',
        createdAt: '2025-07-01'
      }
    ]
  },
  {
    id: 'prod-btx-4',
    wcProductId: 3473,
    name: 'Botox Clarifying Shampoo (500ml)',
    sku: 'HBTX-BTX-CLSH-500',
    category: 'Bo-tox',
    size: '500ml',
    priceINR: 1200,
    reorderLevel: 15,
    stockQuantity: 8,
    status: 'LOW_STOCK',
    updatedAt: new Date().toISOString(),
    batchLots: [
      {
        id: 'lot-btx-204',
        productId: 'prod-btx-4',
        batchNumber: 'BTX-CLSH-2025-05',
        quantity: 8,
        expiryDate: '2027-05-18',
        createdAt: '2025-05-01'
      }
    ]
  },
  {
    id: 'prod-btx-5',
    wcProductId: 3474,
    name: 'Botox Premium Hair Treatment',
    sku: 'HBTX-BTX-TRT-1000',
    category: 'Bo-tox',
    size: '1000ml',
    priceINR: 32500,
    reorderLevel: 5,
    stockQuantity: 3,
    status: 'LOW_STOCK',
    updatedAt: new Date().toISOString(),
    batchLots: [
      {
        id: 'lot-btx-205',
        productId: 'prod-btx-5',
        batchNumber: 'BTX-TRT-1000-VIP',
        quantity: 3,
        expiryDate: '2026-11-15',
        createdAt: '2025-10-10'
      }
    ]
  },

  // --- HI PRO KERATIN SERIES ---
  {
    id: 'prod-krt-1',
    wcProductId: 3501,
    name: 'HBTX Hi Pro Keratin Treatment',
    sku: 'HBTX-KRT-TRT-1000',
    category: 'Keratin',
    size: '1000ml',
    priceINR: 14999,
    reorderLevel: 8,
    stockQuantity: 12,
    status: 'IN_STOCK',
    updatedAt: new Date().toISOString(),
    batchLots: [
      {
        id: 'lot-krt-301',
        productId: 'prod-krt-1',
        batchNumber: 'KRT-TRT-2026-A',
        quantity: 12,
        expiryDate: '2027-12-01',
        createdAt: '2026-01-15'
      }
    ]
  },
  {
    id: 'prod-krt-2',
    wcProductId: 3502,
    name: 'HBTX Hi Pro Keratin Shampoo (300ml)',
    sku: 'HBTX-KRT-SH-300',
    category: 'Keratin',
    size: '300ml',
    priceINR: 899,
    reorderLevel: 20,
    stockQuantity: 45,
    status: 'IN_STOCK',
    updatedAt: new Date().toISOString(),
    batchLots: [
      {
        id: 'lot-krt-302',
        productId: 'prod-krt-2',
        batchNumber: 'KRT-SH300-2026',
        quantity: 45,
        expiryDate: '2028-02-28',
        createdAt: '2026-02-10'
      }
    ]
  },
  {
    id: 'prod-krt-3',
    wcProductId: 3503,
    name: 'HBTX Hi Pro Keratin Shampoo (500ml)',
    sku: 'HBTX-KRT-SH-500',
    category: 'Keratin',
    size: '500ml',
    priceINR: 1699,
    reorderLevel: 15,
    stockQuantity: 26,
    status: 'IN_STOCK',
    updatedAt: new Date().toISOString(),
    batchLots: [
      {
        id: 'lot-krt-303',
        productId: 'prod-krt-3',
        batchNumber: 'KRT-SH500-2026',
        quantity: 26,
        expiryDate: '2028-03-15',
        createdAt: '2026-03-01'
      }
    ]
  },
  {
    id: 'prod-krt-4',
    wcProductId: 3504,
    name: 'HBTX Hi Pro Keratin Conditioner (300ml)',
    sku: 'HBTX-KRT-CND-300',
    category: 'Keratin',
    size: '300ml',
    priceINR: 899,
    reorderLevel: 20,
    stockQuantity: 30,
    status: 'IN_STOCK',
    updatedAt: new Date().toISOString(),
    batchLots: [
      {
        id: 'lot-krt-304',
        productId: 'prod-krt-4',
        batchNumber: 'KRT-CND300-2026',
        quantity: 30,
        expiryDate: '2028-01-20',
        createdAt: '2026-01-20'
      }
    ]
  },
  {
    id: 'prod-krt-5',
    wcProductId: 3505,
    name: 'HBTX Hi Pro Keratin Conditioner (500ml)',
    sku: 'HBTX-KRT-CND-500',
    category: 'Keratin',
    size: '500ml',
    priceINR: 1699,
    reorderLevel: 15,
    stockQuantity: 19,
    status: 'IN_STOCK',
    updatedAt: new Date().toISOString(),
    batchLots: [
      {
        id: 'lot-krt-305',
        productId: 'prod-krt-5',
        batchNumber: 'KRT-CND500-2026',
        quantity: 19,
        expiryDate: '2028-02-14',
        createdAt: '2026-02-14'
      }
    ]
  },
  {
    id: 'prod-krt-6',
    wcProductId: 3506,
    name: 'HBTX Hi Pro Keratin Pre Shampoo',
    sku: 'HBTX-KRT-PRESH-500',
    category: 'Keratin',
    size: '500ml',
    priceINR: 899,
    reorderLevel: 15,
    stockQuantity: 38,
    status: 'IN_STOCK',
    updatedAt: new Date().toISOString(),
    batchLots: [
      {
        id: 'lot-krt-306',
        productId: 'prod-krt-6',
        batchNumber: 'KRT-PRE-2025-11',
        quantity: 38,
        expiryDate: '2027-11-30',
        createdAt: '2025-11-15'
      }
    ]
  },
  {
    id: 'prod-krt-7',
    wcProductId: 3507,
    name: 'HBTX Hi Pro Keratin Hair Mask',
    sku: 'HBTX-KRT-MSK-250',
    category: 'Keratin',
    size: '250ml',
    priceINR: 1299,
    reorderLevel: 15,
    stockQuantity: 24,
    status: 'IN_STOCK',
    updatedAt: new Date().toISOString(),
    batchLots: [
      {
        id: 'lot-krt-307',
        productId: 'prod-krt-7',
        batchNumber: 'KRT-MSK250-2026',
        quantity: 24,
        expiryDate: '2027-10-10',
        createdAt: '2026-01-10'
      }
    ]
  },

  // --- SMOOTHING, BLONDER & OILS ---
  {
    id: 'prod-smth-1',
    wcProductId: 3601,
    name: 'Shine Boost Smoothing Hair Cream & Neutralizer',
    sku: 'HBTX-SMOOTH-500',
    category: 'Smoothing & Blonder',
    size: '500ml',
    priceINR: 1200,
    reorderLevel: 10,
    stockQuantity: 15,
    status: 'IN_STOCK',
    updatedAt: new Date().toISOString(),
    batchLots: [
      {
        id: 'lot-smth-401',
        productId: 'prod-smth-1',
        batchNumber: 'SMOOTH-2026-A',
        quantity: 15,
        expiryDate: '2027-12-31',
        createdAt: '2026-01-01'
      }
    ]
  },
  {
    id: 'prod-smth-2',
    wcProductId: 3602,
    name: 'HBTX High Performance Blonder Powder Lightener',
    sku: 'HBTX-BLND-500G',
    category: 'Smoothing & Blonder',
    size: '500g',
    priceINR: 1350,
    reorderLevel: 12,
    stockQuantity: 32,
    status: 'IN_STOCK',
    updatedAt: new Date().toISOString(),
    batchLots: [
      {
        id: 'lot-smth-402',
        productId: 'prod-smth-2',
        batchNumber: 'BLND-500G-2026',
        quantity: 32,
        expiryDate: '2028-06-30',
        createdAt: '2026-05-15'
      }
    ]
  },
  {
    id: 'prod-smth-3',
    wcProductId: 3603,
    name: 'HBTX Argan Oil Serum',
    sku: 'HBTX-ARG-SER-50',
    category: 'Hair Care & Serums',
    size: '50ml',
    priceINR: 1299,
    reorderLevel: 20,
    stockQuantity: 55,
    status: 'IN_STOCK',
    updatedAt: new Date().toISOString(),
    batchLots: [
      {
        id: 'lot-smth-403',
        productId: 'prod-smth-3',
        batchNumber: 'ARG-SER-2026-08',
        quantity: 55,
        expiryDate: '2028-08-01',
        createdAt: '2026-08-01'
      }
    ]
  }
];

const initialLogs: StockLog[] = [
  {
    id: 'log-1',
    productId: 'prod-nano-1',
    productName: 'Shine Boost Nanoplastia Clarifying Shampoo',
    sku: 'HBTX-NANO-CLSH-500',
    batchNumber: 'NANO-CL-2025-01',
    type: 'STOCK_IN',
    quantityChange: 42,
    previousQuantity: 0,
    newQuantity: 42,
    reason: 'Restock / New Arrival',
    user: 'pawan508 (ADMIN)',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'log-2',
    productId: 'prod-nano-2',
    productName: 'Shine Boost Nanoplastia Treatment',
    sku: 'HBTX-NANO-TRT-1000',
    batchNumber: 'NANO-TRT-2026-X',
    type: 'WOOCOMMERCE_ORDER',
    quantityChange: -1,
    previousQuantity: 5,
    newQuantity: 4,
    reason: 'Customer Order #WC-1049',
    user: 'WooCommerce System',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'log-3',
    productId: 'prod-btx-1',
    productName: 'Botox Post Care Shampoo',
    sku: 'HBTX-BTX-PCSH-300',
    batchNumber: 'BTX-PCSH-2025-01',
    type: 'STOCK_OUT',
    quantityChange: -2,
    previousQuantity: 52,
    newQuantity: 50,
    reason: 'Salon Sample / Tester Unit',
    user: 'hbtxstaff (STAFF)',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

class InventoryStore {
  private products: Product[] = initialProducts;
  private stockLogs: StockLog[] = initialLogs;
  private webhookLogs: WebhookLog[] = [];
  private currentRole: UserRole = 'ADMIN';
  private listeners: (() => void)[] = [];

  constructor() {
    this.recalculateStatuses();
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  public getRole(): UserRole {
    return this.currentRole;
  }

  public setRole(role: UserRole) {
    this.currentRole = role;
    this.notify();
  }

  public getProducts(): Product[] {
    return this.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  public getLogs(): StockLog[] {
    return this.stockLogs;
  }

  public getWebhookLogs(): WebhookLog[] {
    return this.webhookLogs;
  }

  private recalculateStatuses() {
    this.products.forEach(product => {
      const lotSum = product.batchLots.reduce((sum, lot) => sum + lot.quantity, 0);
      product.stockQuantity = lotSum;

      const hasExpiringLot = product.batchLots.some(lot => lot.quantity > 0 && check60DayExpiry(lot.expiryDate));

      if (product.stockQuantity <= 0) {
        product.status = 'OUT_OF_STOCK';
      } else if (hasExpiringLot) {
        product.status = 'EXPIRING_SOON';
      } else if (product.stockQuantity <= product.reorderLevel) {
        product.status = 'LOW_STOCK';
      } else {
        product.status = 'IN_STOCK';
      }
      product.updatedAt = new Date().toISOString();
    });
  }

  /**
   * Add a new product to the catalog
   */
  public addNewProduct(params: {
    name: string;
    sku: string;
    category: Category;
    size: ProductSize;
    priceINR: number;
    reorderLevel: number;
    initialStock: number;
    batchNumber: string;
    expiryDate: string;
    user: string;
  }): Product {
    const existing = this.products.find(p => p.sku.toLowerCase() === params.sku.toLowerCase());
    if (existing) {
      throw new Error(`Product with SKU "${params.sku}" already exists in catalog.`);
    }

    const newProdId = `prod-${Date.now()}`;
    const newLotId = `lot-${Date.now()}`;
    const wcId = Math.floor(4000 + Math.random() * 5000);

    const newProduct: Product = {
      id: newProdId,
      wcProductId: wcId,
      name: params.name,
      sku: params.sku.toUpperCase(),
      category: params.category,
      size: params.size,
      priceINR: Number(params.priceINR),
      reorderLevel: Number(params.reorderLevel),
      stockQuantity: Number(params.initialStock),
      status: Number(params.initialStock) > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK',
      updatedAt: new Date().toISOString(),
      batchLots: params.initialStock > 0 ? [
        {
          id: newLotId,
          productId: newProdId,
          batchNumber: params.batchNumber || `LOT-${new Date().getFullYear()}-01`,
          quantity: Number(params.initialStock),
          expiryDate: params.expiryDate || '2027-12-31',
          createdAt: new Date().toISOString().split('T')[0]
        }
      ] : []
    };

    this.products.unshift(newProduct);
    this.recalculateStatuses();

    // Log creation
    this.stockLogs.unshift({
      id: `log-${Date.now()}`,
      productId: newProduct.id,
      productName: newProduct.name,
      sku: newProduct.sku,
      batchNumber: params.batchNumber || 'NEW-SKU',
      type: 'STOCK_IN',
      quantityChange: Number(params.initialStock),
      previousQuantity: 0,
      newQuantity: Number(params.initialStock),
      reason: 'New Product Added to Catalog',
      user: params.user || 'pawan508 (ADMIN)',
      timestamp: new Date().toISOString()
    });

    this.notify();
    return newProduct;
  }

  /**
   * Delete a product SKU from catalog
   */
  public deleteProduct(productId: string, user: string): boolean {
    const idx = this.products.findIndex(p => p.id === productId);
    if (idx === -1) return false;

    const removedProduct = this.products[idx];
    this.products.splice(idx, 1);

    // Log deletion
    this.stockLogs.unshift({
      id: `log-${Date.now()}`,
      productId: removedProduct.id,
      productName: removedProduct.name,
      sku: removedProduct.sku,
      type: 'STOCK_OUT',
      quantityChange: -removedProduct.stockQuantity,
      previousQuantity: removedProduct.stockQuantity,
      newQuantity: 0,
      reason: `Product SKU ${removedProduct.sku} Deleted from Catalog`,
      user: user || 'pawan508 (ADMIN)',
      timestamp: new Date().toISOString()
    });

    this.notify();
    return true;
  }

  /**
   * Manual Stock Adjustment / Stock In / Stock Out
   */
  public async adjustStock(params: {
    productId: string;
    batchNumber: string;
    expiryDate: string;
    type: LogType;
    quantityChange: number;
    reason: AdjustmentReason | string;
    user: string;
  }): Promise<{ success: boolean; product: Product; message: string }> {
    const product = this.getProductById(params.productId);
    if (!product) {
      throw new Error(`Product with ID ${params.productId} not found.`);
    }

    const prevTotalQty = product.stockQuantity;
    const requestedNewQty = prevTotalQty + params.quantityChange;

    if (requestedNewQty < 0) {
      throw new Error(`Invalid stock change: Current stock is ${prevTotalQty}. Cannot remove ${Math.abs(params.quantityChange)} units.`);
    }

    let targetLot = product.batchLots.find(l => l.batchNumber === params.batchNumber);

    if (params.quantityChange > 0) {
      if (targetLot) {
        targetLot.quantity += params.quantityChange;
      } else {
        targetLot = {
          id: `lot-${Date.now()}`,
          productId: product.id,
          batchNumber: params.batchNumber,
          quantity: params.quantityChange,
          expiryDate: params.expiryDate,
          createdAt: new Date().toISOString().split('T')[0]
        };
        product.batchLots.push(targetLot);
      }
    } else {
      let remToRemove = Math.abs(params.quantityChange);

      if (targetLot) {
        if (targetLot.quantity < remToRemove) {
          throw new Error(`Batch #${params.batchNumber} has only ${targetLot.quantity} units available.`);
        }
        targetLot.quantity -= remToRemove;
      } else {
        const sortedLots = [...product.batchLots].sort((a, b) => 
          new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
        );

        for (const lot of sortedLots) {
          if (remToRemove <= 0) break;
          const take = Math.min(lot.quantity, remToRemove);
          lot.quantity -= take;
          remToRemove -= take;
        }
      }
    }

    this.recalculateStatuses();

    const newLog: StockLog = {
      id: `log-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      batchNumber: params.batchNumber || targetLot?.batchNumber,
      type: params.type,
      quantityChange: params.quantityChange,
      previousQuantity: prevTotalQty,
      newQuantity: product.stockQuantity,
      reason: params.reason,
      user: params.user || (this.currentRole === 'ADMIN' ? 'pawan508 (ADMIN)' : 'hbtxstaff (STAFF)'),
      timestamp: new Date().toISOString()
    };
    this.stockLogs.unshift(newLog);

    const syncRes = await updateWooCommerceStock(product.wcProductId, product.wcVariationId, product.stockQuantity);

    this.notify();

    return {
      success: true,
      product,
      message: `Stock updated to ${product.stockQuantity} units. ${syncRes.message}`
    };
  }

  public async processWooCommerceWebhook(params: {
    eventId: string;
    eventName: string;
    wcProductId: number;
    quantity: number;
    orderId: string;
  }): Promise<{ success: boolean; message: string; duplicate?: boolean }> {
    const existing = this.webhookLogs.find(w => w.eventId === params.eventId);
    if (existing) {
      return {
        success: true,
        message: `Duplicate webhook event ${params.eventId} ignored`,
        duplicate: true
      };
    }

    const product = this.products.find(p => p.wcProductId === params.wcProductId);
    if (!product) {
      this.webhookLogs.push({
        id: `wh-${Date.now()}`,
        eventId: params.eventId,
        eventName: params.eventName,
        payloadHash: `wc-${params.wcProductId}`,
        status: 'FAILED',
        timestamp: new Date().toISOString()
      });
      return {
        success: false,
        message: `Product with WooCommerce ID ${params.wcProductId} not found in inventory dashboard.`
      };
    }

    const isRefund = params.eventName.includes('refund') || params.eventName.includes('cancel') || params.quantity < 0;
    const changeQty = isRefund ? Math.abs(params.quantity) : -Math.abs(params.quantity);

    const prevQty = product.stockQuantity;

    let rem = Math.abs(changeQty);
    if (changeQty < 0) {
      const sortedLots = [...product.batchLots].sort((a, b) => 
        new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
      );
      for (const lot of sortedLots) {
        if (rem <= 0) break;
        const deduct = Math.min(lot.quantity, rem);
        lot.quantity -= deduct;
        rem -= deduct;
      }
    } else {
      if (product.batchLots.length > 0) {
        product.batchLots[0].quantity += rem;
      }
    }

    this.recalculateStatuses();

    this.stockLogs.unshift({
      id: `log-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      batchNumber: product.batchLots[0]?.batchNumber || 'MAIN',
      type: isRefund ? 'WOOCOMMERCE_REFUND' : 'WOOCOMMERCE_ORDER',
      quantityChange: changeQty,
      previousQuantity: prevQty,
      newQuantity: product.stockQuantity,
      reason: `WooCommerce ${params.eventName} #${params.orderId}`,
      user: 'WooCommerce System',
      timestamp: new Date().toISOString()
    });

    this.webhookLogs.push({
      id: `wh-${Date.now()}`,
      eventId: params.eventId,
      eventName: params.eventName,
      payloadHash: `order-${params.orderId}`,
      status: 'PROCESSED',
      timestamp: new Date().toISOString()
    });

    this.notify();

    return {
      success: true,
      message: `Processed WooCommerce ${params.eventName} #${params.orderId}. New stock: ${product.stockQuantity}`
    };
  }

  public bulkUpdateProducts(updates: Array<{ wcProductId: number; stockQuantity: number; name?: string; sku?: string; priceINR?: number }>) {
    updates.forEach(up => {
      let prod = this.products.find(p => p.wcProductId === up.wcProductId);
      if (prod) {
        if (up.name) prod.name = up.name;
        if (up.sku) prod.sku = up.sku;
        if (up.priceINR) prod.priceINR = up.priceINR;

        if (prod.batchLots.length > 0) {
          prod.batchLots[0].quantity = Math.max(0, up.stockQuantity);
        } else {
          prod.batchLots.push({
            id: `lot-sync-${Date.now()}`,
            productId: prod.id,
            batchNumber: 'SYNC-LOT',
            quantity: Math.max(0, up.stockQuantity),
            expiryDate: '2027-12-31',
            createdAt: new Date().toISOString().split('T')[0]
          });
        }
      }
    });

    this.recalculateStatuses();
    this.notify();
  }
}

const globalStore = (global as any).inventoryStore || new InventoryStore();
if (process.env.NODE_ENV !== 'production') {
  (global as any).inventoryStore = globalStore;
}

export default globalStore as InventoryStore;
