import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { pageMetadata } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { MARKETPLACE_PLATFORM_FEE_PERCENT } from '@/lib/marketplace-types';
import { formatLocalizedListingPrice } from '@/lib/i18n/resolve-marketplace-listing-labels';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { MarketplacePurchaseButton } from '@/components/templates/marketplace-purchase-button';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const listing = await prisma.marketplaceListing.findUnique({
    where: { id: params.id },
    select: { title: true, description: true, status: true },
  });
  if (!listing || listing.status !== 'published') return {};
  const locale = await getServerLocale();
  return pageMetadata({
    locale,
    title: listing.title,
    description: listing.description.slice(0, 160),
    path: `/marketplace/${params.id}`,
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

  return (
    <>
      <PublicBreadcrumbs
        items={[
          { label: t('nav.templates'), href: '/templates' },
          { label: listing.title, href: `/marketplace/${listing.id}` },
        ]}
      />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <header>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{formatLocalizedListingPrice(listing.priceCents, locale, t, listing.currency)}</Badge>
              <Badge variant="outline">{listing.seller.displayName}</Badge>
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {listing.title}
            </h1>
            <p className="mt-4 text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
          </header>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <MarketplacePurchaseButton listingId={listing.id} priceCents={listing.priceCents} />
            {listing.templateId && (
              <Link href={`/templates/${listing.templateId}`}>
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  {t('templateDetail.backToMarketplace')} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            {t('marketplaceSeller.feeNote', { fee: formatLocaleNumber(MARKETPLACE_PLATFORM_FEE_PERCENT, locale) })}
          </p>
        </div>
      </div>
    </>
  );
}
