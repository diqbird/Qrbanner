import { INDUSTRY_TEMPLATES, type IndustryTemplate } from '@/lib/industry-templates';

export const FEATURED_TEMPLATE_IDS = [
  'restaurant-menu',
  'whatsapp-order',
  'google-review',
  'business-card',
  'wifi-guest',
  'event-registration',
] as const;

export function listMarketplaceTemplates(): IndustryTemplate[] {
  return INDUSTRY_TEMPLATES;
}

/** Total industry templates available in the create wizard / marketplace. */
export const MARKETPLACE_TEMPLATE_COUNT = INDUSTRY_TEMPLATES.length;

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
