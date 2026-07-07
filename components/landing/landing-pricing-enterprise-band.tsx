'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2 } from 'lucide-react';
import type { LandingPricingState } from '@/hooks/use-landing-pricing';
import { formatAgencyQrCodeCount } from '@/lib/i18n/qr-type-count';

export function LandingPricingEnterpriseBand({ pricing }: { pricing: LandingPricingState }) {
  const { t, locale } = pricing;
  const codes = formatAgencyQrCodeCount(locale);

  return (
    <section className="mt-16 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 sm:p-10">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15">
            <Building2 className="h-6 w-6 text-primary" aria-hidden />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold">{t('pricing.enterpriseBandTitle', { codes })}</h3>
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
