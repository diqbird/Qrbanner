import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, QrCode, Route, BarChart3, CheckCircle2, Calendar } from 'lucide-react';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { demoBookingUrl } from '@/lib/site-contact';
import { HeroMedia } from '@/components/landing/hero-media';

const HIGHLIGHT_ICONS = [QrCode, Route, BarChart3];
const HIGHLIGHT_KEYS = [
  { label: 'hero.highlightTypes', desc: 'hero.highlightTypesDesc' },
  { label: 'hero.highlightRouting', desc: 'hero.highlightRoutingDesc' },
  { label: 'hero.highlightAnalytics', desc: 'hero.highlightAnalyticsDesc' },
] as const;

const TRUST_KEYS = ['hero.trustTypes', 'hero.trustApi', 'hero.trustCancel'] as const;

export async function LandingHeroStatic() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  const demoUrl = demoBookingUrl();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-24 lg:py-28">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-xl lg:blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-xl lg:blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <Badge variant="secondary" className="mb-6">
              <Zap className="mr-1 h-3 w-3" aria-hidden /> {t('hero.badge')}
            </Badge>

            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-tight">
              {t('hero.title')}
            </h1>

            <p className="mt-6 text-lg text-muted-foreground lg:max-w-xl">{t('hero.subtitle')}</p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link href="/qr/create?quick=1" prefetch={false}>
                <Button size="lg" className="gap-2 rounded-full px-8">
                  {t('hero.createQr')} <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
              <Link href={demoUrl} prefetch={false}>
                <Button variant="outline" size="lg" className="gap-2 rounded-full px-8">
                  <Calendar className="h-4 w-4" aria-hidden />
                  {t('hero.bookDemo')}
                </Button>
              </Link>
            </div>
            <p className="mt-3 text-xs text-muted-foreground lg:text-left">{t('hero.createQrHint')}</p>

            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground lg:justify-start">
              {TRUST_KEYS.map((key) => (
                <li key={key} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>

          <div className="mx-auto w-full max-w-lg lg:max-w-none">
            <HeroMedia
              label={t('hero.videoLabel')}
              demoHref="/demo"
              demoLabel={t('hero.watchDemo')}
            />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {HIGHLIGHT_KEYS.map((item, i) => {
            const Icon = HIGHLIGHT_ICONS[i];
            return (
              <div
                key={item.label}
                className="rounded-2xl border border-border/40 bg-card/80 p-5 shadow-sm backdrop-blur-sm"
              >
                <Icon className="mb-2 h-6 w-6 text-primary" aria-hidden />
                <h2 className="font-display text-sm font-semibold">{t(item.label)}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{t(item.desc)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
