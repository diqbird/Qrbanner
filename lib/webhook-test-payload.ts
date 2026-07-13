import type {
  CtaClickWebhookPayload,
  LeadWebhookPayload,
  ScanWebhookPayload,
  WebhookEventName,
} from '@/lib/webhooks';

/** Sample payload for webhook test deliveries and docs. */
export function buildTestScanWebhookPayload(): ScanWebhookPayload {
  return {
    event: 'scan',
    qr_code_id: 'test_qr_id',
    qr_name: 'Webhook test',
    short_code: 'test01',
    scan: {
      country: 'US',
      city: 'San Francisco',
      device: 'desktop',
      browser: 'Chrome',
      os: 'macOS',
      scanned_at: new Date().toISOString(),
    },
  };
}

export function buildTestLeadWebhookPayload(): LeadWebhookPayload {
  return {
    event: 'lead',
    qr_code_id: 'test_qr_id',
    qr_name: 'Webhook test',
    short_code: 'test01',
    lead: {
      name: 'Alex Example',
      email: 'alex@example.com',
      phone: '+15550100',
      message: 'Please contact me about catering.',
      country: 'US',
      city: 'San Francisco',
      device: 'mobile',
      submitted_at: new Date().toISOString(),
    },
  };
}

export function buildTestCtaWebhookPayload(): CtaClickWebhookPayload {
  return {
    event: 'cta_click',
    qr_code_id: 'test_qr_id',
    qr_name: 'Webhook test',
    short_code: 'test01',
    cta: {
      label: 'Order online',
      country: 'US',
      city: 'San Francisco',
      device: 'mobile',
      clicked_at: new Date().toISOString(),
    },
  };
}

export function buildTestWebhookPayload(event: WebhookEventName = 'scan') {
  if (event === 'lead') return buildTestLeadWebhookPayload();
  if (event === 'cta_click') return buildTestCtaWebhookPayload();
  return buildTestScanWebhookPayload();
}

export function parseWebhookTestEvent(raw: unknown): WebhookEventName {
  const v = String(raw ?? 'scan').trim().toLowerCase();
  if (v === 'lead' || v === 'cta_click' || v === 'scan') return v;
  return 'scan';
}

export const WEBHOOK_SIGNATURE_HEADER = 'X-QRbanner-Signature';
export const WEBHOOK_EVENT_HEADER = 'X-QRbanner-Event';
export const WEBHOOK_ATTEMPT_HEADER = 'X-QRbanner-Delivery-Attempt';

export const WEBHOOK_VERIFY_NODE_EXAMPLE = `const crypto = require('crypto');

function verifyWebhook(body, signatureHeader, secret) {
  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signatureHeader),
    Buffer.from(expected)
  );
}`;
