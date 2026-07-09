'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { resolvePlanDisplayName } from '@/lib/i18n/resolve-plan-display-name';

type UsagePayload = {
  plan: { id: string; name: string };
  usage: { qrCodes: number; qrLimit: number };
};

function usagePct(used: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.round((used / limit) * 100);
}

/** Early plan-limit warning on create content step (before final 403). */
export function QrCreateQuotaBanner() {
  const { t, locale } = useLanguage();
  const { status } = useSession() || {};
  const [data, setData] = useState<UsagePayload | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') return;
    let cancelled = false;
    fetch('/api/account/usage')
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!cancelled && json) setData(json as UsagePayload);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [status]);

  if (status !== 'authenticated' || !data) return null;

  const { qrCodes, qrLimit } = data.usage;
  const pct = usagePct(qrCodes, qrLimit);
  const atLimit = qrCodes >= qrLimit;
  const nearLimit = !atLimit && pct >= 80;

  if (!atLimit && !nearLimit) return null;

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between ${
        atLimit
          ? 'border-amber-500/50 bg-amber-500/10'
          : 'border-primary/30 bg-primary/5'
      }`}
      role="status"
    >
      <div className="flex gap-3 min-w-0">
        {atLimit ? (
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
        ) : (
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
        )}
        <div className="min-w-0">
          <p className="font-medium text-sm">
            {atLimit ? t('create.quotaAtLimitTitle') : t('create.quotaNearLimitTitle')}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {atLimit
              ? t('create.quotaAtLimitBody', {
                  used: formatLocaleNumber(qrCodes, locale),
                  limit: formatLocaleNumber(qrLimit, locale),
                  plan: resolvePlanDisplayName(data.plan.id, locale),
                })
              : t('create.quotaNearLimitBody', {
                  used: formatLocaleNumber(qrCodes, locale),
                  limit: formatLocaleNumber(qrLimit, locale),
                  pct: formatLocaleNumber(pct, locale),
                })}
          </p>
        </div>
      </div>
      <Link href="/pricing" className="shrink-0">
        <Button size="sm" variant={atLimit ? 'default' : 'outline'} className="gap-2 w-full sm:w-auto">
          {t('planUpgrade.cta')} <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
