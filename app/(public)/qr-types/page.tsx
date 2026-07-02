import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { buildQrTypePages } from '@/lib/qr-type-pages';
import { localizeQrTypePage } from '@/lib/i18n/resolve-programmatic-copy';
import { QR_CATEGORIES, QR_CATEGORY_GROUPS } from '@/lib/qr-utils';
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
    title: t('qrTypesIndex.metaTitle'),
    description: t('qrTypesIndex.metaDescription'),
    path: '/qr-types',
    keywords: ['QR code types', 'QR code generator types', 'WiFi QR', 'vCard QR', 'menu QR code'],
  });
}

export default async function QrTypesIndexPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  const pages = buildQrTypePages().map((p) => localizeQrTypePage(p, locale));
  const pageBySlug = Object.fromEntries(pages.map((p) => [p.slug, p]));

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('qrTypesIndex.title'),
          description: t('qrTypesIndex.subtitle'),
          path: '/qr-types',
        })}
      />
      <PublicBreadcrumbs items={[{ label: t('nav.qrTypes'), href: '/qr-types' }]} />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6">
          <header className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {t('qrTypesIndex.title')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('qrTypesIndex.subtitle')}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              {t('qrTypesIndex.alsoSee')}{' '}
              <Link href="/use-cases" className="text-primary underline underline-offset-2 hover:no-underline">
                {t('nav.useCases')}
              </Link>
            </p>
          </header>

          <div className="mt-12 space-y-12">
            {QR_CATEGORY_GROUPS.map((group) => {
              const cats = QR_CATEGORIES.filter((c) => c.group === group.id);
              return (
                <section key={group.id}>
                  <div className="mb-4">
                    <h2 className="font-display text-xl font-semibold">{group.label}</h2>
                    <p className="text-sm text-muted-foreground">{group.subtitle}</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cats.map((cat) => {
                      const p = pageBySlug[cat.id];
                      if (!p) return null;
                      return (
                        <Link
                          key={p.slug}
                          href={`/qr-types/${p.slug}`}
                          className="group rounded-xl border border-border/50 bg-card p-5 transition-colors hover:border-primary/40 hover:bg-card/80"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-display font-semibold group-hover:text-primary">
                              {p.title.replace(' Generator', '')}
                            </h3>
                            {p.isDynamic && (
                              <Badge variant="secondary" className="shrink-0 text-[10px]">
                                {t('qrTypesIndex.dynamic')}
                              </Badge>
                            )}
                          </div>
                          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                            {t('qrTypesIndex.create')} <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
