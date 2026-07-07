import type { TranslateFn } from './resolve-enum-label';

export function resolveWebhookEventLabel(t: TranslateFn, event: string): string {
  if (event === 'scan') return t('settings.webhooks.eventScan');
  return event;
}
