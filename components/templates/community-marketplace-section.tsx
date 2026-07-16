'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocalizedListingPrice } from '@/lib/i18n/resolve-marketplace-listing-labels';

interface CommunityListing {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  category: string | null;
  seller: { displayName: string };
}

export function CommunityMarketplaceSection() {
  const { t, locale } = useLanguage();
  const [listings, setListings] = useState<CommunityListing[]>([]);

  useEffect(() => {
    fetch('/api/marketplace/listings')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setListings((data?.listings ?? []).slice(0, 6)))
      .catch(() => undefined);
  }, []);

  if (!listings.length) return null;

  return (
    <section className="mt-14 border-t border-border/40 pt-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {t('marketplaceSeller.communityTitle')}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t('marketplaceSeller.communityDesc')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/marketplace">
            <Button variant="secondary" size="sm" className="gap-1">
              {t('marketplaceSeller.viewAllCommunity')} <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="outline" size="sm">{t('marketplaceSeller.sellCta')}</Button>
          </Link>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <article
            key={listing.id}
            className="rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display font-semibold">{listing.title}</h3>
              <Badge variant="secondary">{formatLocalizedListingPrice(listing.priceCents, locale, t)}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{listing.description}</p>
            <p className="mt-2 text-xs text-muted-foreground">{listing.seller.displayName}</p>
            <Link href={`/marketplace/${listing.id}`} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
              {t('marketplaceSeller.viewListing')} <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
