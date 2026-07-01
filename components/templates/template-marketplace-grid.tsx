'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, LayoutTemplate, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/components/i18n/language-provider';
import {
  resolveTemplateName,
  resolveTemplateTagline,
  resolveTemplateUseCases,
} from '@/lib/i18n/resolve-template-copy';
import { categoryShortName } from '@/lib/qr-utils';
import {
  FEATURED_TEMPLATE_IDS,
  createUrlForTemplate,
  filterMarketplaceTemplates,
  listMarketplaceTemplates,
  marketplaceCategories,
} from '@/lib/template-marketplace';
import type { IndustryTemplate } from '@/lib/industry-templates';

function TemplateSwatch({ template }: { template: IndustryTemplate }) {
  const fg = template.style.fgColor ?? '#000000';
  const bg = template.style.bgColor ?? '#ffffff';
  return (
    <div
      className="h-10 w-10 shrink-0 rounded-lg border shadow-inner"
      style={{ background: `linear-gradient(135deg, ${bg} 50%, ${fg} 50%)` }}
      aria-hidden
    />
  );
}

function MarketplaceCard({ template }: { template: IndustryTemplate }) {
  const { t } = useLanguage();
  const name = resolveTemplateName(t, template.id, template.name);
  const tagline = resolveTemplateTagline(t, template.id, template.tagline);
  const useCases = resolveTemplateUseCases(t, template.id, template.useCases);
  const href = createUrlForTemplate(template.id);

  return (
    <article
      className="group flex flex-col rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
      data-testid={`marketplace-template-${template.id}`}
    >
      <div className="flex items-start gap-3">
        <TemplateSwatch template={template} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-base font-semibold">{name}</h2>
            <Badge variant="outline" className="text-[10px]">
              {categoryShortName(template.category)}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{tagline}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {useCases.slice(0, 3).map((u) => (
          <Badge key={u} variant="secondary" className="text-[10px] font-normal">
            {u}
          </Badge>
        ))}
      </div>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary"
      >
        {t('templateMarketplace.useTemplate')} <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}

export function TemplateMarketplaceGrid() {
  const { t } = useLanguage();
  const templates = listMarketplaceTemplates();
  const categories = marketplaceCategories(templates);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const matchesSearch = (template: IndustryTemplate) =>
    [
      resolveTemplateName(t, template.id, template.name),
      resolveTemplateTagline(t, template.id, template.tagline),
      template.id,
    ].join(' ');

  const filtered = useMemo(
    () => filterMarketplaceTemplates(templates, { query, category, matchesSearch }),
    [templates, query, category, t],
  );

  const featured = useMemo(
    () =>
      FEATURED_TEMPLATE_IDS.map((id) => templates.find((tpl) => tpl.id === id)).filter(
        (tpl): tpl is IndustryTemplate => Boolean(tpl),
      ),
    [templates],
  );

  return (
    <div className="space-y-10" data-testid="template-marketplace">
      <section>
        <h2 className="font-display text-lg font-semibold flex items-center gap-2">
          <LayoutTemplate className="h-5 w-5 text-primary" />
          {t('templateMarketplace.featuredTitle')}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((template) => (
            <MarketplaceCard key={template.id} template={template} />
          ))}
        </div>
      </section>

      <section>
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
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => (
            <MarketplaceCard key={template.id} template={template} />
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
