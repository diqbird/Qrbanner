'use client';

import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { PricingPlanCardButton } from '@/components/billing/pricing-plan-card-button';
import { isPaidCheckoutClosed, planCardPriceLabel } from '@/lib/pricing-display';
import { getPricingPlans, planName } from '@/lib/i18n/pricing-content';
import type { PricingPageState } from '@/hooks/use-pricing-page';

export function PricingPlanGrid({ pricing }: { pricing: PricingPageState }) {
  const { t, locale, interval, billingConfigured, billingLoading, loadingPlan, handlePlanClick } = pricing;
  const plans = getPricingPlans(locale, interval);

  return (
    <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`relative flex flex-col rounded-2xl border bg-card p-8 ${
            plan.highlighted ? 'border-primary ring-1 ring-primary/20' : 'border-border/50'
          }`}
        >
          {plan.highlighted && (
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">{t('pricing.mostPopular')}</Badge>
          )}
          <h2 className="font-display text-xl font-bold">{planName(plan.id, locale)}</h2>
          <p className="mt-3">
            <span className="font-display text-4xl font-bold">
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
          {plan.priceMonthly !== null && plan.priceMonthly > 0 && billingConfigured && !plan.billedNote && (
            <p className="mt-1 text-xs text-muted-foreground">{t('pricing.billingNote')}</p>
          )}
          <ul className="mt-8 flex-1 space-y-3">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
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
