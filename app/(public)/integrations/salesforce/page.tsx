import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Webhook } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { PremiumPageFrame } from '@/components/landing/premium/page-frame';
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
    title: t('salesforcePage.metaTitle'),
    description: t('salesforcePage.metaDescription'),
    path: '/integrations/salesforce',
    keywords: ['QR Salesforce', 'QR scan webhook Salesforce', 'Salesforce QR integration'],
  });
}

const STEP_KEYS = [
  { title: 'salesforcePage.step1Title', body: 'salesforcePage.step1Body' },
  { title: 'salesforcePage.step2Title', body: 'salesforcePage.step2Body' },
  { title: 'salesforcePage.step3Title', body: 'salesforcePage.step3Body' },
] as const;

export default async function SalesforceIntegrationPage() {
  const locale = await getServerLocale();
  const counts = marketingCountVars(locale);
  const t = (key: string, vars?: Record<string, string | number>) =>
    translate(locale, key, { ...counts, ...vars });

  return (
    <>
      <PremiumPageFrame narrow="3xl">
        <PublicBreadcrumbs
        items={[
        { label: t('nav.integrations'), href: '/integrations' },
        { label: t('nav.salesforce'), href: '/integrations/salesforce' },
        ]}
        />
          <header className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Webhook className="h-7 w-7 text-primary" />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight">{t('salesforcePage.title')}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('salesforcePage.subtitle')}</p>
            <Link href="/settings" className="mt-8 inline-block">
              <Button size="lg" className="gap-2">
                {t('salesforcePage.cta')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </header>

          <section className="mt-14">
            <h2 className="font-display text-xl font-semibold flex items-center gap-2">
              <Webhook className="h-5 w-5 text-primary" /> {t('salesforcePage.setupTitle')}
            </h2>
            <ol className="mt-6 space-y-4">
              {STEP_KEYS.map((step, i) => (
                <li key={step.title} className="rounded-xl border border-border/50 bg-card p-5">
                  <p className="text-xs font-medium text-primary">
                    {t('salesforcePage.step', { n: formatLocaleNumber(i + 1, locale) })}
                  </p>
                  <p className="mt-1 font-medium">{t(step.title)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t(step.body)}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-10 rounded-xl border bg-muted/30 p-6 text-sm">
            <p className="font-medium">{t('salesforcePage.payloadTitle')}</p>
            <ul className="mt-2 list-inside list-disc text-muted-foreground space-y-1">
              <li>{t('salesforcePage.payload1')}</li>
              <li>{t('salesforcePage.payload2')}</li>
              <li>{t('salesforcePage.payload3')}</li>
              <li>{t('salesforcePage.payload4')}</li>
            </ul>
            <Link href="/developers" className="mt-4 inline-block text-primary hover:underline">
              {t('salesforcePage.docsLink')} →
            </Link>
          </section>
      </PremiumPageFrame>
    </>
  );
}
