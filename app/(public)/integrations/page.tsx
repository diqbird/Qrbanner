import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Code2, Webhook, Zap, BarChart3 } from 'lucide-react';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { Button } from '@/components/ui/button';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
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
    keywords: ['QR code API', 'QR webhook', 'Zapier QR integration', 'HubSpot QR', 'Salesforce QR', 'QRbanner integrations'],
  });
}

const INTEGRATION_KEYS = [
  { key: 'zapier', icon: Zap, href: '/integrations/zapier' },
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
        })}
      />
      <PublicBreadcrumbs items={[{ label: t('integrations.title'), href: '/integrations' }]} />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <header className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t('integrations.title')}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('integrations.subtitle')}</p>
          </header>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {INTEGRATION_KEYS.map(({ key, icon: Icon, href }) => (
              <Link
                key={key}
                href={href}
                className="group rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-colors hover:border-primary/30"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <h2 className="font-display text-lg font-semibold">{t(`integrations.${key}Title`)}</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {t(`integrations.${key}Desc`)}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  {t('integrations.learnMore')} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                {t('common.getStartedFree')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
