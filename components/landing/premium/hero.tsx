import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';
import { HeroQrTicketDeferred } from './hero-qr-ticket-deferred';

export async function PremiumHero() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <section className="relative overflow-hidden pb-14 pt-8 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-16">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--ph-rule)]"
        aria-hidden
      />

      <div className="ph-container relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* SSR copy stays paint-ready — no Reveal/opacity, no QR lib on the critical path. */}
          <div>
            <p className="ph-eyebrow mb-4">{t('premiumHome.brand')}</p>
            <h1 className="ph-title text-4xl leading-[1.06] sm:text-5xl lg:text-[3.25rem]">
              {t('premiumHome.hero.title')}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--ph-ink)]/70">
              {t('premiumHome.hero.subtitle')}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/qr/create?quick=1" prefetch={false} className="ph-btn-primary">
                {t('premiumHome.hero.primaryCta')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href={localizePath('/templates', locale)} className="ph-btn-secondary">
                {t('premiumHome.hero.secondaryCta')}
              </Link>
            </div>
          </div>

          <div className="relative">
            <HeroQrTicketDeferred />
          </div>
        </div>
      </div>
    </section>
  );
}
