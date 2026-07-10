import type { ScanWebhookPayload } from '@/lib/webhooks';

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
