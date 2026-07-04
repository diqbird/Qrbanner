'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { BillingComingSoonBanner } from '@/components/billing/billing-coming-soon-banner';
import { PricingPlanCardButton } from '@/components/billing/pricing-plan-card-button';
import { usePlanCheckout } from '@/hooks/use-plan-checkout';
import { isPaidCheckoutClosed, planCardPriceLabel } from '@/lib/pricing-display';
import {
  getComparisonRows,
  getLaunchBanner,
  getPricingPlans,
  planName,
} from '@/lib/i18n/pricing-content';
import type { BillingInterval, PlanId } from '@/lib/plans';
import { ANNUAL_DISCOUNT_PERCENT } from '@/lib/plans';
import { toast } from 'sonner';
import { EnterpriseCtaBand } from '@/components/marketing/enterprise-cta-band';
import { PricingReferralBanner } from '@/components/marketing/pricing-referral-banner';

export function PricingPageContent() {
  const { t, locale } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession() || {};
  const [interval, setInterval] = useState<BillingInterval>('monthly');
  const plans = getPricingPlans(locale, interval);
  const { checkoutPlan, loadingPlan, billingConfigured, annualAvailable, billingLoading } = usePlanCheckout();

  const comparison = getComparisonRows(locale);

  useEffect(() => {
    if (searchParams.get('billing') === 'cancelled') {
      toast.message(t('pricing.billingCancelled'));
      router.replace('/pricing');
    }
  }, [searchParams, router, t]);

  const handlePlanClick = async (planId: PlanId, priceMonthly: number | null) => {
    const result = await checkoutPlan(planId, priceMonthly, interval, {
      signInCallbackUrl: '/pricing',
      isSignedIn: Boolean(session),
    });
    if (result.redirected && result.href) {
      window.location.href = result.href;
    }
  };

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary" className="mb-4">{t('pricing.launchBadge')}</Badge>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {t('pricing.title')}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {getLaunchBanner(locale, { billingLive: billingConfigured })}
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
            <span className="text-primary">({t('pricing.savePercent', { percent: ANNUAL_DISCOUNT_PERCENT })})</span>
          </button>
        </div>
        )}
      </div>

      <PricingReferralBanner />

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
              <p className="mt-1 text-xs text-muted-foreground">{t('pricing.stripeNote')}</p>
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

      <div className="mt-24">
        <h2 className="font-display text-2xl font-bold text-center">{t('pricing.whyTitle')}</h2>
        <p className="mt-2 text-center text-muted-foreground">{t('pricing.whySubtitle')}</p>
        <div className="mt-8 overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left">
                <th className="p-4 font-medium">{t('pricing.colFeature')}</th>
                <th className="p-4 font-medium">QRbanner</th>
                <th className="p-4 font-medium">{t('pricing.colTypical')}</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} className="border-b last:border-0">
                  <td className="p-4">{row.feature}</td>
                  <td className="p-4 font-medium text-primary">{row.qrbanner}</td>
                  <td className="p-4 text-muted-foreground">{row.typical}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EnterpriseCtaBand />

      <div className="mt-16 text-center">
        <Link href="/signup">
          <Button size="lg" className="gap-2">
            {t('pricing.createAccount')} <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </>
  );
}
