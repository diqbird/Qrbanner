'use client';

import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { HealthPayload } from '@/hooks/use-status-page-health';

type StatusPageStatusPanelProps = {
  t: (key: string, vars?: Record<string, string | number>) => string;
  health: HealthPayload | null;
  loading: boolean;
  error: boolean;
  operational: boolean;
  onRetry: () => void;
};

export function StatusPageStatusPanel({
  t,
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
                  time: health?.timestamp ? new Date(health.timestamp).toLocaleString() : '—',
                })}
              </p>
            </div>
          </div>

          <ul className="mt-6 space-y-3 text-sm">
            <StatusRow label={t('status.checkDatabase')} ok={health?.checks.database ?? false} />
            <StatusRow label={t('status.checkSmtp')} ok={health?.checks.smtp ?? false} />
            <StatusRow label={t('status.checkBilling')} ok={health?.checks.billing ?? false} />
          </ul>

          <p className="mt-6 text-xs text-muted-foreground">
            {t('status.responseMs', { ms: health?.responseMs ?? 0 })}
          </p>
        </>
      )}
    </div>
  );
}

function StatusRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-border/40 px-4 py-3">
      <span>{label}</span>
      <span className={ok ? 'text-emerald-600' : 'text-amber-600'}>{ok ? 'OK' : '—'}</span>
    </li>
  );
}
