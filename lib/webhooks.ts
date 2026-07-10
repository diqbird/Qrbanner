import crypto from 'crypto';
import { deliverWebhookPayload } from '@/lib/webhook-dispatch';

export interface ScanWebhookPayload {
  event: 'scan';
  qr_code_id: string;
  qr_name: string;
  short_code: string;
  scan: {
    country: string | null;
    city: string | null;
    device: string | null;
    browser: string | null;
    os: string | null;
    scanned_at: string;
  };
}

export function signWebhookPayload(secret: string, body: string): string {
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
}

export async function dispatchScanWebhooks(
  userId: string,
  payload: ScanWebhookPayload
): Promise<void> {
  const { prisma } = await import('@/lib/db');
  const endpoints = await prisma.webhookEndpoint.findMany({
    where: { userId, enabled: true },
    take: 10,
  });
  if (!endpoints.length) return;

  const body = JSON.stringify(payload);

  await Promise.allSettled(
    endpoints.map((ep) =>
      deliverWebhookPayload({
        endpoint: ep,
        userId,
        event: 'scan',
        body,
        payload,
      })
    )
  );
}

export function generateWebhookSecret(): string {
  return crypto.randomBytes(24).toString('hex');
}
