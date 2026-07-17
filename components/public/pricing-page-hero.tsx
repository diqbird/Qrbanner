'use client';

import { BillingComingSoonBanner } from '@/components/billing/billing-coming-soon-banner';
import { Reveal } from '@/components/landing/premium/primitives';
import { getLaunchBanner } from '@/lib/i18n/pricing-content';
import { ANNUAL_DISCOUNT_PERCENT } from '@/lib/plans';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import type { PricingPageState } from '@/hooks/use-pricing-page';

export function PricingPageHero({ pricing }: { pricing: PricingPageState }) {
  const { t, locale, interval, setInterval, billingConfigured, annualAvailable, billingLoading } = pricing;

  return (
    <Reveal className="relative mx-auto max-w-2xl text-center">
      <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 flex justify-center" aria-hidden>
        <div className="h-40 w-72 rounded-full bg-[#2563EB]/15 blur-[70px] dark:bg-[#2563EB]/25" />
      </div>
      <p className="ph-eyebrow mb-4">{t('pricing.launchBadge')}</p>
      <h1 className="ph-title text-4xl leading-[1.1] sm:text-5xl lg:text-[3.25rem]">
        {t('pricing.title')}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        {getLaunchBanner(locale, { billingLive: billingConfigured || billingLoading })}
      </p>

      {!billingLoading && !billingConfigured && <BillingComingSoonBanner />}

      {annualAvailable && (
        <div className="mt-8 inline-flex rounded-full border border-border/70 bg-card/80 p-1 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.4)] backdrop-blur dark:border-white/10 dark:bg-card/60">
          <button
            type="button"
            onClick={() => setInterval('monthly')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              interval === 'monthly'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('pricing.billingMonthly')}
          </button>
          <button
            type="button"
            onClick={() => setInterval('annual')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              interval === 'annual'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('pricing.billingAnnual')}{' '}
            <span className={interval === 'annual' ? 'text-white/90' : 'text-[#2563EB] dark:text-sky-400'}>
              ({t('pricing.savePercent', { percent: formatLocaleNumber(ANNUAL_DISCOUNT_PERCENT, locale) })})
            </span>
          </button>
        </div>
      )}
    </Reveal>
  );
}
