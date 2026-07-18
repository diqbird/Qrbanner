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
  'restaurant-menu-qr-codes': {
    solutionSlug: 'restaurant-menu',
    templateId: 'restaurant-menu',
    useCaseSlugs: ['restaurant-table-tents', 'feedback-surveys'],
  },
  'wifi-qr-codes-guide': {
    solutionSlug: 'wifi-guest',
    templateId: 'wifi-guest',
    useCaseSlugs: ['hotel-guest-experience'],
  },
  'retail-qr-codes-in-store-marketing': {
    solutionSlug: 'retail-stores',
    templateId: 'retail-stores',
    useCaseSlugs: ['retail-loyalty', 'print-advertising'],
  },
  'hotel-hospitality-qr-codes-guide': {
    solutionSlug: 'hotels-hospitality',
    templateId: 'hotels-hospitality',
    useCaseSlugs: ['hotel-guest-experience', 'feedback-surveys'],
  },
  'whatsapp-ordering-qr-codes': {
    solutionSlug: 'restaurant-menu',
    templateId: 'whatsapp-order',
    useCaseSlugs: ['whatsapp-support'],
  },
  'google-review-qr-codes': {
    solutionSlug: 'retail-stores',
    templateId: 'google-review',
    useCaseSlugs: ['feedback-surveys'],
  },
  'healthcare-clinic-qr-codes-guide': {
    solutionSlug: 'healthcare-clinics',
    templateId: 'healthcare-clinics',
    useCaseSlugs: ['healthcare-patient-info'],
  },
  'stadium-event-qr-codes': {
    solutionSlug: 'stadium-events',
    templateId: 'event-registration',
    useCaseSlugs: ['event-check-in'],
  },
  'museum-venues-qr-codes-exhibits': {
    solutionSlug: 'museums-venues',
    templateId: 'museums-venues',
    useCaseSlugs: ['museum-exhibits'],
  },
  'museums-venues-qr-codes-exhibits': {
    solutionSlug: 'museums-venues',
    templateId: 'museums-venues',
    useCaseSlugs: ['museum-exhibits'],
  },
  'government-public-service-qr-codes': {
    solutionSlug: 'government-public-sector',
    useCaseSlugs: ['feedback-surveys'],
  },
  'university-campus-qr-codes': {
    solutionSlug: 'university-campus',
    useCaseSlugs: ['education-campus'],
  },
  'university-campus-wayfinding-qr': {
    solutionSlug: 'university-campus',
    useCaseSlugs: ['education-campus'],
  },
  'marketing-agency-qr-white-label-guide': {
    solutionSlug: 'marketing-agencies',
    useCaseSlugs: ['print-advertising'],
  },
  'agency-qr-affiliate-marketing': {
    solutionSlug: 'marketing-agencies',
    useCaseSlugs: ['social-media-growth'],
  },
  'real-estate-open-house-qr-codes': {
    solutionSlug: 'real-estate',
    templateId: 'real-estate',
    useCaseSlugs: ['real-estate-listings'],
  },
  'supermarket-loyalty-qr-codes': {
    solutionSlug: 'supermarket-grocery',
    useCaseSlugs: ['retail-loyalty', 'product-packaging'],
  },
  'cinema-qr-codes-ticketing': {
    solutionSlug: 'cinema-theaters',
    useCaseSlugs: ['event-check-in'],
  },
  'logistics-warehouse-qr-codes': {
    solutionSlug: 'logistics-warehouses',
    useCaseSlugs: ['logistics-tracking'],
  },
  'logistics-warehouse-qr-tracking': {
    solutionSlug: 'logistics-warehouses',
    useCaseSlugs: ['logistics-tracking'],
  },
  'automotive-dealership-qr-codes': {
    solutionSlug: 'automotive-dealerships',
    useCaseSlugs: ['feedback-surveys'],
  },
  'fitness-gym-qr-codes-guide': {
    solutionSlug: 'fitness-gyms',
    templateId: 'fitness-gyms',
    useCaseSlugs: ['app-download-campaign'],
  },
  'salon-spa-qr-codes': {
    solutionSlug: 'salon-spa',
    templateId: 'salon-spa',
    useCaseSlugs: ['feedback-surveys'],
  },
  'nonprofit-fundraising-qr-codes': {
    solutionSlug: 'nonprofit-fundraising',
    templateId: 'nonprofit-fundraising',
    useCaseSlugs: ['nonprofit-donations'],
  },
  'nonprofit-gala-fundraising-qr': {
    solutionSlug: 'nonprofit-fundraising',
    templateId: 'nonprofit-fundraising',
    useCaseSlugs: ['nonprofit-donations', 'event-check-in'],
  },
  'brewery-taproom-qr-codes': {
    solutionSlug: 'brewery-beverage',
    useCaseSlugs: ['restaurant-table-tents'],
  },
  'insurance-agency-qr-codes': {
    solutionSlug: 'insurance-agencies',
    useCaseSlugs: ['email-signature'],
  },
  'property-management-tenant-qr': {
    solutionSlug: 'property-management',
    useCaseSlugs: ['feedback-surveys'],
  },
  'dental-practice-qr-codes': {
    solutionSlug: 'dental-clinics',
    templateId: 'dental-clinics',
    useCaseSlugs: ['healthcare-patient-info'],
  },
  'veterinary-clinic-qr': {
    solutionSlug: 'veterinary-clinics',
    useCaseSlugs: ['healthcare-patient-info'],
  },
  'law-firm-qr-codes': { solutionSlug: 'law-firms', useCaseSlugs: ['email-signature'] },
  'accounting-firm-qr': { solutionSlug: 'accounting-firms', useCaseSlugs: ['email-signature'] },
  'optometry-practice-qr': {
    solutionSlug: 'optometry-eye-care',
    useCaseSlugs: ['healthcare-patient-info'],
  },
  'childcare-enrollment-qr': {
    solutionSlug: 'childcare-centers',
    useCaseSlugs: ['education-campus'],
  },
  'home-services-contractor-qr': {
    solutionSlug: 'home-services',
    templateId: 'home-services',
    useCaseSlugs: ['feedback-surveys'],
  },
  'senior-living-facility-qr': {
    solutionSlug: 'senior-living',
    useCaseSlugs: ['healthcare-patient-info'],
  },
  'pet-grooming-salon-qr': { solutionSlug: 'pet-grooming', useCaseSlugs: ['feedback-surveys'] },
  'coworking-space-qr': {
    solutionSlug: 'coworking-spaces',
    useCaseSlugs: ['hotel-guest-experience'],
  },
  'farmers-market-qr': { solutionSlug: 'farmers-markets', useCaseSlugs: ['product-packaging'] },
  'wine-tasting-room-qr': { solutionSlug: 'wine-tasting', useCaseSlugs: ['product-packaging'] },
  'marina-harbor-qr': { solutionSlug: 'marina-boating', useCaseSlugs: ['feedback-surveys'] },
  'recruitment-hiring-qr': {
    solutionSlug: 'recruitment-staffing',
    useCaseSlugs: ['employee-onboarding'],
  },
  'trade-show-booth-qr': {
    solutionSlug: 'trade-shows-expos',
    useCaseSlugs: ['trade-show-leads'],
  },
  'coffee-shop-loyalty-qr': {
    solutionSlug: 'coffee-shops-cafes',
    templateId: 'coffee-shops-cafes',
    useCaseSlugs: ['retail-loyalty'],
  },
  'tourist-attraction-qr': {
    solutionSlug: 'tourist-attractions',
    templateId: 'tourist-attractions',
    useCaseSlugs: ['museum-exhibits'],
  },
  'florist-gift-shop-qr': {
    solutionSlug: 'florists-gift-shops',
    useCaseSlugs: ['product-packaging'],
  },
  'bakery-pastry-qr': { solutionSlug: 'bakery-pastry', useCaseSlugs: ['retail-loyalty'] },
  'car-wash-detailing-qr': {
    solutionSlug: 'car-wash-detailing',
    useCaseSlugs: ['retail-loyalty'],
  },
  'food-trucks-qr': { solutionSlug: 'food-trucks', useCaseSlugs: ['social-media-growth'] },
  'landscaping-lawn-care-qr': {
    solutionSlug: 'landscaping-lawn-care',
    useCaseSlugs: ['feedback-surveys'],
  },
  'print-shop-qr-banner-export': {
    solutionSlug: 'printing-copy-shops',
    useCaseSlugs: ['print-advertising'],
  },
  'pharmacy-retail-qr-codes': {
    solutionSlug: 'retail-stores',
    templateId: 'retail-stores',
    useCaseSlugs: ['healthcare-patient-info', 'retail-loyalty'],
  },
  'civic-engagement-qr-codes': {
    solutionSlug: 'government-public-sector',
    useCaseSlugs: ['feedback-surveys'],
  },
  'manufacturing-qr-codes': {
    solutionSlug: 'logistics-warehouses',
    useCaseSlugs: ['logistics-tracking', 'product-packaging'],
  },
  // Generic guides — scenario deep links only
  'dynamic-qr-codes-complete-guide': {
    useCaseSlugs: ['print-advertising', 'product-packaging'],
  },
  'qr-code-analytics-guide': { useCaseSlugs: ['feedback-surveys', 'print-advertising'] },
  'dynamic-vs-static-qr-codes': { useCaseSlugs: ['print-advertising'] },
  'bulk-qr-codes-csv-import': { useCaseSlugs: ['product-packaging', 'logistics-tracking'] },
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
    push(
      `/use-cases/${localized.slug}`,
      `${translate(locale, 'blogPost.relatedUseCase')}: ${localized.title}`
    );
  }

  return links;
}
