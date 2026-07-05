'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { categoryShortName } from '@/lib/qr-utils';
import type { TemplateMarketplaceState } from '@/hooks/use-template-marketplace';

export function TemplateMarketplaceFilters({ market }: { market: TemplateMarketplaceState }) {
  const { t, categories, query, setQuery, category, setCategory, filtered } = market;

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-lg font-semibold">{t('templateMarketplace.allTitle')}</h2>
        <div className="relative sm:max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('templateMarketplace.searchPlaceholder')}
            className="pl-9"
            aria-label={t('templateMarketplace.searchPlaceholder')}
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={category === 'all' ? 'default' : 'outline'}
          className="h-8 text-xs"
          onClick={() => setCategory('all')}
        >
          {t('templateMarketplace.categoryAll')}
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            type="button"
            size="sm"
            variant={category === cat ? 'default' : 'outline'}
            className="h-8 text-xs"
            onClick={() => setCategory(cat)}
          >
            {categoryShortName(cat)}
          </Button>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {t('templateMarketplace.resultsCount', { n: filtered.length })}
      </p>
    </>
  );
}
