import { INDUSTRY_TEMPLATES, type IndustryTemplate } from '@/lib/industry-templates';

export const FEATURED_TEMPLATE_IDS = [
  'restaurant-menu',
  'business-card',
  'wifi-guest',
  'hotels-hospitality',
  'event-registration',
  'portfolio',
] as const;

export function listMarketplaceTemplates(): IndustryTemplate[] {
  return INDUSTRY_TEMPLATES;
}

export function marketplaceCategories(templates: IndustryTemplate[] = INDUSTRY_TEMPLATES): string[] {
  return Array.from(new Set(templates.map((t) => t.category))).sort();
}

export function filterMarketplaceTemplates(
  templates: IndustryTemplate[],
  options: { query?: string; category?: string; matchesSearch?: (template: IndustryTemplate) => string },
): IndustryTemplate[] {
  let list = templates;
  const category = options.category ?? 'all';
  if (category !== 'all') {
    list = list.filter((t) => t.category === category);
  }
  const q = (options.query ?? '').trim().toLowerCase();
  if (q && options.matchesSearch) {
    list = list.filter((t) => options.matchesSearch!(t).toLowerCase().includes(q));
  }
  return list;
}

export function createUrlForTemplate(templateId: string): string {
  return `/qr/create?template=${encodeURIComponent(templateId)}`;
}
