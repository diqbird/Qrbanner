import type { Locale } from '@/lib/i18n/types';
import { translate } from '@/lib/i18n';
import { getSolutionBySlug } from '@/lib/solutions';
import { localizeSolutionPage } from '@/lib/i18n/solution-localize';
import { getTemplateById } from '@/lib/industry-templates';
import { getUseCaseBySlug } from '@/lib/use-case-pages';
import { localizeUseCasePage } from '@/lib/i18n/resolve-programmatic-copy';

export type BlogRelatedTarget = {
  solutionSlug?: string;
  templateId?: string;
  useCaseSlugs?: string[];
};

/**
 * Static blog slug → solution / template / use-case deep links.
 * Slugs are locale-stable; do not match on localized category/keywords.
 */
export const BLOG_RELATED_LINKS: Record<string, BlogRelatedTarget> = {
  'restaurant-menu-qr-codes': { solutionSlug: 'restaurant-menu', templateId: 'restaurant-menu' },
  'wifi-qr-codes-guide': { solutionSlug: 'wifi-guest', templateId: 'wifi-guest' },
  'retail-qr-codes-in-store-marketing': { solutionSlug: 'retail-stores', templateId: 'retail-stores' },
  'hotel-hospitality-qr-codes-guide': {
    solutionSlug: 'hotels-hospitality',
    templateId: 'hotels-hospitality',
  },
  'whatsapp-ordering-qr-codes': { solutionSlug: 'restaurant-menu', templateId: 'whatsapp-order' },
  'google-review-qr-codes': { solutionSlug: 'retail-stores', templateId: 'google-review' },
  'healthcare-clinic-qr-codes-guide': {
    solutionSlug: 'healthcare-clinics',
    templateId: 'healthcare-clinics',
  },
  'stadium-event-qr-codes': { solutionSlug: 'stadium-events', templateId: 'event-registration' },
  'museum-venues-qr-codes-exhibits': { solutionSlug: 'museums-venues', templateId: 'museums-venues' },
  'museums-venues-qr-codes-exhibits': { solutionSlug: 'museums-venues', templateId: 'museums-venues' },
  'government-public-service-qr-codes': { solutionSlug: 'government-public-sector' },
  'university-campus-qr-codes': { solutionSlug: 'university-campus' },
  'university-campus-wayfinding-qr': { solutionSlug: 'university-campus' },
  'marketing-agency-qr-white-label-guide': { solutionSlug: 'marketing-agencies' },
  'agency-qr-affiliate-marketing': { solutionSlug: 'marketing-agencies' },
  'real-estate-open-house-qr-codes': { solutionSlug: 'real-estate', templateId: 'real-estate' },
  'supermarket-loyalty-qr-codes': { solutionSlug: 'supermarket-grocery' },
  'cinema-qr-codes-ticketing': { solutionSlug: 'cinema-theaters' },
  'logistics-warehouse-qr-codes': { solutionSlug: 'logistics-warehouses' },
  'logistics-warehouse-qr-tracking': { solutionSlug: 'logistics-warehouses' },
  'automotive-dealership-qr-codes': { solutionSlug: 'automotive-dealerships' },
  'fitness-gym-qr-codes-guide': { solutionSlug: 'fitness-gyms', templateId: 'fitness-gyms' },
  'salon-spa-qr-codes': { solutionSlug: 'salon-spa', templateId: 'salon-spa' },
  'nonprofit-fundraising-qr-codes': {
    solutionSlug: 'nonprofit-fundraising',
    templateId: 'nonprofit-fundraising',
  },
  'nonprofit-gala-fundraising-qr': {
    solutionSlug: 'nonprofit-fundraising',
    templateId: 'nonprofit-fundraising',
  },
  'brewery-taproom-qr-codes': { solutionSlug: 'brewery-beverage' },
  'insurance-agency-qr-codes': { solutionSlug: 'insurance-agencies' },
  'property-management-tenant-qr': { solutionSlug: 'property-management' },
  'dental-practice-qr-codes': { solutionSlug: 'dental-clinics', templateId: 'dental-clinics' },
  'veterinary-clinic-qr': { solutionSlug: 'veterinary-clinics' },
  'law-firm-qr-codes': { solutionSlug: 'law-firms' },
  'accounting-firm-qr': { solutionSlug: 'accounting-firms' },
  'optometry-practice-qr': { solutionSlug: 'optometry-eye-care' },
  'childcare-enrollment-qr': { solutionSlug: 'childcare-centers' },
  'home-services-contractor-qr': { solutionSlug: 'home-services', templateId: 'home-services' },
  'senior-living-facility-qr': { solutionSlug: 'senior-living' },
  'pet-grooming-salon-qr': { solutionSlug: 'pet-grooming' },
  'coworking-space-qr': { solutionSlug: 'coworking-spaces' },
  'farmers-market-qr': { solutionSlug: 'farmers-markets' },
  'wine-tasting-room-qr': { solutionSlug: 'wine-tasting' },
  'marina-harbor-qr': { solutionSlug: 'marina-boating' },
  'recruitment-hiring-qr': { solutionSlug: 'recruitment-staffing' },
  'trade-show-booth-qr': { solutionSlug: 'trade-shows-expos' },
  'coffee-shop-loyalty-qr': { solutionSlug: 'coffee-shops-cafes', templateId: 'coffee-shops-cafes' },
  'tourist-attraction-qr': { solutionSlug: 'tourist-attractions', templateId: 'tourist-attractions' },
  'florist-gift-shop-qr': { solutionSlug: 'florists-gift-shops' },
  'bakery-pastry-qr': { solutionSlug: 'bakery-pastry' },
  'car-wash-detailing-qr': { solutionSlug: 'car-wash-detailing' },
  'food-trucks-qr': { solutionSlug: 'food-trucks' },
  'landscaping-lawn-care-qr': { solutionSlug: 'landscaping-lawn-care' },
  'print-shop-qr-banner-export': { solutionSlug: 'printing-copy-shops' },
  'pharmacy-retail-qr-codes': { solutionSlug: 'retail-stores', templateId: 'retail-stores' },
  'civic-engagement-qr-codes': { solutionSlug: 'government-public-sector' },
  'manufacturing-qr-codes': { solutionSlug: 'logistics-warehouses' },
};

export function getBlogRelatedExtraLinks(
  slug: string,
  locale: Locale
): { href: string; label: string }[] {
  const target = BLOG_RELATED_LINKS[slug];
  if (!target) return [];

  const links: { href: string; label: string }[] = [];
  const seen = new Set<string>();

  const push = (href: string, label: string) => {
    if (seen.has(href)) return;
    seen.add(href);
    links.push({ href, label });
  };

  if (target.solutionSlug) {
    const solution = getSolutionBySlug(target.solutionSlug);
    if (solution) {
      const localized = localizeSolutionPage(solution, locale);
      push(
        `/solutions/${localized.slug}`,
        `${translate(locale, 'blogPost.relatedSolution')}: ${localized.title}`
      );
    }
  }

  if (target.templateId) {
    const template = getTemplateById(target.templateId);
    if (template) {
      // Prefer distinct label when solution already linked with same industry name
      const label = `${translate(locale, 'blogPost.relatedTemplate')}: ${template.name}`;
      push(`/templates/${template.id}`, label);
    }
  }

  for (const useCaseSlug of target.useCaseSlugs ?? []) {
    const useCase = getUseCaseBySlug(useCaseSlug);
    if (!useCase) continue;
    const localized = localizeUseCasePage(useCase, locale);
    push(`/use-cases/${localized.slug}`, localized.title);
  }

  return links;
}
