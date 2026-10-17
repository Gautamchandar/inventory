import { NextResponse } from 'next/server';
import store from '@/lib/store';
import { generateAlertsForProducts, formatWhatsAppPayload } from '@/lib/alerts';

export async function GET() {
  const products = store.getProducts();
  const alerts = generateAlertsForProducts(products);
  const whatsAppPayloads = alerts.map(formatWhatsAppPayload);

  return NextResponse.json({
    success: true,
    alertCount: alerts.length,
    alerts,
    whatsAppPayloads
  });
}
