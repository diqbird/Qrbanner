'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/i18n/language-provider';
import { SUPPORT_EMAIL, supportMailto } from '@/lib/site-contact';

type HealthPayload = {
  ok: boolean;
  status: string;
  checks: { database: boolean; smtp: boolean; billing: boolean };
  responseMs: number;
  timestamp: string;
};

export function StatusPageContent() {
  const { t } = useLanguage();
  const [health, setHealth] = useState<HealthPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/health', { cache: 'no-store' });
      const data = (await res.json()) as HealthPayload;
      setHealth(data);
    } catch {
      setError(true);
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const operational = health?.ok ?? false;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <header className="text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight">{t('status.pageTitle')}</h1>
        <p className="mt-3 text-muted-foreground">{t('status.pageSubtitle')}</p>
      </header>

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
            <Button variant="outline" onClick={() => void load()}>
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
                      ? new Date(health.timestamp).toLocaleString()
                      : '—',
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

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t('status.needHelp')}{' '}
        <a href={supportMailto()} className="text-primary hover:underline">
          {SUPPORT_EMAIL}
        </a>
      </p>

      <div className="mt-6 text-center">
        <Link href="/">
          <Button variant="ghost">{t('status.backHome')}</Button>
        </Link>
      </div>
    </div>
  );
}

function StatusRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-border/40 px-4 py-3">
      <span>{label}</span>
      <span className={ok ? 'text-emerald-600' : 'text-amber-600'}>
        {ok ? 'OK' : '—'}
      </span>
    </li>
  );
}
