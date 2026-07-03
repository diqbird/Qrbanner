'use client';

import Link from 'next/link';
import { SiteLogo } from '@/components/brand/site-logo';
import { Mail } from 'lucide-react';
import { SUPPORT_EMAIL, supportMailto, whatsappUrl } from '@/lib/site-contact';
import { FOOTER_USE_CASE_SLUGS, getUseCaseBySlug } from '@/lib/use-case-pages';
import { localizeUseCasePage } from '@/lib/i18n/resolve-programmatic-copy';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLocalePath } from '@/components/i18n/use-locale-path';

export function PublicFooter() {
  const { t, locale } = useLanguage();
  const localePath = useLocalePath();

  const guideLinks = FOOTER_USE_CASE_SLUGS.map((slug) => {
    const page = getUseCaseBySlug(slug);
    if (!page) return null;
    const localized = localizeUseCasePage(page, locale);
    return { href: `/use-cases/${localized.slug}`, label: localized.title };
  }).filter(Boolean) as { href: string; label: string }[];

  const sections = [
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

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Link href={localePath('/')} className="inline-block">
              <SiteLogo layout="stacked" className="items-start" nameClassName="text-lg" />
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {t('footer.tagline')}
            </p>
            <a
              href={supportMailto()}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <Mail className="h-4 w-4" />
              {SUPPORT_EMAIL}
            </a>
          </div>
          <div className="grid min-w-0 flex-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
            {sections.map((section) => (
              <nav key={section.title} aria-label={section.title} className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{section.title}</p>
                <ul className="mt-3 space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href} className="min-w-0">
                      {'external' in link && link.external ? (
                        <a
                          href={link.href}
                          target={link.href.startsWith('http') ? '_blank' : undefined}
                          rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="py-1 text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5 break-words"
                        >
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={localePath(link.href)}
                          className="inline-block py-1 text-sm text-muted-foreground hover:text-foreground transition-colors break-words"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <p className="mt-8 border-t border-border/40 pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} QRbanner. {t('footer.rights')} · {t('footer.questions')}{' '}
          <a href={supportMailto()} className="text-primary underline underline-offset-2 hover:no-underline">
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>
    </footer>
  );
}
