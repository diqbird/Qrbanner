'use client';

import { useMemo, useState } from 'react';
import { Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/i18n/language-provider';
import { buildTestWebhookPayload } from '@/lib/webhook-test-payload';
import type { WebhookEventName } from '@/lib/webhooks';
import { toast } from 'sonner';

export function WebhookPayloadSample() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [event, setEvent] = useState<WebhookEventName>('scan');
  const sample = useMemo(
    () => JSON.stringify(buildTestWebhookPayload(event), null, 2),
    [event],
  );

  const copy = () => {
    navigator.clipboard?.writeText(sample);
    toast.success(t('settings.webhooks.sampleCopied'));
  };

  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-sm font-semibold">{t('settings.webhooks.sampleTitle')}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{t('settings.webhooks.sampleDesc')}</p>
        </div>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setOpen((v) => !v)}>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      {open && (
        <div className="mt-3 space-y-2">
          <select
            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            value={event}
            onChange={(e) => setEvent(e.target.value as WebhookEventName)}
            aria-label={t('settings.webhooks.testEvent')}
          >
            <option value="scan">{t('settings.webhooks.eventScan')}</option>
            <option value="lead">{t('settings.webhooks.eventLead')}</option>
            <option value="cta_click">{t('settings.webhooks.eventCta')}</option>
          </select>
          <div className="relative">
            <pre className="max-h-64 overflow-auto rounded-lg bg-background p-3 text-xs">{sample}</pre>
            <Button type="button" variant="outline" size="sm" className="absolute right-2 top-2 gap-1" onClick={copy}>
              <Copy className="h-3.5 w-3.5" /> {t('settings.webhooks.sampleCopy')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
