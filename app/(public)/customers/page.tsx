import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { PremiumPageFrame } from '@/components/landing/premium/page-frame';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';
import { localizeCaseStudyView } from '@/lib/i18n/case-study-localize';
import { CASE_STUDIES } from '@/lib/case-studies';
import { CUSTOMER_LOGOS } from '@/lib/customer-logos';
import {
  Utensils,
  Store,
  CalendarDays,
  Building2,
  GraduationCap,
  Truck,
  ArrowRight,
} from 'lucide-react';

const INDUSTRY_ICONS = [Utensils, CalendarDays, Store, Building2, GraduationCap, Truck];
const INDUSTRY_KEYS = [
  'socialProof.industryRestaurant',
  'socialProof.industryEvents',
  'socialProof.industryRetail',
  'socialProof.industryHospitality',
  'customers.industryEducation',
  'customers.industryLogistics',
] as const;

const CASE_KEYS = [
  { title: 'customers.case1Title', desc: 'customers.case1Desc' },
  { title: 'customers.case2Title', desc: 'customers.case2Desc' },
  { title: 'customers.case3Title', desc: 'customers.case3Desc' },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('customers.metaTitle'),
    description: t('customers.metaDescription'),
    path: '/customers',
  });
}

export default async function CustomersPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('customers.title'),
          description: t('customers.subtitle'),
          path: '/customers',
          locale,
        })}
      />
      <PremiumPageFrame narrow="5xl">
        <PublicBreadcrumbs items={[{ label: t('nav.customers'), href: '/customers' }]} />
        <header className="relative max-w-2xl">
          <div className="pointer-events-none absolute -left-8 -top-8 -z-10 h-40 w-72 rounded-full bg-[#2563EB]/15 blur-[70px] dark:bg-[#2563EB]/25" aria-hidden />
          <p className="ph-eyebrow mb-4">{t('nav.customers')}</p>
          <h1 className="ph-title text-3xl leading-[1.1] sm:text-4xl">{t('customers.title')}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('customers.subtitle')}</p>
        </header>

        <section className="mt-12" aria-label={t('customerLogos.sectionLabel')}>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t('customers.logosTitle')}
          </p>
          <p className="mx-auto mt-2 max-w-xl text-center text-[11px] text-muted-foreground">
            {t('customerLogos.disclaimer')}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {CUSTOMER_LOGOS.map((logo) => (
              <div
                key={logo.id}
                className="ph-card flex h-11 min-w-[7.5rem] items-center justify-center px-4 hover:translate-y-0 hover:scale-100"
              >
                {logo.imageSrc ? (
                  <Image
                    src={logo.imageSrc}
                    alt={logo.label}
                    width={100}
                    height={28}
                    className="h-7 w-auto max-w-[6.5rem] object-contain opacity-85 grayscale"
                  />
                ) : (
                  <span className="font-display text-sm font-semibold tracking-tight text-muted-foreground">
                    {logo.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="ph-title text-xl">{t('customers.industriesTitle')}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRY_KEYS.map((key, i) => {
              const Icon = INDUSTRY_ICONS[i];
              return (
                <div key={key} className="ph-card flex flex-col items-center p-6 text-center hover:translate-y-0 hover:scale-100">
                  <Icon className="mb-3 h-8 w-8 text-[#2563EB] dark:text-sky-400" aria-hidden />
                  <p className="font-medium">{t(key)}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="ph-title text-xl">{t('customers.caseTitle')}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {CASE_KEYS.map((item) => (
              <article key={item.title} className="ph-card p-6 hover:translate-y-0 hover:scale-100">
                <h3 className="ph-title text-base">{t(item.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(item.desc)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="ph-title text-xl">{t('customers.caseStudiesTitle')}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t('customers.caseStudiesSubtitle')}</p>
            </div>
            <Link href={localizePath('/case-studies', locale)} className="ph-btn-secondary">
              {t('customers.viewAllCaseStudies')} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CASE_STUDIES.slice(0, 9).map((study) => {
              const view = localizeCaseStudyView(study, locale);
              return (
                <Link
                  key={study.slug}
                  href={localizePath(`/case-studies/${study.slug}`, locale)}
                  className="ph-card p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563EB] dark:text-sky-400">
                    {view.industry}
                  </p>
                  <h3 className="ph-title mt-2 text-base leading-snug">{view.headline}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{view.companyType}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link href="/signup" className="ph-btn-primary">
            {t('customers.cta')}
          </Link>
          <Link href={localizePath('/demo', locale)} className="ph-btn-secondary">
            {t('customers.ctaTour')}
          </Link>
        </div>
      </PremiumPageFrame>
    </>
  );
}
