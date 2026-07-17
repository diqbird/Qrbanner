'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BarChart3, Code2, Layers, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLocalePath } from '@/components/i18n/use-locale-path';

const HIGHLIGHTS = [
  { icon: RefreshCw, key: 'dynamic' as const },
  { icon: BarChart3, key: 'analytics' as const },
  { icon: Layers, key: 'routing' as const },
  { icon: Code2, key: 'api' as const },
];

export function FeaturesPageHero() {
  const { t } = useLanguage();

  return (
    <header className="mx-auto max-w-2xl text-center">
      <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
        {t('features.pageTitle')}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">{t('features.pageSubtitle')}</p>
      <Link href="/signup" className="mt-8 inline-block">
        <Button size="lg" className="gap-2">
          {t('common.getStartedFree')} <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </header>
  );
}

export function FeaturesPageHighlights() {
  const { t } = useLanguage();

  return (
    <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {HIGHLIGHTS.map(({ icon: Icon, key }) => (
        <div
          key={key}
          className="rounded-xl border border-border/50 bg-card/80 p-5 text-center backdrop-blur-sm"
        >
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          <p className="font-display text-sm font-semibold">{t(`features.highlight.${key}Title`)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t(`features.highlight.${key}Desc`)}</p>
        </div>
      ))}
    </div>
  );
}

export function FeaturesPageVsStaticBand() {
  const { t } = useLanguage();
  const localePath = useLocalePath();

  return (
    <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-8 text-center sm:px-10">
      <Badge variant="secondary" className="mb-3">
        {t('features.vsStaticBadge')}
      </Badge>
      <h2 className="font-display text-xl font-bold sm:text-2xl">{t('features.vsStaticTitle')}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
        {t('features.vsStaticDesc')}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href={localePath('/pricing')}>
          <Button variant="outline">{t('nav.pricing')}</Button>
        </Link>
        <Link href={localePath('/vs')}>
          <Button variant="ghost">{t('features.compareCompetitors')}</Button>
        </Link>
      </div>
    </div>
  );
}
