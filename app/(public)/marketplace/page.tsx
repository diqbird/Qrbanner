import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Users } from 'lucide-react';
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { pageMetadata, webPageJsonLd, itemListJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { PremiumPageFrame } from '@/components/landing/premium/page-frame';
import { formatLocalizedListingPrice } from '@/lib/i18n/resolve-marketplace-listing-labels';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('marketplaceSeller.browseMetaTitle'),
    description: t('marketplaceSeller.browseMetaDescription'),
    path: '/marketplace',
    keywords: ['QR marketplace', 'community QR templates', 'buy QR templates'],
  });
}

export default async function MarketplaceBrowsePage() {
  const locale = await getServerLocale();
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);

  const listings = await prisma.marketplaceListing.findMany({
    where: { status: 'published' },
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      title: true,
      description: true,
      priceCents: true,
      currency: true,
      seller: { select: { displayName: true } },
    },
  });

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            title: t('marketplaceSeller.browseTitle'),
            description: t('marketplaceSeller.browseSubtitle'),
            path: '/marketplace',
            locale,
          }),
          itemListJsonLd(
            listings.map((listing) => ({
              name: listing.title,
              path: `/marketplace/${listing.id}`,
            })),
            locale
          ),
        ]}
      />
      <PremiumPageFrame narrow="1200">
        <PublicBreadcrumbs
        items={[
        { label: t('nav.templates'), href: '/templates' },
        { label: t('marketplaceSeller.browseTitle'), href: '/marketplace' },
        ]}
        />
          <header className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl flex items-center justify-center gap-3">
              <Users className="h-9 w-9 text-primary shrink-0" aria-hidden />
              {t('marketplaceSeller.browseTitle')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('marketplaceSeller.browseSubtitle')}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href={localizePath('/templates', locale)}>
                <Button variant="outline">{t('nav.templates')}</Button>
              </Link>
              <Link href="/settings">
                <Button className="gap-2">
                  {t('marketplaceSeller.sellCta')} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </header>

          {listings.length === 0 ? (
            <p className="mt-16 text-center text-muted-foreground">{t('marketplaceSeller.browseEmpty')}</p>
          ) : (
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <article
                  key={listing.id}
                  className="rounded-2xl border border-border/50 bg-card/80 p-5 backdrop-blur-sm transition-all hover:border-primary/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-display font-semibold">{listing.title}</h2>
                    <Badge variant="secondary">
                      {formatLocalizedListingPrice(listing.priceCents, locale, t, listing.currency)}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{listing.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{listing.seller.displayName}</p>
                  <Link
                    href={localizePath(`/marketplace/${listing.id}`, locale)}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    {t('marketplaceSeller.viewListing')} <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          )}
      </PremiumPageFrame>
    </>
  );
}
