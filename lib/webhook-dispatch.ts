import { assertSafeOutboundUrl } from '@/lib/outbound-url';
import { recordWebhookDelivery } from '@/lib/webhook-deliveries';
import { signWebhookPayload } from '@/lib/webhooks';

const RETRY_DELAYS_MS = [0, 1500, 3000];
const MAX_ATTEMPTS = RETRY_DELAYS_MS.length;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type WebhookEndpointRef = {
  id: string;
  url: string;
  secret: string;
};

export async function deliverWebhookPayload(input: {
  endpoint: WebhookEndpointRef;
  userId: string;
  event: string;
  body: string;
  payload: object;
  attemptOffset?: number;
}): Promise<{ success: boolean; statusCode: number | null; error: string | null; durationMs: number }> {
  const { endpoint, userId, event, body, payload, attemptOffset = 0 } = input;
  const started = Date.now();
  let statusCode: number | null = null;
  let success = false;
  let error: string | null = null;
  let attemptsUsed = 0;

  const urlCheck = assertSafeOutboundUrl(endpoint.url);
  if (!urlCheck.ok) {
    error = urlCheck.error;
    await recordWebhookDelivery({
      endpointId: endpoint.id,
      userId,
      event,
      statusCode: null,
      success: false,
      error,
      durationMs: Date.now() - started,
      payload,
      attempt: attemptOffset + 1,
    });
    return { success: false, statusCode: null, error, durationMs: Date.now() - started };
  }

  const signature = signWebhookPayload(endpoint.secret, body);

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    attemptsUsed = i + 1;
    if (RETRY_DELAYS_MS[i] > 0) await sleep(RETRY_DELAYS_MS[i]);

    try {
      const res = await fetch(urlCheck.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'QRbanner-Webhooks/1.0',
          'X-QRbanner-Event': event,
          'X-QRbanner-Signature': `sha256=${signature}`,
          'X-QRbanner-Delivery-Attempt': String(attemptOffset + attemptsUsed),
        },
        body,
        signal: AbortSignal.timeout(8000),
      });
      statusCode = res.status;
      if (res.ok) {
        success = true;
        error = null;
        break;
      }
      error = `HTTP ${res.status}`;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Request failed';
    }
  }

  await recordWebhookDelivery({
    endpointId: endpoint.id,
    userId,
    event,
    statusCode,
    success,
    error,
    durationMs: Date.now() - started,
    payload,
    attempt: attemptOffset + attemptsUsed,
  });

  return { success, statusCode, error, durationMs: Date.now() - started };
}
