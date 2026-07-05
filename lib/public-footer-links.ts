import { supportMailto, whatsappUrl } from '@/lib/site-contact';
import { FOOTER_USE_CASE_SLUGS, getUseCaseBySlug } from '@/lib/use-case-pages';
import { localizeUseCasePage } from '@/lib/i18n/resolve-programmatic-copy';
import type { Locale } from '@/lib/i18n/types';

type Translate = (key: string) => string;

export type FooterLink = {
  href: string;
  label: string;
  external?: boolean;
};

export type FooterSection = {
  title: string;
  links: FooterLink[];
};

export function buildPublicFooterSections(
  t: Translate,
  locale: Locale,
): FooterSection[] {
  const guideLinks = FOOTER_USE_CASE_SLUGS.map((slug) => {
    const page = getUseCaseBySlug(slug);
    if (!page) return null;
    const localized = localizeUseCasePage(page, locale);
    return { href: `/use-cases/${localized.slug}`, label: localized.title };
  }).filter(Boolean) as FooterLink[];

  return [
    {
      title: t('footer.product'),
      links: [
        { href: '/features', label: t('nav.features') },
        { href: '/solutions', label: t('nav.solutions') },
        { href: '/templates', label: t('nav.templates') },
        { href: '/qr-types', label: t('nav.qrTypes') },
        { href: '/use-cases', label: t('nav.useCases') },
        { href: '/geo', label: t('geoSeo.breadcrumb') },
        { href: '/vs', label: t('nav.comparisons') },
        { href: '/integrations', label: t('nav.integrations') },
        { href: '/apps', label: t('nav.mobileApps') },
        { href: '/integrations/zapier', label: t('nav.zapier') },
        { href: '/pricing', label: t('nav.pricing') },
        { href: '/roi-calculator', label: t('nav.roiCalculator') },
        { href: '/faq', label: t('nav.faq') },
        { href: '/help', label: t('nav.help') },
        { href: '/blog', label: t('nav.blog') },
        { href: '/qr/create?quick=1', label: t('nav.createQr') },
        { href: '/developers', label: t('footer.apiWebhooks') },
      ],
    },
    {
      title: t('footer.guides'),
      links: [
        { href: '/use-cases', label: t('nav.useCases') },
        { href: '/qr-types', label: t('nav.qrTypes') },
        ...guideLinks,
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { href: '/about', label: t('footer.about') },
        { href: '/customers', label: t('nav.customers') },
        { href: '/case-studies', label: t('nav.caseStudies') },
        { href: '/reviews', label: t('nav.reviews') },
        { href: '/referral', label: t('nav.referral') },
        { href: '/affiliates', label: t('nav.affiliates') },
        { href: '/enterprise', label: t('nav.enterprise') },
        { href: '/contact', label: t('footer.contact') },
        { href: '/demo', label: t('nav.demo') },
        { href: '/security', label: t('nav.security') },
      ],
    },
    {
      title: t('footer.legal'),
      links: [
        { href: '/privacy', label: t('footer.privacy') },
        { href: '/terms', label: t('footer.terms') },
        { href: '/refund', label: t('footer.refund') },
        { href: '/cookies', label: t('footer.cookies') },
      ],
    },
    {
      title: t('footer.support'),
      links: [
        { href: supportMailto(), label: t('footer.emailSupport'), external: true },
        ...(whatsappUrl()
          ? [{ href: whatsappUrl(), label: t('contactPage.whatsappTitle'), external: true as const }]
          : []),
        { href: '/help', label: t('nav.help') },
        { href: '/faq', label: t('nav.helpFaq') },
      ],
    },
    {
      title: t('footer.account'),
      links: [
        { href: '/signup', label: t('footer.getStarted') },
        { href: '/login', label: t('common.signIn') },
      ],
    },
  ];
}
