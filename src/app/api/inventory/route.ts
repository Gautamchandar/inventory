import { NextResponse } from 'next/server';
import store from '@/lib/store';
import { LogType, AdjustmentReason } from '@/types/inventory';
import { generateAlertsForProducts } from '@/lib/alerts';

export async function GET() {
  const products = store.getProducts();
  const logs = store.getLogs();
  const webhookLogs = store.getWebhookLogs();
  const role = store.getRole();
  const alerts = generateAlertsForProducts(products);

  // Calculate Daily Summary metrics
  const totalStockUnits = products.reduce((acc, p) => acc + p.stockQuantity, 0);
  const lowStockItemsCount = products.filter(p => p.status === 'LOW_STOCK').length;
  const outOfStockItemsCount = products.filter(p => p.status === 'OUT_OF_STOCK').length;
  const expiringLotsCount = products.filter(p => p.status === 'EXPIRING_SOON').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const logsToday = logs.filter(l => l.timestamp.startsWith(todayStr));
  
  const unitsInToday = logsToday
    .filter(l => l.type === 'STOCK_IN' || (l.type === 'ADJUSTMENT' && l.quantityChange > 0))
    .reduce((sum, l) => sum + l.quantityChange, 0);

  const unitsOutToday = logsToday
    .filter(l => l.type === 'STOCK_OUT' || l.type === 'WOOCOMMERCE_ORDER' || (l.type === 'ADJUSTMENT' && l.quantityChange < 0))
    .reduce((sum, l) => sum + Math.abs(l.quantityChange), 0);

  const wooOrdersCountToday = logsToday.filter(l => l.type === 'WOOCOMMERCE_ORDER').length;

  return NextResponse.json({
    success: true,
    role,
    products,
    logs,
    webhookLogs,
    alerts,
    dailySummary: {
      date: todayStr,
      totalProducts: products.length,
      totalStockUnits,
      lowStockItemsCount,
      outOfStockItemsCount,
      expiringLotsCount,
      unitsInToday,
      unitsOutToday,
      wooOrdersCountToday,
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, batchNumber, expiryDate, type, quantityChange, reason, user } = body;

    if (!productId || !type || quantityChange === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters (productId, type, quantityChange).' },
        { status: 400 }
      );
    }

    const result = await store.adjustStock({
      productId,
      batchNumber: batchNumber || 'DEFAULT-BATCH',
      expiryDate: expiryDate || '2027-12-31',
      type: type as LogType,
      quantityChange: Number(quantityChange),
      reason: reason || 'Manual Adjustment',
      user: user || 'Admin'
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: error.message?.includes('Unauthorized') ? 403 : 400 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (body.role && (body.role === 'ADMIN' || body.role === 'STAFF')) {
      store.setRole(body.role);
      return NextResponse.json({ success: true, role: store.getRole() });
    }
    return NextResponse.json({ success: false, error: 'Invalid role.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
