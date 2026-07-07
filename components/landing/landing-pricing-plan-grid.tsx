'use client';

import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { PricingPlanCardButton } from '@/components/billing/pricing-plan-card-button';
import { isPaidCheckoutClosed, planCardPriceLabel } from '@/lib/pricing-display';
import { getPricingPlans, planName } from '@/lib/i18n/pricing-content';
import { proTrialDayVars } from '@/lib/i18n/policy-day-vars';
import type { LandingPricingState } from '@/hooks/use-landing-pricing';

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
  const plans = getPricingPlans(locale, interval, t);
  const trialVars = proTrialDayVars(locale);
  const tp = (key: string, vars?: Record<string, string | number>) => t(key, { ...trialVars, ...vars });

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
          {plan.id === 'pro' && billingConfigured && (
            <p className="mt-1 text-xs font-medium text-primary">{tp('pricing.proTrialBadge')}</p>
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
            t={tp}
            onCheckout={() => handlePlanClick(plan.id, plan.priceMonthly)}
          />
        </div>
      ))}
    </div>
  );
}
