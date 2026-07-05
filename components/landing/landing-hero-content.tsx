import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { demoBookingUrl } from '@/lib/site-contact';
import { HeroMedia } from '@/components/landing/hero-media';

const TRUST_KEYS = ['hero.trustTypes', 'hero.trustApi', 'hero.trustCancel'] as const;

export function LandingHeroContent({
  t,
  freeQrCount,
}: {
  t: (key: string, vars?: Record<string, string | number>) => string;
  freeQrCount: number;
}) {
  const demoUrl = demoBookingUrl();

  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <div className="text-center lg:text-left">
        <Badge variant="secondary" className="mb-6">
          <Zap className="mr-1 h-3 w-3" aria-hidden /> {t('hero.badge')}
        </Badge>

        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-tight">
          {t('hero.title')}
        </h1>

        <p className="mt-6 text-lg text-muted-foreground lg:max-w-xl">{t('hero.subtitle')}</p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap lg:justify-start">
          <Link href="/qr/create?quick=1" prefetch={false}>
            <Button size="lg" className="gap-2 rounded-full px-8">
              {t('hero.createQr')} <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold text-foreground hover:underline underline-offset-4"
          >
            {t('common.getStartedFree')} →
          </Link>
          <Link
            href={demoUrl}
            prefetch={false}
            className="text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
          >
            {t('hero.bookDemo')}
          </Link>
        </div>
        <p className="mt-3 text-xs text-muted-foreground lg:text-left">{t('hero.createQrHint', { count: freeQrCount })}</p>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground lg:justify-start">
          {TRUST_KEYS.map((key) => (
            <li key={key} className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-foreground" aria-hidden />
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
  );
}
