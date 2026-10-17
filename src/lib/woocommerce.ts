import crypto from 'crypto';

export interface WooCommerceProductSyncData {
  id: number;
  name: string;
  sku: string;
  price: string;
  stock_quantity: number | null;
  categories: { id: number; name: string; slug: string }[];
}

export function verifyWooCommerceSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader) return false;
  try {
    const computedHmac = crypto
      .createHmac('sha256', secret)
      .update(rawBody, 'utf8')
      .digest('base64');
    return crypto.timingSafeEqual(Buffer.from(computedHmac), Buffer.from(signatureHeader));
  } catch (err) {
    console.error('Signature verification error:', err);
    return false;
  }
}

/**
 * Updates stock quantity on WooCommerce via REST API
 * PUT /wp-json/wc/v3/products/<id>
 */
export async function updateWooCommerceStock(
  wcProductId: number,
  wcVariationId: number | undefined,
  newQuantity: number
): Promise<{ success: boolean; message: string }> {
  const storeUrl = process.env.WC_STORE_URL || 'https://hbtxprofessional.com';
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret || consumerKey.includes('demo')) {
    console.log(`[WC Sync Mock] Successfully updated WooCommerce ID ${wcProductId} stock to ${newQuantity}`);
    return {
      success: true,
      message: `[Demo Mode] Stock updated for WooCommerce Product ID ${wcProductId} to ${newQuantity}`
    };
  }

  try {
    const targetEndpoint = wcVariationId 
      ? `${storeUrl}/wp-json/wc/v3/products/${wcProductId}/variations/${wcVariationId}`
      : `${storeUrl}/wp-json/wc/v3/products/${wcProductId}`;

    const authHeader = 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    const response = await fetch(targetEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        manage_stock: true,
        stock_quantity: newQuantity
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`WooCommerce API Error (${response.status}): ${errText}`);
    }

    return {
      success: true,
      message: `Successfully updated WooCommerce Product ${wcProductId} stock to ${newQuantity}`
    };
  } catch (error: any) {
    console.error('Failed to sync stock to WooCommerce:', error);
    return {
      success: false,
      message: error.message || 'Failed to communicate with WooCommerce REST API'
    };
  }
}
