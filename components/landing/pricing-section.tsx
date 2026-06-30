'use client';



import Link from 'next/link';

import { useInView } from 'react-intersection-observer';

import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';

import { Check, Loader2, ArrowRight, Building2 } from 'lucide-react';

import { useLanguage } from '@/components/i18n/language-provider';

import { getComparisonRows, getLaunchBanner, getPricingPlans, planName, planCtaLabel } from '@/lib/i18n/pricing-content';

import type { BillingInterval, PlanId } from '@/lib/plans';

import { ANNUAL_DISCOUNT_PERCENT } from '@/lib/plans';

import { toast } from 'sonner';

import { useState } from 'react';

import { PricingReferralBanner } from '@/components/marketing/pricing-referral-banner';

export function LandingPricing() {

  const { t, locale } = useLanguage();

  const { data: session } = useSession() || {};

  const [interval, setInterval] = useState<BillingInterval>('monthly');

  const plans = getPricingPlans(locale, interval);

  const comparison = getComparisonRows(locale).slice(0, 8);

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);



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

      toast.error(data?.error ?? t('pricing.checkoutUnavailable'));
    } catch {
      toast.error(t('auth.somethingWrong'));

    } finally {

      setLoadingPlan(null);

    }

  };



  return (

    <section className="py-20 sm:py-28" ref={ref}>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">

        <div className="mx-auto max-w-2xl text-center">

          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">

            {t('landing.pricingTitle')}

          </h2>

          <p className="mt-4 text-muted-foreground">{getLaunchBanner(locale)}</p>

          <PricingReferralBanner />

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



        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

          {plans.map((plan, i) => (

            <div

              key={plan.id}

              className={`relative rounded-2xl border bg-card p-6 ${

                plan.highlighted ? 'border-primary shadow-md ring-1 ring-primary/20' : 'border-border/50'

              } ${inView ? 'animate-fade-up' : 'opacity-0'}`}

              style={{ animationDelay: `${i * 80}ms` }}

            >

              {plan.highlighted && (

                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">{t('pricing.mostPopular')}</Badge>

              )}

              <h3 className="font-display text-lg font-bold">{planName(plan.id, locale)}</h3>

              <p className="mt-2">

                <span className="font-display text-3xl font-bold">{plan.priceLabel}</span>

                {plan.priceMonthly !== null && plan.priceMonthly > 0 && (

                  <span className="text-sm text-muted-foreground"> {t('pricing.perMonth')}</span>

                )}

              </p>

              {'billedNote' in plan && plan.billedNote && (

                <p className="mt-1 text-xs text-muted-foreground">{plan.billedNote}</p>

              )}

              <ul className="mt-6 space-y-2.5">

                {plan.features.slice(0, 6).map((f) => (

                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">

                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                    <span>{f}</span>

                  </li>

                ))}

              </ul>

              <Button

                className="mt-8 w-full"

                variant={plan.highlighted ? 'default' : 'outline'}

                disabled={loadingPlan === plan.id}

                onClick={() => handlePlanClick(plan.id, plan.priceMonthly)}

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

      </div>

    </section>

  );

}

