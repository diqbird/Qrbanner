'use client';

import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleDateTime } from '@/lib/i18n/format-locale';
import { resolveWebhookEventLabel } from '@/lib/i18n/resolve-webhook-event-label';
import type { WebhookSettingsState } from '@/hooks/use-webhook-settings';

export function WebhookDeliveriesPanel({ settings }: { settings: WebhookSettingsState }) {
  const { t, locale } = useLanguage();
  const { deliveries } = settings;

  return (
    <div className="space-y-3 border-t border-border/50 pt-4">
      <div>
        <p className="text-sm font-medium">{t('settings.webhooks.deliveriesTitle')}</p>
        <p className="text-xs text-muted-foreground">{t('settings.webhooks.deliveriesDesc')}</p>
      </div>
      {deliveries.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('settings.webhooks.deliveriesEmpty')}</p>
      ) : (
        <div className="space-y-2">
          {deliveries.map((d) => (
            <div
              key={d.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 px-3 py-2 text-xs"
            >
              <div className="min-w-0">
                <p className="font-medium">
                  {d.endpointLabel ?? d.endpointUrl ?? d.endpointId}
                </p>
                <p className="text-muted-foreground">
                  {resolveWebhookEventLabel(t, d.event)} · {formatLocaleDateTime(d.createdAt, locale)}
                  {d.durationMs != null ? ` · ${t('settings.webhooks.deliveryDuration', { ms: d.durationMs })}` : ''}
                </p>
                {d.error && <p className="text-destructive">{d.error}</p>}
              </div>
              <Badge variant={d.success ? 'default' : 'destructive'}>
                {d.success
                  ? `${t('settings.webhooks.deliverySuccess')}${d.statusCode ? ` ${d.statusCode}` : ''}`
                  : t('settings.webhooks.deliveryFailed')}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
