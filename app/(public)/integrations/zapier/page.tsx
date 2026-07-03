import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Webhook, Zap } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('zapierPage.metaTitle'),
    description: t('zapierPage.metaDescription'),
    path: '/integrations/zapier',
    keywords: ['QR code Zapier', 'QR scan webhook', 'QR automation', 'Zapier QR integration'],
  });
}

const STEP_KEYS = [
  { title: 'zapierPage.step1Title', body: 'zapierPage.step1Body' },
  { title: 'zapierPage.step2Title', body: 'zapierPage.step2Body' },
  { title: 'zapierPage.step3Title', body: 'zapierPage.step3Body' },
] as const;

export default async function ZapierIntegrationPage() {
  const locale = await getServerLocale();
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);

  return (
    <>
      <PublicBreadcrumbs
        items={[
          { label: t('nav.integrations'), href: '/integrations' },
          { label: t('nav.zapier'), href: '/integrations/zapier' },
        ]}
      />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <header className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight">{t('zapierPage.title')}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('zapierPage.subtitle')}</p>
            <Link href="/settings" className="mt-8 inline-block">
              <Button size="lg" className="gap-2">
                {t('zapierPage.cta')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </header>

          <section className="mt-14">
            <h2 className="font-display text-xl font-semibold flex items-center gap-2">
              <Webhook className="h-5 w-5 text-primary" /> {t('zapierPage.setupTitle')}
            </h2>
            <ol className="mt-6 space-y-4">
              {STEP_KEYS.map((step, i) => (
                <li key={step.title} className="rounded-xl border border-border/50 bg-card p-5">
                  <p className="text-xs font-medium text-primary">{t('zapierPage.step', { n: i + 1 })}</p>
                  <p className="mt-1 font-medium">{t(step.title)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t(step.body)}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-10 rounded-xl border bg-muted/30 p-6 text-sm">
            <p className="font-medium">{t('zapierPage.payloadTitle')}</p>
            <ul className="mt-2 list-inside list-disc text-muted-foreground space-y-1">
              <li>{t('zapierPage.payload1')}</li>
              <li>{t('zapierPage.payload2')}</li>
              <li>{t('zapierPage.payload3')}</li>
              <li>{t('zapierPage.payload4')}</li>
            </ul>
            <Link href="/developers" className="mt-4 inline-block text-primary hover:underline">
              {t('zapierPage.docsLink')} →
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
