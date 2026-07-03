import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Smartphone, Monitor, Code2, ArrowRight } from 'lucide-react';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('mobileApps.metaTitle'),
    description: t('mobileApps.metaDescription'),
    path: '/apps',
    keywords: ['QR code mobile app', 'QR PWA', 'install QRbanner', 'QR manager app'],
  });
}

export default async function MobileAppsPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('mobileApps.title'),
          description: t('mobileApps.subtitle'),
          path: '/apps',
        })}
      />
      <PublicBreadcrumbs items={[{ label: t('mobileApps.breadcrumb'), href: '/apps' }]} />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <header className="text-center max-w-2xl mx-auto">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Smartphone className="h-6 w-6 text-primary" aria-hidden />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
              {t('mobileApps.title')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('mobileApps.subtitle')}</p>
          </header>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-3">
              <Monitor className="h-6 w-6 text-primary" />
              <h2 className="font-display text-lg font-semibold">{t('mobileApps.pwaTitle')}</h2>
              <p className="text-sm text-muted-foreground">{t('mobileApps.pwaDesc')}</p>
              <Link href="/dashboard">
                <Button className="gap-2 rounded-full">
                  {t('mobileApps.openDashboard')} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-3">
              <Code2 className="h-6 w-6 text-primary" />
              <h2 className="font-display text-lg font-semibold">{t('mobileApps.apiTitle')}</h2>
              <p className="text-sm text-muted-foreground">{t('mobileApps.apiDesc')}</p>
              <ul className="text-xs text-muted-foreground space-y-1 font-mono">
                <li>GET /api/mobile/v1/summary</li>
                <li>GET /api/mobile/v1/qr</li>
                <li>GET /api/mobile/v1/qr/:id</li>
              </ul>
              <Link href="/developers">
                <Button variant="outline" className="gap-2 rounded-full">
                  {t('mobileApps.apiDocs')} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-dashed border-border/60 p-6 text-center">
            <p className="text-sm font-medium">{t('mobileApps.nativeTitle')}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t('mobileApps.nativeDesc')}</p>
          </div>
        </div>
      </div>
    </>
  );
}
