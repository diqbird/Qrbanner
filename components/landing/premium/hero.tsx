import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';
import { Reveal, GlassPanel } from './primitives';

export async function PremiumHero() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <section className="relative overflow-hidden pb-16 pt-10 sm:pb-24 sm:pt-16 lg:pb-28 lg:pt-20">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#2563EB]/20 blur-[90px]" />
        <div className="absolute -right-16 top-32 h-80 w-80 rounded-full bg-[#06B6D4]/20 blur-[100px]" />
      </div>

      <div className="ph-container relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal>
            <p className="ph-eyebrow mb-5">{t('premiumHome.brand')}</p>
            <h1 className="ph-title text-4xl leading-[1.08] sm:text-5xl lg:text-[3.35rem]">
              {t('premiumHome.hero.title')}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {t('premiumHome.hero.subtitle')}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/qr/create?quick=1" prefetch={false} className="ph-btn-primary">
                {t('premiumHome.hero.primaryCta')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href={localizePath('/templates', locale)} className="ph-btn-secondary">
                {t('premiumHome.hero.secondaryCta')}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="relative">
            <GlassPanel className="overflow-hidden p-2 sm:p-3">
              <div className="relative aspect-[16/11] overflow-hidden rounded-[1.15rem] bg-slate-900">
                <Image
                  src="/images/landing/premium-hero-exhibition.webp"
                  alt={t('premiumHome.hero.imageAlt')}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 540px"
                  className="object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-slate-950/35 via-transparent to-cyan-400/10"
                  aria-hidden
                />
              </div>
            </GlassPanel>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
