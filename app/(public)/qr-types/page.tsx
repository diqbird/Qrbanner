import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buildQrTypePages } from '@/lib/qr-type-pages';
import { localizeQrTypePage } from '@/lib/i18n/resolve-programmatic-copy';
import { QR_CATEGORIES, QR_CATEGORY_GROUPS } from '@/lib/qr-utils';
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
    title: t('qrTypesIndex.metaTitle'),
    description: t('qrTypesIndex.metaDescription'),
    path: '/qr-types',
    keywords: ['QR code types', 'QR code generator types', 'WiFi QR', 'vCard QR', 'menu QR code'],
  });
}

export default async function QrTypesIndexPage() {
  const locale = await getServerLocale();
  const counts = marketingCountVars(locale);
  const t = (key: string) => translate(locale, key, counts);
  const pages = buildQrTypePages().map((p) => localizeQrTypePage(p, locale));
  const pageBySlug = Object.fromEntries(pages.map((p) => [p.slug, p]));

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('qrTypesIndex.title'),
          description: t('qrTypesIndex.subtitle'),
          path: '/qr-types',
          locale,
        })}
      />
      <PremiumShell>
        <div className="ph-container pb-16 pt-6 sm:pb-24 sm:pt-8">
          <div className="mx-auto max-w-[1080px]">
            <PublicBreadcrumbs items={[{ label: t('nav.qrTypes'), href: '/qr-types' }]} />
            <header className="relative mx-auto max-w-2xl text-center">
              <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 flex justify-center" aria-hidden>
                <div className="h-40 w-72 rounded-full bg-[#2563EB]/15 blur-[70px] dark:bg-[#2563EB]/25" />
              </div>
              <p className="ph-eyebrow mb-4">{t('nav.qrTypes')}</p>
              <h1 className="ph-title text-4xl leading-[1.1] sm:text-5xl">{t('qrTypesIndex.title')}</h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('qrTypesIndex.subtitle')}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                {t('qrTypesIndex.alsoSee')}{' '}
                <Link
                  href={localizePath('/use-cases', locale)}
                  className="text-[#2563EB] underline underline-offset-2 hover:no-underline dark:text-sky-400"
                >
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
                      <h2 className="ph-title text-xl">{group.label}</h2>
                      <p className="text-sm text-muted-foreground">{group.subtitle}</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {cats.map((cat) => {
                        const p = pageBySlug[cat.id];
                        if (!p) return null;
                        return (
                          <Link
                            key={p.slug}
                            href={localizePath(`/qr-types/${p.slug}`, locale)}
                            className="ph-card group p-5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="ph-title text-base group-hover:text-[#2563EB] dark:group-hover:text-sky-400">
                                {p.title.replace(' Generator', '')}
                              </h3>
                              {p.isDynamic && (
                                <span className="shrink-0 rounded-full border border-border/60 bg-background/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                  {t('qrTypesIndex.dynamic')}
                                </span>
                              )}
                            </div>
                            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#2563EB] dark:text-sky-400">
                              {t('qrTypesIndex.create')} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
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
      </PremiumShell>
    </>
  );
}
