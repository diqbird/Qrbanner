import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Building2, Shield, Headphones, FileDown } from 'lucide-react';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
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
        })}
      />
      <PublicBreadcrumbs items={[{ label: t('nav.enterprise'), href: '/enterprise' }]} />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <header className="max-w-3xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" aria-hidden />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">{t('enterprise.title')}</h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{t('enterprise.subtitle')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#contact-sales">
                <Button size="lg" className="gap-2 rounded-full">
                  {t('enterprise.ctaSales')} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={demoBookingUrl()}>
                <Button size="lg" variant="outline" className="rounded-full">
                  {t('nav.bookDemo')}
                </Button>
              </Link>
            </div>
          </header>

          <section className="mt-16 grid gap-6 sm:grid-cols-3">
            {[
              { icon: Shield, title: t('enterprise.pillar1Title'), desc: t('enterprise.pillar1Desc') },
              { icon: Building2, title: t('enterprise.pillar2Title'), desc: t('enterprise.pillar2Desc') },
              { icon: Headphones, title: t('enterprise.pillar3Title'), desc: t('enterprise.pillar3Desc') },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                <item.icon className="mb-3 h-6 w-6 text-primary" aria-hidden />
                <h2 className="font-display font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </section>

          <section className="mt-16 rounded-2xl border border-border/50 bg-muted/30 p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold">{t('enterprise.ssoSectionTitle')}</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t('enterprise.ssoSectionDesc')}</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {t('enterprise.ssoItems').split('|').map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/downloads/enterprise-overview" className="mt-6 inline-flex">
              <Button variant="outline" className="gap-2">
                <FileDown className="h-4 w-4" aria-hidden />
                {t('enterprise.downloadOverview')}
              </Button>
            </Link>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/settings?tab=saml">
                <Button variant="secondary" className="gap-2 rounded-full">
                  {t('enterprise.ssoSelfServeCta')} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/trust/procurement-request">
                <Button variant="outline" className="gap-2 rounded-full">
                  {t('enterprise.procurementCta')} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>

          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold">{t('enterprise.includesTitle')}</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {FEATURE_KEYS.map((key) => (
                <li key={key} className="flex gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  {t(key)}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              {t('enterprise.agencyNote')}{' '}
              <Link href="/pricing" className="text-primary hover:underline">
                {t('nav.pricing')}
              </Link>
            </p>
          </section>

          <section id="contact-sales" className="mt-16 scroll-mt-24 rounded-2xl border border-border/50 bg-card p-6 sm:p-10">
            <h2 className="font-display text-2xl font-bold">{t('enterprise.formTitle')}</h2>
            <p className="mt-2 text-muted-foreground">{t('enterprise.formSubtitle')}</p>
            <div className="mt-8">
              <SalesInquiryForm type="enterprise" />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
