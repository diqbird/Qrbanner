'use client';

import { useMemo, useState } from 'react';
import { useLanguage } from '@/components/i18n/language-provider';
import {
  resolveTemplateName,
  resolveTemplateTagline,
} from '@/lib/i18n/resolve-template-copy';
import {
  FEATURED_TEMPLATE_IDS,
  filterMarketplaceTemplates,
  listMarketplaceTemplates,
  marketplaceCategories,
} from '@/lib/template-marketplace';
import type { IndustryTemplate } from '@/lib/industry-templates';

export function useTemplateMarketplace() {
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

  return {
    t,
    templates,
    categories,
    query,
    setQuery,
    category,
    setCategory,
    filtered,
    featured,
  };
}

export type TemplateMarketplaceState = ReturnType<typeof useTemplateMarketplace>;
