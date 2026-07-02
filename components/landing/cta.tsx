'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, QrCode } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/components/i18n/language-provider';
import { getLaunchBanner } from '@/lib/i18n/pricing-content';

export function LandingCTA() {
  const { t, locale } = useLanguage();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="bg-primary py-20" ref={ref}>
      <div
        className={`mx-auto max-w-[1200px] px-4 text-center sm:px-6 ${inView ? 'animate-fade-up' : 'opacity-0'}`}
      >
        <QrCode className="mx-auto mb-6 h-12 w-12 text-primary-foreground/80" />
        <h2 className="font-display text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
          {t('landing.ctaTitle')}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
          {getLaunchBanner(locale)}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="gap-2 bg-white px-8 text-base font-semibold text-primary hover:bg-white/90">
              {t('landing.ctaCreate')} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white bg-transparent px-8 text-base font-semibold !text-white hover:bg-white hover:!text-primary"
            >
              {t('landing.ctaPricing')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
