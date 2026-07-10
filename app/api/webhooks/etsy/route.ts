export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import {
  isEtsyWebhookConfigured,
  parseEtsyWebhookBody,
  verifyEtsyWebhookAuth,
} from '@/lib/etsy-webhook';
import { normalizeStudioEmail, registerEtsyStudioOrder, studioPublicUrl } from '@/lib/studio-entitlement';

export async function POST(req: NextRequest) {
  if (!isEtsyWebhookConfigured()) {
    return NextResponse.json({ error: 'webhook_not_configured' }, { status: 503 });
  }

  if (!verifyEtsyWebhookAuth(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const order = parseEtsyWebhookBody(body);
  if (!order) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  try {
    const { row, created } = await registerEtsyStudioOrder({
      buyerEmail: normalizeStudioEmail(order.buyerEmail),
      externalOrderId: order.externalOrderId,
      notes: order.notes,
      maxQr: 5,
    });

    return NextResponse.json({
      ok: true,
      id: row.id,
      created,
      deliveryStatus: row.deliveryStatus,
      url: studioPublicUrl(row.token),
    });
  } catch (err) {
    console.error('[webhooks/etsy]', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
