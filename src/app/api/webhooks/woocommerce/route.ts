import { NextResponse } from 'next/server';
import store from '@/lib/store';
import { verifyWooCommerceSignature } from '@/lib/woocommerce';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signatureHeader = request.headers.get('x-wc-webhook-signature');
    const webhookEvent = request.headers.get('x-wc-webhook-event') || 'order.updated';
    const webhookId = request.headers.get('x-wc-webhook-id') || `wh-${Date.now()}`;

    // Verify signature if secret configured in env
    const webhookSecret = process.env.WC_WEBHOOK_SECRET;
    if (webhookSecret && webhookSecret !== 'whsec_your_webhook_secret_here') {
      const isValid = verifyWooCommerceSignature(rawBody, signatureHeader, webhookSecret);
      if (!isValid) {
        return NextResponse.json({ success: false, error: 'Invalid HMAC signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);

    // Extract WooCommerce order details
    const orderId = payload.id || `WC-${Math.floor(1000 + Math.random() * 9000)}`;
    const lineItems = payload.line_items || [];

    if (lineItems.length === 0 && payload.product_id) {
      // Direct product stock update payload fallback
      lineItems.push({
        product_id: payload.product_id,
        quantity: payload.quantity || 1
      });
    }

    let processedCount = 0;
    const results = [];

    for (const item of lineItems) {
      const result = await store.processWooCommerceWebhook({
        eventId: `${webhookId}-${item.product_id}`,
        eventName: webhookEvent,
        wcProductId: item.product_id,
        quantity: item.quantity || 1,
        orderId: String(orderId)
      });
      results.push(result);
      if (result.success) processedCount++;
    }

    return NextResponse.json({
      success: true,
      processedCount,
      results,
      message: `Processed WooCommerce Webhook event ${webhookEvent} for Order #${orderId}`
    });
  } catch (error: any) {
    console.error('Error handling WooCommerce webhook:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
