'use client';

import { Badge } from '@/components/ui/badge';
import { Gauge } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolvePlanDisplayName } from '@/lib/i18n/resolve-plan-display-name';
import type { ApiKeySettingsState } from '@/hooks/use-api-key-settings';

type ApiKeyUsagePanelProps = {
  apiKey: ApiKeySettingsState;
};

export function ApiKeyUsagePanel({ apiKey }: ApiKeyUsagePanelProps) {
  const { locale } = useLanguage();
  const { t, usage, planId } = apiKey;
  if (!usage) return null;

  const planLabel = planId ? resolvePlanDisplayName(planId, locale) : null;

  const pct =
    usage.monthlyQuota > 0 ? Math.min(100, Math.round((usage.monthlyUsed / usage.monthlyQuota) * 100)) : 0;
  const near = pct >= 80;

  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium flex items-center gap-2">
          <Gauge className="h-4 w-4 text-primary" /> {t('settings.apiKey.usageTitle')}
        </p>
        {planLabel && <Badge variant="outline">{planLabel}</Badge>}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${near ? 'bg-destructive' : 'bg-primary'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>
          {t('settings.apiKey.usageMonthly', {
            used: usage.monthlyUsed.toLocaleString(),
            quota: usage.monthlyQuota.toLocaleString(),
          })}
        </span>
        <span>
          {t('settings.apiKey.usageRemaining', { remaining: usage.monthlyRemaining.toLocaleString() })}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        {t('settings.apiKey.usagePerMinute', { limit: usage.perMinuteLimit.toLocaleString() })}
        {' · '}
        {t('settings.apiKey.usageResets', {
          date: new Date(usage.monthlyResetAt * 1000).toLocaleDateString(),
        })}
      </p>
    </div>
  );
}
