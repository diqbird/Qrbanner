import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { Handshake, Megaphone, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';

const BENEFIT_KEYS = [
  'affiliates.benefit1',
  'affiliates.benefit2',
  'affiliates.benefit3',
  'affiliates.benefit4',
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    title: t('affiliates.metaTitle'),
    description: t('affiliates.metaDescription'),
    path: '/affiliates',
    keywords: ['QR code affiliate', 'QR agency partner', 'white label QR reseller', 'QRbanner partner'],
  });
}

export default async function AffiliatesPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('affiliates.title'),
          description: t('affiliates.subtitle'),
          path: '/affiliates',
        })}
      />
      <PublicBreadcrumbs items={[{ label: t('affiliates.title'), href: '/affiliates' }]} />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <header className="max-w-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Handshake className="h-6 w-6 text-primary" aria-hidden />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t('affiliates.title')}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('affiliates.subtitle')}</p>
          </header>

          <section className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Megaphone, title: t('affiliates.pillar1Title'), desc: t('affiliates.pillar1Desc') },
              { icon: Building2, title: t('affiliates.pillar2Title'), desc: t('affiliates.pillar2Desc') },
              { icon: Handshake, title: t('affiliates.pillar3Title'), desc: t('affiliates.pillar3Desc') },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                <item.icon className="mb-3 h-6 w-6 text-primary" aria-hidden />
                <h2 className="font-display font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </section>

          <section className="mt-16">
            <h2 className="font-display text-xl font-semibold">{t('affiliates.includesTitle')}</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {BENEFIT_KEYS.map((key) => (
                <li key={key} className="flex gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                  {t(key)}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16 rounded-2xl border border-border/50 bg-muted/20 p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold">{t('affiliates.caseStudiesBandTitle')}</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t('affiliates.caseStudiesBandDesc')}</p>
            <Link href="/case-studies" className="mt-4 inline-block">
              <Button variant="outline" className="gap-2">
                {t('affiliates.caseStudiesBandCta')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </section>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Link href="/referral">
              <Button size="lg" className="gap-2 rounded-full">
                {t('affiliates.ctaReferral')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/enterprise">
              <Button size="lg" variant="outline" className="rounded-full">
                {t('affiliates.ctaEnterprise')}
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="ghost" className="rounded-full">
                {t('nav.pricing')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
