import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Webhook, Workflow } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { marketingCountVars } from '@/lib/i18n/qr-type-count';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const counts = marketingCountVars(locale);
  const t = (key: string) => translate(locale, key, counts);
  return pageMetadata({
    locale,
    title: t('makePage.metaTitle'),
    description: t('makePage.metaDescription'),
    path: '/integrations/make',
    keywords: ['QR code Make.com', 'QR scan webhook', 'Make.com QR integration', 'Integromat QR'],
  });
}

const STEP_KEYS = [
  { title: 'makePage.step1Title', body: 'makePage.step1Body' },
  { title: 'makePage.step2Title', body: 'makePage.step2Body' },
  { title: 'makePage.step3Title', body: 'makePage.step3Body' },
] as const;

export default async function MakeIntegrationPage() {
  const locale = await getServerLocale();
  const counts = marketingCountVars(locale);
  const t = (key: string, vars?: Record<string, string | number>) =>
    translate(locale, key, { ...counts, ...vars });

  return (
    <>
      <PublicBreadcrumbs
        items={[
          { label: t('nav.integrations'), href: '/integrations' },
          { label: t('nav.make'), href: '/integrations/make' },
        ]}
      />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <header className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Workflow className="h-7 w-7 text-primary" />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight">{t('makePage.title')}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('makePage.subtitle')}</p>
            <Link href="/settings" className="mt-8 inline-block">
              <Button size="lg" className="gap-2">
                {t('makePage.cta')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </header>

          <section className="mt-14">
            <h2 className="font-display text-xl font-semibold flex items-center gap-2">
              <Webhook className="h-5 w-5 text-primary" /> {t('makePage.setupTitle')}
            </h2>
            <ol className="mt-6 space-y-4">
              {STEP_KEYS.map((step, i) => (
                <li key={step.title} className="rounded-xl border border-border/50 bg-card p-5">
                  <p className="text-xs font-medium text-primary">
                    {t('makePage.step', { n: formatLocaleNumber(i + 1, locale) })}
                  </p>
                  <p className="mt-1 font-medium">{t(step.title)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t(step.body)}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-10 rounded-xl border bg-muted/30 p-6 text-sm">
            <p className="font-medium">{t('makePage.payloadTitle')}</p>
            <ul className="mt-2 list-inside list-disc text-muted-foreground space-y-1">
              <li>{t('makePage.payload1')}</li>
              <li>{t('makePage.payload2')}</li>
              <li>{t('makePage.payload3')}</li>
              <li>{t('makePage.payload4')}</li>
            </ul>
            <Link href="/developers" className="mt-4 inline-block text-primary hover:underline">
              {t('makePage.docsLink')} →
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
