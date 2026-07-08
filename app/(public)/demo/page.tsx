import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { heroVideoEmbed } from '@/lib/marketing-config';
import { HeroVideoEmbed } from '@/components/landing/hero-video-embed';
import { HeroProductPreview } from '@/components/landing/hero-product-preview';
import { demoBookingUrl } from '@/lib/site-contact';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('demo.metaTitle'),
    description: t('demo.metaDescription'),
    path: '/demo',
  });
}

const DEMO_POINT_KEYS = [
  'demo.point1',
  'demo.point2',
  'demo.point3',
  'demo.point4',
] as const;

export default async function DemoPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  const embed = heroVideoEmbed();
  const liveDemoUrl = demoBookingUrl();

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('demo.title'),
          description: t('demo.subtitle'),
          path: '/demo',
        })}
      />
      <PublicBreadcrumbs items={[{ label: t('demo.title'), href: '/demo' }]} />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <header className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t('demo.title')}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('demo.subtitle')}</p>
          </header>

          <div className="mt-12">
            {embed ? (
              <HeroVideoEmbed embed={embed} label={t('demo.videoLabel')} />
            ) : (
              <HeroProductPreview t={t} locale={locale} />
            )}
            {!embed && (
              <p className="mt-4 text-center text-sm text-muted-foreground">{t('demo.noVideoHint')}</p>
            )}
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {DEMO_POINT_KEYS.map((key) => (
              <li key={key} className="flex items-start gap-2 rounded-lg border border-border/50 bg-card/60 p-4 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span>{t(key)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                {t('common.getStartedFree')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={liveDemoUrl}>
              <Button variant="outline" size="lg">
                {t('hero.bookDemo')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
