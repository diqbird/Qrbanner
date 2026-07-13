import crypto from 'crypto';
import { deliverWebhookPayload } from '@/lib/webhook-dispatch';

export type WebhookEventName = 'scan' | 'lead' | 'cta_click';

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

export interface LeadWebhookPayload {
  event: 'lead';
  qr_code_id: string;
  qr_name: string;
  short_code: string;
  lead: {
    name: string | null;
    email: string | null;
    phone: string | null;
    message: string | null;
    country: string | null;
    city: string | null;
    device: string | null;
    submitted_at: string;
  };
}

export interface CtaClickWebhookPayload {
  event: 'cta_click';
  qr_code_id: string;
  qr_name: string;
  short_code: string;
  cta: {
    label: string | null;
    country: string | null;
    city: string | null;
    device: string | null;
    clicked_at: string;
  };
}

export type OutboundWebhookPayload =
  | ScanWebhookPayload
  | LeadWebhookPayload
  | CtaClickWebhookPayload;

export function signWebhookPayload(secret: string, body: string): string {
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
}

async function dispatchUserWebhooks(
  userId: string,
  event: WebhookEventName,
  payload: OutboundWebhookPayload,
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
        event,
        body,
        payload,
      }),
    ),
  );
}

export async function dispatchScanWebhooks(
  userId: string,
  payload: ScanWebhookPayload,
): Promise<void> {
  await dispatchUserWebhooks(userId, 'scan', payload);
}

export async function dispatchLeadWebhooks(
  userId: string,
  payload: LeadWebhookPayload,
): Promise<void> {
  await dispatchUserWebhooks(userId, 'lead', payload);
}

export async function dispatchCtaWebhooks(
  userId: string,
  payload: CtaClickWebhookPayload,
): Promise<void> {
  await dispatchUserWebhooks(userId, 'cta_click', payload);
}

export function generateWebhookSecret(): string {
  return crypto.randomBytes(24).toString('hex');
}
