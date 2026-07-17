import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';
import { demoBookingUrl } from '@/lib/site-contact';
import { Reveal } from './primitives';

export async function PremiumFinalCta() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  const demoUrl = demoBookingUrl();

  return (
    <section className="py-16 sm:py-24" aria-labelledby="premium-final-cta-heading">
      <div className="ph-container">
        <Reveal>
          <div className="ph-dark-band relative overflow-hidden rounded-[1.75rem] px-6 py-14 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -left-10 top-0 h-48 w-48 rounded-full bg-[#2563EB]/40 blur-[70px]" aria-hidden />
            <div className="pointer-events-none absolute -right-8 bottom-0 h-56 w-56 rounded-full bg-[#06B6D4]/30 blur-[80px]" aria-hidden />
            <h2 id="premium-final-cta-heading" className="relative font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t('premiumHome.finalCta.title')}
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-slate-300">
              {t('premiumHome.finalCta.subtitle')}
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/qr/create?quick=1" prefetch={false} className="ph-btn-primary">
                {t('premiumHome.finalCta.primary')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={demoUrl.startsWith('/') ? localizePath(demoUrl, locale) : demoUrl}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
              >
                {t('premiumHome.finalCta.secondary')}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
