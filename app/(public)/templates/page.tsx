import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { TemplateMarketplaceGrid } from '@/components/templates/template-marketplace-grid';
import { CommunityMarketplaceSection } from '@/components/templates/community-marketplace-section';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { PremiumShell } from '@/components/landing/premium/primitives';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
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
    title: t('templateMarketplace.metaTitle'),
    description: t('templateMarketplace.metaDescription'),
    path: '/templates',
    keywords: [
      'QR code templates',
      'restaurant menu QR template',
      'business card QR',
      'professional QR designs',
    ],
  });
}

export default async function TemplatesMarketplacePage({
  searchParams,
}: {
  searchParams?: { q?: string | string[] };
}) {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  const rawQ = searchParams?.q;
  const initialQuery = Array.isArray(rawQ) ? (rawQ[0] ?? '') : (rawQ ?? '');

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('templateMarketplace.title'),
          description: t('templateMarketplace.subtitle'),
          path: '/templates',
          locale,
        })}
      />
      <PremiumShell>
        <div className="ph-container pb-16 pt-6 sm:pb-24 sm:pt-8">
          <PublicBreadcrumbs items={[{ label: t('nav.templates'), href: '/templates' }]} />
          <header className="relative mx-auto max-w-2xl text-center">
            <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 flex justify-center" aria-hidden>
              <div className="h-40 w-72 rounded-full bg-[#2563EB]/15 blur-[70px] dark:bg-[#2563EB]/25" />
            </div>
            <p className="ph-eyebrow mb-4">{t('nav.templates')}</p>
            <h1 className="ph-title text-4xl leading-[1.1] sm:text-5xl">{t('templateMarketplace.title')}</h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {t('templateMarketplace.subtitle')}
            </p>
          </header>
          <div className="mt-12">
            <TemplateMarketplaceGrid initialQuery={initialQuery} />
            <CommunityMarketplaceSection />
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Link href={localizePath('/solutions', locale)} className="ph-btn-secondary">
              {t('templateMarketplace.browseSolutions')}
            </Link>
            <Link href="/qr/create" prefetch={false} className="ph-btn-primary">
              {t('templateMarketplace.cta')} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </PremiumShell>
    </>
  );
}
