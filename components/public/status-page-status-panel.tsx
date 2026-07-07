'use client';

import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { HealthPayload } from '@/hooks/use-status-page-health';
import { formatLocaleDateTime, formatLocaleNumber } from '@/lib/i18n/format-locale';
import type { Locale } from '@/lib/i18n/types';

type StatusPageStatusPanelProps = {
  t: (key: string, vars?: Record<string, string | number>) => string;
  locale: Locale;
  health: HealthPayload | null;
  loading: boolean;
  error: boolean;
  operational: boolean;
  onRetry: () => void;
};

export function StatusPageStatusPanel({
  t,
  locale,
  health,
  loading,
  error,
  operational,
  onRetry,
}: StatusPageStatusPanelProps) {
  return (
    <div className="mt-10 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      {loading && !health ? (
        <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          {t('status.checking')}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <p>{t('status.unavailable')}</p>
          <Button variant="outline" onClick={onRetry}>
            {t('status.retry')}
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            {operational ? (
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            ) : (
              <AlertCircle className="h-8 w-8 text-amber-500" />
            )}
            <div>
              <p className="text-lg font-semibold">
                {operational ? t('status.operational') : t('status.degraded')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('status.lastChecked', {
                  time: health?.timestamp
                    ? formatLocaleDateTime(health.timestamp, locale)
                    : t('common.emptyValue'),
                })}
              </p>
            </div>
          </div>

          <ul className="mt-6 space-y-3 text-sm">
            <StatusRow label={t('status.checkApplication')} ok={health?.ok ?? false} t={t} />
          </ul>

          <p className="mt-6 text-xs text-muted-foreground">
            {t('status.responseMs', {
              ms: formatLocaleNumber(health?.responseMs ?? 0, locale),
            })}
          </p>
        </>
      )}
    </div>
  );
}

function StatusRow({
  label,
  ok,
  t,
}: {
  label: string;
  ok: boolean;
  t: (key: string, vars?: Record<string, string | number>) => string;
}) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-border/40 px-4 py-3">
      <span>{label}</span>
      <span className={ok ? 'text-emerald-600' : 'text-amber-600'}>
        {ok ? t('status.checkOk') : t('common.emptyValue')}
      </span>
    </li>
  );
}
