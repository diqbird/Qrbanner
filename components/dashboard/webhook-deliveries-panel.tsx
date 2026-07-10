'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleDateTime, formatLocaleNumber } from '@/lib/i18n/format-locale';
import { resolveWebhookEventLabel } from '@/lib/i18n/resolve-webhook-event-label';
import type { WebhookSettingsState } from '@/hooks/use-webhook-settings';
import { useState } from 'react';
import { toast } from 'sonner';

export function WebhookDeliveriesPanel({ settings }: { settings: WebhookSettingsState }) {
  const { t, locale } = useLanguage();
  const { deliveries, fetchDeliveries } = settings;
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const retryDelivery = async (id: string) => {
    setRetryingId(id);
    try {
      const res = await fetch(`/api/webhooks/deliveries/${id}/retry`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? t('settings.webhooks.retryFailed'));
        return;
      }
      toast.success(
        json.success ? t('settings.webhooks.retrySuccess') : t('settings.webhooks.retryFailed')
      );
      await fetchDeliveries();
    } catch {
      toast.error(t('settings.webhooks.retryFailed'));
    } finally {
      setRetryingId(null);
    }
  };

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
                  {d.durationMs != null
                    ? ` · ${t('settings.webhooks.deliveryDuration', {
                        ms: formatLocaleNumber(d.durationMs, locale),
                      })}`
                    : ''}
                  {d.attempt > 1
                    ? ` · ${t('settings.webhooks.deliveryAttempt', {
                        n: formatLocaleNumber(d.attempt, locale),
                      })}`
                    : ''}
                </p>
                {d.error && <p className="text-destructive">{d.error}</p>}
              </div>
              <div className="flex items-center gap-2">
                {!d.success && d.canRetry && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    disabled={retryingId === d.id}
                    onClick={() => retryDelivery(d.id)}
                  >
                    {retryingId === d.id
                      ? t('settings.webhooks.retrying')
                      : t('settings.webhooks.retryBtn')}
                  </Button>
                )}
                <Badge variant={d.success ? 'default' : 'destructive'}>
                  {d.success
                    ? `${t('settings.webhooks.deliverySuccess')}${
                        d.statusCode ? ` ${formatLocaleNumber(d.statusCode, locale)}` : ''
                      }`
                    : t('settings.webhooks.deliveryFailed')}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
