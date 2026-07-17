'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, Code2, Layers, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLocalePath } from '@/components/i18n/use-locale-path';
import { Reveal } from '@/components/landing/premium/primitives';

const HIGHLIGHTS = [
  { icon: RefreshCw, key: 'dynamic' as const },
  { icon: BarChart3, key: 'analytics' as const },
  { icon: Layers, key: 'routing' as const },
  { icon: Code2, key: 'api' as const },
];

export function FeaturesPageHero() {
  const { t } = useLanguage();

  return (
    <Reveal className="relative mx-auto max-w-2xl text-center">
      <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 flex justify-center" aria-hidden>
        <div className="h-40 w-72 rounded-full bg-[#2563EB]/15 blur-[70px] dark:bg-[#2563EB]/25" />
      </div>
      <p className="ph-eyebrow mb-4">{t('nav.features')}</p>
      <h1 className="ph-title text-4xl leading-[1.1] sm:text-5xl lg:text-[3.25rem]">
        {t('features.pageTitle')}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('features.pageSubtitle')}</p>
      <div className="mt-8">
        <Link href="/signup" className="ph-btn-primary">
          {t('common.getStartedFree')} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </Reveal>
  );
}

export function FeaturesPageHighlights() {
  const { t } = useLanguage();

  return (
    <div className="mt-14 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
      {HIGHLIGHTS.map(({ icon: Icon, key }, index) => (
        <Reveal key={key} delay={0.04 * index} className="h-full">
          <div className="ph-card flex h-full flex-col items-center p-5 text-center">
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:bg-sky-400/15 dark:text-sky-400">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <p className="ph-title text-sm">{t(`features.highlight.${key}Title`)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t(`features.highlight.${key}Desc`)}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function FeaturesPageVsStaticBand() {
  const { t } = useLanguage();
  const localePath = useLocalePath();

  return (
    <Reveal className="mt-12">
      <div className="ph-card border-[#2563EB]/25 bg-[#2563EB]/5 px-6 py-8 text-center hover:translate-y-0 hover:scale-100 dark:border-sky-400/30 dark:bg-sky-400/10 sm:px-10">
        <p className="ph-eyebrow mb-3">{t('features.vsStaticBadge')}</p>
        <h2 className="ph-title text-xl sm:text-2xl">{t('features.vsStaticTitle')}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {t('features.vsStaticDesc')}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={localePath('/pricing')} className="ph-btn-secondary">
            {t('nav.pricing')}
          </Link>
          <Link href={localePath('/vs')} className="ph-btn-secondary">
            {t('features.compareCompetitors')}
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
