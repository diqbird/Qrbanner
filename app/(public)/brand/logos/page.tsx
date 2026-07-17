import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata, webPageJsonLd, brandLogoImageObjectsJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';
import { CUSTOMER_LOGOS } from '@/lib/customer-logos';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('brandLogos.metaTitle'),
    description: t('brandLogos.metaDescription'),
    path: '/brand/logos',
  });
}

export default async function BrandLogosGuidePage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  const logoItems = CUSTOMER_LOGOS.map((logo) => ({
    name: `${logo.label} industry logo`,
    path: logo.imageSrc ?? `/logos/${logo.id}.svg`,
    description: `${logo.label} wordmark used on the QRbanner homepage industry strip`,
  }));

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            title: t('brandLogos.title'),
            description: t('brandLogos.subtitle'),
            path: '/brand/logos',
            locale,
          }),
          brandLogoImageObjectsJsonLd(logoItems),
        ]}
      />
      <PublicBreadcrumbs items={[{ label: t('brandLogos.title'), href: '/brand/logos' }]} />
      <div className="py-10 sm:py-16">
        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t('brandLogos.title')}
          </h1>
          <p className="mt-4 text-muted-foreground">{t('brandLogos.subtitle')}</p>

          <ol className="mt-10 list-decimal space-y-4 pl-5 text-sm text-muted-foreground leading-relaxed">
            {(
              ['brandLogos.step1', 'brandLogos.step2', 'brandLogos.step3', 'brandLogos.step4'] as const
            ).map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ol>

          <section className="mt-12">
            <h2 className="font-display text-lg font-semibold">{t('brandLogos.currentTitle')}</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {CUSTOMER_LOGOS.map((logo) => (
                <li
                  key={logo.id}
                  className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2 font-mono text-xs"
                >
                  public/logos/{logo.id}.svg — {logo.label}
                </li>
              ))}
            </ul>
          </section>

          <p className="mt-10 text-sm text-muted-foreground">
            <Link href={localizePath('/contact', locale)} className="text-primary hover:underline">
              {t('brandLogos.contact')}
            </Link>
          </p>
        </article>
      </div>
    </>
  );
}
