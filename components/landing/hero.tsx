'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, QrCode, Route, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatFreePlanDynamicQrShortLabel } from '@/lib/i18n/dynamic-qr-label';

const HIGHLIGHT_ICONS = [QrCode, Route, BarChart3];
const HIGHLIGHT_KEYS = [
  { label: 'hero.highlightTypes', desc: 'hero.highlightTypesDesc' },
  { label: 'hero.highlightRouting', desc: 'hero.highlightRoutingDesc' },
  { label: 'hero.highlightAnalytics', desc: 'hero.highlightAnalyticsDesc' },
] as const;

export function LandingHero() {
  const { t, locale } = useLanguage();
  const qrTypeCount = formatQrTypeCount(locale);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 sm:py-28 lg:py-36">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1080px] px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-up">
            <Badge variant="secondary" className="mb-6">
              <Zap className="mr-1 h-3 w-3" aria-hidden /> {t('hero.badge')}
            </Badge>
          </div>

          <h1 className="animate-fade-up font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl [animation-delay:80ms]">
            {t('hero.title')}
          </h1>

          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg text-muted-foreground [animation-delay:160ms]">
            {t('hero.subtitle')}
          </p>

          <div className="animate-fade-up mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center [animation-delay:240ms]">
            <Link href="/qr/create?quick=1">
              <Button size="lg" className="gap-2 rounded-full px-8">
                {t('hero.createQr')} <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              {t('common.getStartedFree')} →
            </Link>
          </div>
          <p className="animate-fade-up mt-3 text-center text-xs text-muted-foreground [animation-delay:280ms]">
            {t('hero.createQrHint', { qrLabel: formatFreePlanDynamicQrShortLabel(locale) })}
          </p>

          <div className="animate-fade-up mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 [animation-delay:320ms]">
            {HIGHLIGHT_KEYS.map((item, i) => {
              const Icon = HIGHLIGHT_ICONS[i];
              return (
                <div key={item.label} className="rounded-2xl border border-border/40 bg-card/80 p-5 shadow-sm backdrop-blur-sm">
                  <Icon className="mb-2 h-6 w-6 text-foreground" aria-hidden />
                  <h3 className="font-display text-sm font-semibold">
                    {item.label === 'hero.highlightTypes'
                      ? t(item.label, { count: qrTypeCount })
                      : t(item.label)}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{t(item.desc)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
