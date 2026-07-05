'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Building2 } from 'lucide-react';
import { PricingReferralBanner } from '@/components/marketing/pricing-referral-banner';
import { BillingComingSoonBanner } from '@/components/billing/billing-coming-soon-banner';
import { PricingPlanCardButton } from '@/components/billing/pricing-plan-card-button';
import { isPaidCheckoutClosed, planCardPriceLabel } from '@/lib/pricing-display';
import { getComparisonRows, getLaunchBanner, getPricingPlans, planName } from '@/lib/i18n/pricing-content';
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

export function LandingPricingPlanGrid({ pricing }: { pricing: LandingPricingState }) {
  const {
    t,
    locale,
    interval,
    inView,
    loadingPlan,
    billingConfigured,
    billingLoading,
    handlePlanClick,
  } = pricing;
  const plans = getPricingPlans(locale, interval);

  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {plans.map((plan, i) => (
        <div
          key={plan.id}
          className={`relative rounded-2xl border bg-card p-6 ${
            plan.highlighted ? 'border-primary shadow-md ring-1 ring-primary/20' : 'border-border/50'
          } ${inView ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {plan.highlighted && (
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">{t('pricing.mostPopular')}</Badge>
          )}
          <h3 className="font-display text-lg font-bold">{planName(plan.id, locale)}</h3>
          <p className="mt-2">
            <span className="font-display text-3xl font-bold">
              {planCardPriceLabel(plan.priceLabel, plan.priceMonthly, billingConfigured, billingLoading, t)}
            </span>
            {plan.priceMonthly !== null && plan.priceMonthly > 0 && billingConfigured && (
              <span className="text-sm text-muted-foreground"> {t('pricing.perMonth')}</span>
            )}
          </p>
          {'billedNote' in plan && plan.billedNote && billingConfigured && (
            <p className="mt-1 text-xs text-muted-foreground">{plan.billedNote}</p>
          )}
          {isPaidCheckoutClosed(plan.priceMonthly, billingConfigured, billingLoading) && (
            <p className="mt-1 text-xs text-muted-foreground">{t('pricing.paidCheckoutClosedNote')}</p>
          )}
          <ul className="mt-6 space-y-2.5">
            {plan.features.slice(0, 6).map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" aria-hidden />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <PricingPlanCardButton
            planId={plan.id}
            priceMonthly={plan.priceMonthly}
            highlighted={Boolean(plan.highlighted)}
            billingConfigured={billingConfigured}
            billingLoading={billingLoading}
            loadingPlan={loadingPlan}
            t={t}
            onCheckout={() => handlePlanClick(plan.id, plan.priceMonthly)}
          />
        </div>
      ))}
    </div>
  );
}

export function LandingPricingComparison({ pricing }: { pricing: LandingPricingState }) {
  const { t, locale } = pricing;
  const comparison = getComparisonRows(locale).slice(0, 8);

  return (
    <div className="mt-16">
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <h3 className="font-display text-lg font-semibold">{t('pricing.whyTitle')}</h3>
        <Link href="/pricing" className="text-sm font-medium text-primary hover:underline">
          {t('landing.pricingCompare')}
        </Link>
      </div>
      <div className="mt-4 overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-left">
              <th className="p-3 font-medium">{t('pricing.colFeature')}</th>
              <th className="p-3 font-medium">QRbanner</th>
              <th className="p-3 font-medium">{t('pricing.colTypical')}</th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((row) => (
              <tr key={row.feature} className="border-b last:border-0">
                <td className="p-3">{row.feature}</td>
                <td className="p-3 font-medium text-primary">{row.qrbanner}</td>
                <td className="p-3 text-muted-foreground">{row.typical}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function LandingPricingEnterpriseBand({ pricing }: { pricing: LandingPricingState }) {
  const { t } = pricing;

  return (
    <section className="mt-16 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 sm:p-10">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15">
            <Building2 className="h-6 w-6 text-primary" aria-hidden />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold">{t('pricing.enterpriseBandTitle')}</h3>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">{t('pricing.enterpriseBandDesc')}</p>
          </div>
        </div>
        <Link href="/enterprise" className="shrink-0">
          <Button size="lg" className="gap-2 rounded-full">
            {t('pricing.enterpriseBandCta')} <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
