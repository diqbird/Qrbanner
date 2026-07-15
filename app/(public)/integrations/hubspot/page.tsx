import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Webhook } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { IntegrationWebhookRecipe } from '@/components/public/integration-webhook-recipe';
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
    title: t('hubspotPage.metaTitle'),
    description: t('hubspotPage.metaDescription'),
    path: '/integrations/hubspot',
    keywords: ['QR HubSpot', 'QR scan webhook HubSpot', 'HubSpot QR integration'],
  });
}

const STEP_KEYS = [
  { title: 'hubspotPage.step1Title', body: 'hubspotPage.step1Body' },
  { title: 'hubspotPage.step2Title', body: 'hubspotPage.step2Body' },
  { title: 'hubspotPage.step3Title', body: 'hubspotPage.step3Body' },
] as const;

export default async function HubSpotIntegrationPage() {
  const locale = await getServerLocale();
  const counts = marketingCountVars(locale);
  const t = (key: string, vars?: Record<string, string | number>) =>
    translate(locale, key, { ...counts, ...vars });

  return (
    <>
      <PublicBreadcrumbs
        items={[
          { label: t('nav.integrations'), href: '/integrations' },
          { label: t('nav.hubspot'), href: '/integrations/hubspot' },
        ]}
      />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <header className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Webhook className="h-7 w-7 text-primary" />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight">{t('hubspotPage.title')}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('hubspotPage.subtitle')}</p>
            <Link href="/settings" className="mt-8 inline-block">
              <Button size="lg" className="gap-2 rounded-xl shadow-[0_14px_34px_-14px_hsl(var(--primary)/0.7)]">
                {t('hubspotPage.cta')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </header>

          <section className="mt-14">
            <h2 className="font-display text-xl font-semibold flex items-center gap-2">
              <Webhook className="h-5 w-5 text-primary" /> {t('hubspotPage.setupTitle')}
            </h2>
            <ol className="mt-6 space-y-4">
              {STEP_KEYS.map((step, i) => (
                <li
                  key={step.title}
                  className="surface-3d rounded-2xl border border-white/30 bg-card/80 p-5 backdrop-blur-md dark:border-white/10"
                >
                  <p className="text-xs font-medium text-primary">
                    {t('hubspotPage.step', { n: formatLocaleNumber(i + 1, locale) })}
                  </p>
                  <p className="mt-1 font-medium">{t(step.title)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t(step.body)}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-10 rounded-xl border bg-muted/30 p-6 text-sm">
            <p className="font-medium">{t('hubspotPage.payloadTitle')}</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
              <li>{t('hubspotPage.payload1')}</li>
              <li>{t('hubspotPage.payload2')}</li>
              <li>{t('hubspotPage.payload3')}</li>
              <li>{t('hubspotPage.payload4')}</li>
            </ul>
          </section>

          <IntegrationWebhookRecipe
            sampleTitle={t('hubspotPage.sampleTitle')}
            hmacTitle={t('hubspotPage.hmacTitle')}
            hubspotMapTitle={t('hubspotPage.fieldMapTitle')}
            docsLabel={t('hubspotPage.docsLink')}
            showHubspotMap
          />
        </div>
      </div>
    </>
  );
}
