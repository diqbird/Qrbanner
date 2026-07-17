'use client';

import Link from 'next/link';
import { ArrowRight, QrCode } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLocalePath } from '@/components/i18n/use-locale-path';
import { useBillingStatus } from '@/hooks/use-billing-status';
import { getLaunchBanner } from '@/lib/i18n/pricing-content';

export function LandingCTA() {
  const { t, locale } = useLanguage();
  const localePath = useLocalePath();
  const { configured: billingConfigured, loading: billingLoading } = useBillingStatus();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="bg-primary py-20" ref={ref}>
      <div
        className={`mx-auto max-w-[1200px] px-4 text-center sm:px-6 ${inView ? 'animate-fade-up' : ''}`}
      >
        <QrCode className="mx-auto mb-6 h-12 w-12 text-primary-foreground" aria-hidden />
        <h2 className="font-display text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
          {t('landing.ctaTitle')}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground">
          {getLaunchBanner(locale, { billingLive: billingConfigured || billingLoading })}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-8 text-base font-semibold text-zinc-950 transition-colors hover:bg-zinc-100"
          >
            {t('landing.ctaCreate')} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href={localePath('/pricing')}
            className="inline-flex h-11 items-center justify-center rounded-lg border-2 border-white px-8 text-base font-semibold text-white transition-colors hover:bg-white hover:text-zinc-950"
          >
            {t('landing.ctaPricing')}
          </Link>
        </div>
      </div>
    </section>
  );
}
