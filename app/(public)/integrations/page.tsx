import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Code2, Webhook, Zap, BarChart3, Workflow } from 'lucide-react';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { PremiumShell } from '@/components/landing/premium/primitives';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';
import { marketingCountVars } from '@/lib/i18n/qr-type-count';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const counts = marketingCountVars(locale);
  const t = (key: string) => translate(locale, key, counts);
  return pageMetadata({
    locale,
    title: t('integrationsPage.metaTitle'),
    description: t('integrationsPage.metaDescription'),
    path: '/integrations',
    keywords: [
      'QR code API',
      'QR webhook',
      'Zapier QR integration',
      'HubSpot QR',
      'Salesforce QR',
      'QRbanner integrations',
    ],
  });
}

const INTEGRATION_KEYS = [
  { key: 'zapier', icon: Zap, href: '/integrations/zapier' },
  { key: 'make', icon: Workflow, href: '/integrations/make' },
  { key: 'hubspot', icon: Webhook, href: '/integrations/hubspot' },
  { key: 'salesforce', icon: Webhook, href: '/integrations/salesforce' },
  { key: 'api', icon: Code2, href: '/developers' },
  { key: 'webhooks', icon: Webhook, href: '/developers#webhooks' },
  { key: 'analytics', icon: BarChart3, href: '/features' },
] as const;

export default async function IntegrationsPage() {
  const locale = await getServerLocale();
  const counts = marketingCountVars(locale);
  const t = (key: string, vars?: Record<string, string | number>) =>
    translate(locale, key, { ...counts, ...vars });

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('integrations.title'),
          description: t('integrations.subtitle'),
          path: '/integrations',
          locale,
        })}
      />
      <PremiumShell>
        <div className="ph-container pb-16 pt-6 sm:pb-24 sm:pt-8">
          <div className="mx-auto max-w-4xl">
            <PublicBreadcrumbs items={[{ label: t('integrations.title'), href: '/integrations' }]} />
            <header className="relative mx-auto max-w-2xl text-center">
              <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 flex justify-center" aria-hidden>
                <div className="h-40 w-72 rounded-full bg-[#2563EB]/15 blur-[70px] dark:bg-[#2563EB]/25" />
              </div>
              <p className="ph-eyebrow mb-4">{t('integrations.title')}</p>
              <h1 className="ph-title text-3xl leading-[1.1] sm:text-4xl lg:text-[2.75rem]">
                {t('integrations.title')}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('integrations.subtitle')}</p>
            </header>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {INTEGRATION_KEYS.map(({ key, icon: Icon, href }) => (
                <Link key={key} href={localizePath(href, locale)} className="ph-card group p-6">
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:bg-sky-400/15 dark:text-sky-400">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h2 className="ph-title text-lg">{t(`integrations.${key}Title`)}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`integrations.${key}Desc`)}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#2563EB] dark:text-sky-400">
                    {t('integrations.learnMore')}{' '}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/signup" className="ph-btn-primary">
                {t('common.getStartedFree')} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </PremiumShell>
    </>
  );
}
