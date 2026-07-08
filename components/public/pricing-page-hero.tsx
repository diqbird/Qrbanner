'use client';

import { Badge } from '@/components/ui/badge';
import { BillingComingSoonBanner } from '@/components/billing/billing-coming-soon-banner';
import { getLaunchBanner } from '@/lib/i18n/pricing-content';
import { ANNUAL_DISCOUNT_PERCENT } from '@/lib/plans';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import type { PricingPageState } from '@/hooks/use-pricing-page';

export function PricingPageHero({ pricing }: { pricing: PricingPageState }) {
  const { t, locale, interval, setInterval, billingConfigured, annualAvailable, billingLoading } = pricing;

  return (
    <div className="mx-auto max-w-2xl text-center">
      <Badge variant="secondary" className="mb-4">{t('pricing.launchBadge')}</Badge>
      <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
        {t('pricing.title')}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        {getLaunchBanner(locale, { billingLive: billingConfigured || billingLoading })}
      </p>

      {!billingLoading && !billingConfigured && <BillingComingSoonBanner />}

      {annualAvailable && (
        <div className="mt-6 inline-flex rounded-full border border-border/60 bg-muted/40 p-1">
          <button
            type="button"
            onClick={() => setInterval('monthly')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              interval === 'monthly' ? 'bg-background shadow-sm' : 'text-muted-foreground'
            }`}
          >
            {t('pricing.billingMonthly')}
          </button>
          <button
            type="button"
            onClick={() => setInterval('annual')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              interval === 'annual' ? 'bg-background shadow-sm' : 'text-muted-foreground'
            }`}
          >
            {t('pricing.billingAnnual')}{' '}
            <span className="text-primary">({t('pricing.savePercent', { percent: formatLocaleNumber(ANNUAL_DISCOUNT_PERCENT, locale) })})</span>
          </button>
        </div>
      )}
    </div>
  );
}
