'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import {
  getComparisonRows,
  getLaunchBanner,
  getPricingPlans,
  planName,
  planCtaLabel,
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
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [interval, setInterval] = useState<BillingInterval>('monthly');
  const plans = getPricingPlans(locale, interval);

  const comparison = getComparisonRows(locale);

  useEffect(() => {
    if (searchParams.get('billing') === 'cancelled') {
      toast.message(t('pricing.billingCancelled'));
      router.replace('/pricing');
    }
  }, [searchParams, router, t]);

  const handlePlanClick = async (planId: PlanId, priceMonthly: number | null) => {
    if (priceMonthly === 0 || priceMonthly === null) {
      window.location.href = session ? '/dashboard' : '/signup';
      return;
    }
    setLoadingPlan(planId);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, interval }),
      });
      if (res.status === 401) {
        window.location.href = `/signup?callbackUrl=${encodeURIComponent('/pricing')}`;
        return;
      }
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      if (data?.fallback === 'launch_free') {
        toast.message(t('pricing.launchFree'));
        window.location.href = session ? '/dashboard' : '/signup';
        return;
      }
      if (!res.ok) {
        if (data?.manageBilling) {
          toast.message(t('billing.alreadyOnPlan'));
          const portal = await fetch('/api/billing/portal', { method: 'POST' });
          const portalData = await portal.json();
          if (portalData?.url) {
            window.location.href = portalData.url;
            return;
          }
        }
        toast.error(data?.error ?? t('auth.somethingWrong'));
        return;
      }
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary" className="mb-4">{t('pricing.launchBadge')}</Badge>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {t('pricing.title')}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{getLaunchBanner(locale)}</p>

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
              <span className="font-display text-4xl font-bold">{plan.priceLabel}</span>
              {plan.priceMonthly !== null && plan.priceMonthly > 0 && (
                <span className="text-muted-foreground"> {t('pricing.perMonth')}</span>
              )}
            </p>
            {'billedNote' in plan && plan.billedNote && (
              <p className="mt-1 text-xs text-muted-foreground">{plan.billedNote}</p>
            )}
            {plan.priceMonthly !== null && plan.priceMonthly > 0 && !plan.billedNote && (
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
            <Button
              className="mt-8 w-full"
              variant={plan.highlighted ? 'default' : 'outline'}
              onClick={() => handlePlanClick(plan.id, plan.priceMonthly)}
              disabled={loadingPlan === plan.id}
            >
              {loadingPlan === plan.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                planCtaLabel(plan.id, plan.priceMonthly, t)
              )}
            </Button>
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
