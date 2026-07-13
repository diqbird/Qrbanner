'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Zap, KeyRound } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import type { WebhookSettingsState } from '@/hooks/use-webhook-settings';
import type { WebhookEventName } from '@/lib/webhooks';

function sanitizeMfa(value: string) {
  return value.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase().slice(0, 19);
}

function WebhookRowTestControls({
  settings,
  webhookId,
  enabled,
}: {
  settings: WebhookSettingsState;
  webhookId: string;
  enabled: boolean;
}) {
  const { t, working, sendTestWebhook } = settings;
  const [event, setEvent] = useState<WebhookEventName>('scan');

  return (
    <div className="flex items-center gap-1.5">
      <select
        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
        value={event}
        disabled={working || !enabled}
        onChange={(e) => setEvent(e.target.value as WebhookEventName)}
        aria-label={t('settings.webhooks.testEvent')}
      >
        <option value="scan">{t('settings.webhooks.eventScan')}</option>
        <option value="lead">{t('settings.webhooks.eventLead')}</option>
        <option value="cta_click">{t('settings.webhooks.eventCta')}</option>
      </select>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 gap-1 text-xs"
        disabled={working || !enabled}
        onClick={() => sendTestWebhook(webhookId, event)}
      >
        <Zap className="h-3.5 w-3.5" />
        {t('settings.webhooks.testBtn')}
      </Button>
    </div>
  );
}

export function WebhookEndpointList({ settings }: { settings: WebhookSettingsState }) {
  const { locale } = useLanguage();
  const {
    t,
    webhooks,
    limit,
    toggleEnabled,
    removeWebhook,
    rotateSecret,
    working,
    mfaEnabled,
    mfaCode,
    setMfaCode,
  } = settings;

  return (
    <>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {t('settings.webhooks.count', {
            count: formatLocaleNumber(webhooks.length, locale),
            limit: formatLocaleNumber(limit, locale),
          })}
        </span>
      </div>
      {mfaEnabled && webhooks.length > 0 && (
        <div className="max-w-xs space-y-2">
          <Label htmlFor="webhook-rotate-mfa">{t('settings.mfa.codeOrRecoveryLabel')}</Label>
          <Input
            id="webhook-rotate-mfa"
            autoComplete="one-time-code"
            value={mfaCode}
            onChange={(e) => setMfaCode(sanitizeMfa(e.target.value))}
            placeholder={t('settings.mfa.codeOrRecoveryPlaceholder')}
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">{t('settings.webhooks.mfaHint')}</p>
        </div>
      )}
      {webhooks.length > 0 && (
        <div className="space-y-3">
          {webhooks.map((w) => (
            <div
              key={w.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/50 p-3"
            >
              <div className="min-w-0 flex-1">
                {w.label && <p className="text-sm font-medium">{w.label}</p>}
                <p className="truncate font-mono text-xs text-muted-foreground">{w.url}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={w.enabled ? 'default' : 'secondary'}>
                  {w.enabled ? t('settings.webhooks.active') : t('settings.webhooks.paused')}
                </Badge>
                <Switch checked={w.enabled} onCheckedChange={(v) => toggleEnabled(w.id, v)} />
                <WebhookRowTestControls settings={settings} webhookId={w.id} enabled={w.enabled} />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  onClick={() => rotateSecret(w.id)}
                  disabled={working}
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  {t('settings.webhooks.rotateSecret')}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeWebhook(w.id)}
                  aria-label={t('common.removeAria')}
                  disabled={working}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export function WebhookAddForm({ settings }: { settings: WebhookSettingsState }) {
  const { t, webhooks, limit, url, setUrl, label, setLabel, working, addWebhook } = settings;

  if (webhooks.length >= limit) return null;

  return (
    <form onSubmit={addWebhook} className="space-y-3 border-t border-border/50 pt-4">
      <div className="space-y-2">
        <Label>{t('settings.webhooks.endpointUrl')}</Label>
        <Input
          placeholder={t('settings.webhooks.endpointPlaceholder')}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>{t('settings.webhooks.labelOptional')}</Label>
        <Input
          placeholder={t('settings.webhooks.labelPlaceholder')}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </div>
      <Button type="submit" loading={working} className="gap-2">
        <Plus className="h-4 w-4" /> {t('settings.webhooks.addBtn')}
      </Button>
    </form>
  );
}
