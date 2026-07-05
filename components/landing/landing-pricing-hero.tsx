'use client';

import { PricingReferralBanner } from '@/components/marketing/pricing-referral-banner';
import { BillingComingSoonBanner } from '@/components/billing/billing-coming-soon-banner';
import { getLaunchBanner } from '@/lib/i18n/pricing-content';
import { ANNUAL_DISCOUNT_PERCENT } from '@/lib/plans';
import type { LandingPricingState } from '@/hooks/use-landing-pricing';

export function LandingPricingHero({ pricing }: { pricing: LandingPricingState }) {
  const { t, locale, interval, setInterval, billingConfigured, annualAvailable, billingLoading } = pricing;

  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {t('landing.pricingTitle')}
      </h2>
      <p className="mt-4 text-muted-foreground">
        {getLaunchBanner(locale, { billingLive: billingConfigured })}
      </p>
      <PricingReferralBanner />
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
            <span className="font-medium text-foreground">
              ({t('pricing.savePercent', { percent: ANNUAL_DISCOUNT_PERCENT })})
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
