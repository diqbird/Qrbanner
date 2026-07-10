import { describe, expect, it } from 'vitest';
import { parseEtsyWebhookBody, verifyEtsyWebhookAuth } from '@/lib/etsy-webhook';
import { resolveStudioDeliveryLocale } from '@/lib/studio-delivery-locale';

describe('etsy webhook', () => {
  it('parses direct payload', () => {
    expect(
      parseEtsyWebhookBody({
        buyerEmail: 'buyer@example.com',
        externalOrderId: '12345',
      }),
    ).toEqual({
      buyerEmail: 'buyer@example.com',
      externalOrderId: '12345',
      notes: undefined,
    });
  });

  it('parses nested Etsy-style payload', () => {
    expect(
      parseEtsyWebhookBody({
        event_type: 'receipt.created',
        data: { buyer_email: 'buyer@example.com', receipt_id: 99 },
      }),
    ).toMatchObject({
      buyerEmail: 'buyer@example.com',
      externalOrderId: '99',
    });
  });

  it('verifies bearer secret', () => {
    const prev = process.env.ETSY_WEBHOOK_SECRET;
    process.env.ETSY_WEBHOOK_SECRET = 'test-secret';
    const req = new Request('https://qrbanner.com/api/webhooks/etsy', {
      headers: { authorization: 'Bearer test-secret' },
    });
    expect(verifyEtsyWebhookAuth(req)).toBe(true);
    process.env.ETSY_WEBHOOK_SECRET = prev;
  });
});

describe('resolveStudioDeliveryLocale', () => {
  it('detects Turkish from notes', () => {
    expect(resolveStudioDeliveryLocale('Etsy TR buyer locale:tr')).toBe('tr');
    expect(resolveStudioDeliveryLocale('locale=en')).toBe('en');
  });
});
