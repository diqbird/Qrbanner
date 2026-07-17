'use client';

import { LayoutTemplate } from 'lucide-react';
import { useTemplateMarketplace } from '@/hooks/use-template-marketplace';
import { TemplateMarketplaceCard } from './template-marketplace-card';
import { TemplateMarketplaceFilters } from './template-marketplace-filters';

export function TemplateMarketplaceGrid({ initialQuery = '' }: { initialQuery?: string }) {
  const market = useTemplateMarketplace(initialQuery);
  const { t, featured, filtered } = market;

  return (
    <div className="space-y-10" data-testid="template-marketplace">
      <section>
        <h2 className="font-display text-lg font-semibold flex items-center gap-2">
          <LayoutTemplate className="h-5 w-5 text-primary" />
          {t('templateMarketplace.featuredTitle')}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((template) => (
            <TemplateMarketplaceCard key={template.id} template={template} />
          ))}
        </div>
      </section>

      <section>
        <TemplateMarketplaceFilters market={market} />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => (
            <TemplateMarketplaceCard key={template.id} template={template} />
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {t('templateMarketplace.noResults')}
          </p>
        ) : null}
      </section>
    </div>
  );
}
