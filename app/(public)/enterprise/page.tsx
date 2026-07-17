import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Building2, Shield, Headphones, FileDown } from 'lucide-react';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { PremiumShell } from '@/components/landing/premium/primitives';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';
import { marketingCountVars } from '@/lib/i18n/qr-type-count';
import { SalesInquiryForm } from '@/components/marketing/sales-inquiry-form';
import { demoBookingUrl } from '@/lib/site-contact';

export const revalidate = 3600;

const FEATURE_KEYS = [
  'enterprise.feature1',
  'enterprise.feature2',
  'enterprise.feature3',
  'enterprise.feature4',
  'enterprise.feature5',
  'enterprise.feature6',
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('enterprise.metaTitle'),
    description: t('enterprise.metaDescription'),
    path: '/enterprise',
    keywords: ['enterprise QR code', 'QR API enterprise', 'white label QR platform', 'bulk QR enterprise'],
  });
}

export default async function EnterprisePage() {
  const locale = await getServerLocale();
  const counts = marketingCountVars(locale);
  const t = (key: string, vars?: Record<string, string | number>) =>
    translate(locale, key, { ...counts, ...vars });

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('enterprise.title'),
          description: t('enterprise.subtitle'),
          path: '/enterprise',
          locale,
        })}
      />
      <PremiumShell>
        <div className="ph-container pb-16 pt-6 sm:pb-24 sm:pt-8">
          <div className="mx-auto max-w-5xl">
            <PublicBreadcrumbs items={[{ label: t('nav.enterprise'), href: '/enterprise' }]} />
            <header className="relative max-w-3xl">
              <div className="pointer-events-none absolute -left-8 -top-8 -z-10 h-40 w-72 rounded-full bg-[#2563EB]/15 blur-[70px] dark:bg-[#2563EB]/25" aria-hidden />
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB]/10 text-[#2563EB] dark:bg-sky-400/15 dark:text-sky-400">
                <Building2 className="h-6 w-6" aria-hidden />
              </span>
              <p className="ph-eyebrow mb-3">{t('nav.enterprise')}</p>
              <h1 className="ph-title text-3xl leading-[1.1] sm:text-5xl">{t('enterprise.title')}</h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('enterprise.subtitle')}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#contact-sales" className="ph-btn-primary">
                  {t('enterprise.ctaSales')} <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <a href={demoBookingUrl()} className="ph-btn-secondary">
                  {t('nav.bookDemo')}
                </a>
              </div>
            </header>

            <section className="mt-16 grid gap-5 sm:grid-cols-3">
              {[
                { icon: Shield, title: t('enterprise.pillar1Title'), desc: t('enterprise.pillar1Desc') },
                { icon: Building2, title: t('enterprise.pillar2Title'), desc: t('enterprise.pillar2Desc') },
                { icon: Headphones, title: t('enterprise.pillar3Title'), desc: t('enterprise.pillar3Desc') },
              ].map((item) => (
                <div key={item.title} className="ph-card p-6 hover:translate-y-0 hover:scale-100">
                  <item.icon className="mb-3 h-6 w-6 text-[#2563EB] dark:text-sky-400" aria-hidden />
                  <h2 className="ph-title text-base">{item.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </section>

            <section className="ph-card mt-16 p-6 hover:translate-y-0 hover:scale-100 sm:p-8">
              <h2 className="ph-title text-2xl">{t('enterprise.ssoSectionTitle')}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t('enterprise.ssoSectionDesc')}</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {t('enterprise.ssoItems')
                  .split('|')
                  .map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2563EB] dark:text-sky-400" aria-hidden />
                      {item}
                    </li>
                  ))}
              </ul>
              <Link
                href={localizePath('/downloads/enterprise-overview', locale)}
                className="ph-btn-secondary mt-6"
              >
                <FileDown className="h-4 w-4" aria-hidden />
                {t('enterprise.downloadOverview')}
              </Link>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/settings?tab=saml" className="ph-btn-secondary">
                  {t('enterprise.ssoSelfServeCta')} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link href={localizePath('/trust/procurement-request', locale)} className="ph-btn-secondary">
                  {t('enterprise.procurementCta')} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </section>

            <section className="ph-card mt-16 p-6 hover:translate-y-0 hover:scale-100">
              <h2 className="ph-title text-lg">{t('securityPage.liveLinksTitle')}</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  { href: '/trust', label: t('securityPage.liveTrust') },
                  { href: '/trust/soc2-readiness', label: t('trustPage.linkSoc2Readiness') },
                  { href: '/trust/hipaa-readiness', label: t('trustPage.linkHipaaReadiness') },
                  { href: '/security', label: t('status.relatedSecurity') },
                  { href: '/status', label: t('securityPage.liveStatus') },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={localizePath(link.href, locale)}
                      className="font-medium text-[#2563EB] hover:underline dark:text-sky-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-16">
              <h2 className="ph-title text-2xl">{t('enterprise.includesTitle')}</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {FEATURE_KEYS.map((key) => (
                  <li key={key} className="flex gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#2563EB] dark:text-sky-400" aria-hidden />
                    {t(key)}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted-foreground">
                {t('enterprise.agencyNote')}{' '}
                <Link
                  href={localizePath('/pricing', locale)}
                  className="text-[#2563EB] hover:underline dark:text-sky-400"
                >
                  {t('nav.pricing')}
                </Link>
              </p>
            </section>

            <section
              id="contact-sales"
              className="ph-card mt-16 scroll-mt-24 p-6 hover:translate-y-0 hover:scale-100 sm:p-10"
              aria-labelledby="enterprise-form-heading"
            >
              <h2 id="enterprise-form-heading" className="ph-title text-2xl">
                {t('enterprise.formTitle')}
              </h2>
              <p className="mt-2 text-muted-foreground">{t('enterprise.formSubtitle')}</p>
              <div className="mt-8">
                <SalesInquiryForm type="enterprise" />
              </div>
            </section>
          </div>
        </div>
      </PremiumShell>
    </>
  );
}
