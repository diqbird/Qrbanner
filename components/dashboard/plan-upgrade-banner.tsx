'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { resolvePlanDisplayName } from '@/lib/i18n/resolve-plan-display-name';

interface UsagePayload {
  plan: { id: string; name: string };
  usage: { qrCodes: number; qrLimit: number; customDomains: number; domainLimit: number };
}

function usagePct(used: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.round((used / limit) * 100);
}

export function PlanUpgradeBanner() {
  const { t, locale } = useLanguage();
  const [data, setData] = useState<UsagePayload | null>(null);

  useEffect(() => {
    fetch('/api/account/usage')
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => undefined);
  }, []);

  if (!data || data.plan.id === 'business') return null;

  const qrPct = usagePct(data.usage.qrCodes, data.usage.qrLimit);
  const domainPct = usagePct(data.usage.customDomains, data.usage.domainLimit);
  const atLimit = data.usage.qrCodes >= data.usage.qrLimit || data.usage.customDomains >= data.usage.domainLimit;
  const nearLimit = qrPct >= 80 || domainPct >= 80;

  if (!atLimit && !nearLimit) return null;

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
        atLimit
          ? 'border-amber-500/50 bg-amber-500/10'
          : 'border-primary/30 bg-primary/5'
      }`}
      role="status"
    >
      <div className="flex gap-3">
        {atLimit ? (
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
        ) : (
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
        )}
        <div>
          <p className="font-medium text-sm">
            {atLimit ? t('planUpgrade.atLimitTitle') : t('planUpgrade.nearLimitTitle')}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {atLimit
              ? t('planUpgrade.atLimitBody', {
                  used: formatLocaleNumber(data.usage.qrCodes, locale),
                  limit: formatLocaleNumber(data.usage.qrLimit, locale),
                  plan: resolvePlanDisplayName(data.plan.id, locale),
                })
              : t('planUpgrade.nearLimitBody', { pct: formatLocaleNumber(Math.max(qrPct, domainPct), locale) })}
          </p>
        </div>
      </div>
      <Link href="/pricing" className="shrink-0">
        <Button size="sm" className="gap-2 w-full sm:w-auto">
          {t('planUpgrade.cta')} <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
