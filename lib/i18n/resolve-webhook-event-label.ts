import type { TranslateFn } from './resolve-enum-label';

export function resolveWebhookEventLabel(t: TranslateFn, event: string): string {
  const base = event.replace(/\.test$/, '');
  if (base === 'scan') return t('settings.webhooks.eventScan');
  if (base === 'lead') return t('settings.webhooks.eventLead');
  if (base === 'cta_click') return t('settings.webhooks.eventCta');
  return event;
}
