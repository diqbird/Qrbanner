'use client';

import { Check } from 'lucide-react';
import { PricingPlanCardButton } from '@/components/billing/pricing-plan-card-button';
import { Reveal } from '@/components/landing/premium/primitives';
import { isPaidCheckoutClosed, planCardPriceLabel } from '@/lib/pricing-display';
import { getPricingPlans, planName } from '@/lib/i18n/pricing-content';
import { proTrialDayVars } from '@/lib/i18n/policy-day-vars';
import type { PricingPageState } from '@/hooks/use-pricing-page';

export function PricingPlanGrid({ pricing }: { pricing: PricingPageState }) {
  const { t, locale, interval, billingConfigured, billingLoading, loadingPlan, proTrialEligible, handlePlanClick } = pricing;
  const plans = getPricingPlans(locale, interval, t);
  const trialVars = proTrialDayVars(locale);
  const tp = (key: string, vars?: Record<string, string | number>) => t(key, { ...trialVars, ...vars });

  return (
    <div className="mt-14 grid gap-5 sm:mt-16 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
      {plans.map((plan, index) => (
        <Reveal key={plan.id} delay={0.04 * index} className="h-full">
          <div
            className={`ph-card relative flex h-full flex-col p-7 sm:p-8 ${
              plan.highlighted
                ? 'border-[#2563EB]/45 ring-1 ring-[#2563EB]/25 dark:border-sky-400/40 dark:ring-sky-400/20'
                : ''
            }`}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#2563EB] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-[0_10px_24px_-10px_rgba(37,99,235,0.8)]">
                {t('pricing.mostPopular')}
              </span>
            )}
            <h2 className="ph-title text-xl">{planName(plan.id, locale)}</h2>
            <p className="mt-3">
              <span className="font-display text-4xl font-bold tracking-tight">
                {planCardPriceLabel(plan.priceLabel, plan.priceMonthly, billingConfigured, billingLoading, t)}
              </span>
              {plan.priceMonthly !== null && plan.priceMonthly > 0 && billingConfigured && (
                <span className="text-muted-foreground"> {t('pricing.perMonth')}</span>
              )}
            </p>
            {'billedNote' in plan && plan.billedNote && billingConfigured && (
              <p className="mt-1 text-xs text-muted-foreground">{plan.billedNote}</p>
            )}
            {isPaidCheckoutClosed(plan.priceMonthly, billingConfigured, billingLoading) && (
              <p className="mt-1 text-xs text-muted-foreground">{t('pricing.paidCheckoutClosedNote')}</p>
            )}
            {plan.priceMonthly !== null && plan.priceMonthly > 0 && billingConfigured && !plan.billedNote && plan.id !== 'pro' && (
              <p className="mt-1 text-xs text-muted-foreground">{t('pricing.billingNote')}</p>
            )}
            {plan.id === 'pro' && billingConfigured && (
              <p className="mt-1 text-xs font-medium text-[#2563EB] dark:text-sky-400">{tp('pricing.proTrialBadge')}</p>
            )}
            {plan.id === 'pro' && billingConfigured && proTrialEligible && (
              <p className="mt-1 text-xs text-muted-foreground">{t('pricing.proTrialNote')}</p>
            )}
            <ul className="mt-8 flex-1 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground/90">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB] dark:text-sky-400" aria-hidden />
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
              proTrialEligible={plan.id === 'pro' && proTrialEligible}
              className="mt-8 w-full rounded-full"
              t={tp}
              onCheckout={() => handlePlanClick(plan.id, plan.priceMonthly)}
            />
          </div>
        </Reveal>
      ))}
    </div>
  );
}
