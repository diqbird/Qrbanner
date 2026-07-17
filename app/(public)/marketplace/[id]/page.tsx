import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { pageMetadata, webPageJsonLd, marketplaceListingJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { PremiumPageFrame } from '@/components/landing/premium/page-frame';
import { JsonLd } from '@/components/seo/json-ld';
import { MARKETPLACE_PLATFORM_FEE_PERCENT } from '@/lib/marketplace-types';
import { formatLocalizedListingPrice } from '@/lib/i18n/resolve-marketplace-listing-labels';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { MarketplacePurchaseButton } from '@/components/templates/marketplace-purchase-button';
import { MarketplacePaidReturn } from '@/components/templates/marketplace-paid-return';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);
  const listing = await prisma.marketplaceListing.findUnique({
    where: { id: params.id },
    select: { id: true, title: true, description: true, status: true },
  });
  if (!listing || listing.status !== 'published') {
    return pageMetadata({
      locale,
      title: t('marketplaceSeller.browseTitle'),
      description: t('marketplaceSeller.browseMetaDescription'),
      path: `/marketplace/${params.id}`,
      noIndex: true,
    });
  }
  const desc = listing.description.replace(/\s+/g, ' ').trim().slice(0, 160);
  return pageMetadata({
    locale,
    title: `${listing.title} — ${t('marketplaceSeller.browseTitle')}`,
    description: desc || t('marketplaceSeller.browseMetaDescription'),
    path: `/marketplace/${listing.id}`,
    keywords: ['QR template marketplace', 'community QR template', listing.title],
  });
}

export default async function MarketplaceListingPage({ params }: { params: { id: string } }) {
  const listing = await prisma.marketplaceListing.findUnique({
    where: { id: params.id },
    include: { seller: { select: { displayName: true } } },
  });
  if (!listing || listing.status !== 'published') notFound();

  const locale = await getServerLocale();
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);
  const pageTitle = `${listing.title} — ${t('marketplaceSeller.browseTitle')}`;
  const pageDesc = listing.description.replace(/\s+/g, ' ').trim().slice(0, 160);

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            title: pageTitle,
            description: pageDesc || t('marketplaceSeller.browseMetaDescription'),
            path: `/marketplace/${listing.id}`,
            locale,
          }),
          marketplaceListingJsonLd({
            id: listing.id,
            title: listing.title,
            description: listing.description,
            priceCents: listing.priceCents,
            currency: listing.currency,
            sellerName: listing.seller.displayName,
            locale,
          }),
        ]}
      />
      <PremiumPageFrame narrow="3xl">
        <PublicBreadcrumbs
          items={[
            { label: t('nav.templates'), href: '/templates' },
            { label: t('marketplaceSeller.browseTitle'), href: '/marketplace' },
            { label: listing.title, href: `/marketplace/${listing.id}` },
          ]}
        />
        <article>
          <header>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{formatLocalizedListingPrice(listing.priceCents, locale, t, listing.currency)}</Badge>
              <Badge variant="outline">{listing.seller.displayName}</Badge>
            </div>
            <h1 className="mt-4 ph-title text-3xl sm:text-4xl">{listing.title}</h1>
            <p className="mt-4 text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
          </header>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <MarketplacePurchaseButton listingId={listing.id} priceCents={listing.priceCents} />
            {listing.templateId && (
              <Link href={`/templates/${listing.templateId}`}>
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  {t('marketplaceSeller.relatedTemplate')} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <Link href="/marketplace">
              <Button variant="ghost" className="gap-2 w-full sm:w-auto">
                {t('marketplaceSeller.backToBrowse')}
              </Button>
            </Link>
          </div>
        </article>

        <Suspense fallback={null}>
          <MarketplacePaidReturn />
        </Suspense>

        <p className="mt-6 text-xs text-muted-foreground">
          {t('marketplaceSeller.feeNote', { fee: formatLocaleNumber(MARKETPLACE_PLATFORM_FEE_PERCENT, locale) })}
        </p>
      </PremiumPageFrame>
    </>
  );
}
