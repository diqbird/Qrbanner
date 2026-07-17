import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { PremiumPageFrame } from '@/components/landing/premium/page-frame';
import { JsonLd } from '@/components/seo/json-ld';
import { LEGAL_EMAIL } from '@/lib/site-contact';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('termsPage.metaTitle'),
    description: t('termsPage.metaDescription'),
    path: '/terms',
  });
}

export default async function TermsPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('termsPage.title'),
          description: t('termsPage.metaDescription'),
          path: '/terms',
          locale,
        })}
      />
      <PremiumPageFrame narrow="3xl">
        <PublicBreadcrumbs items={[{ label: t('termsPage.title'), href: '/terms' }]} />
        <article className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">{t('termsPage.title')}</h1>
            <p className="mt-2">{t('termsPage.lastUpdated')}</p>
          </div>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{t('termsPage.agreementTitle')}</h2>
            <p>{t('termsPage.agreementBody')}</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{t('termsPage.contentTitle')}</h2>
            <p>{t('termsPage.contentBody')}</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{t('termsPage.billingTitle')}</h2>
            <p>
              {t('termsPage.billingBefore')}{' '}
              <Link href="/pricing" className="text-primary hover:underline">
                {t('termsPage.pricingLink')}
              </Link>{' '}
              {t('termsPage.billingAfter')}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{t('termsPage.cancelTitle')}</h2>
            <p>
              {t('termsPage.cancelBefore')}{' '}
              <Link href="/pricing" className="text-primary hover:underline">
                {t('termsPage.pricingLink')}
              </Link>{' '}
              {t('termsPage.cancelAfter')}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{t('termsPage.contactTitle')}</h2>
            <p>
              <a href={`mailto:${LEGAL_EMAIL}`} className="text-primary hover:underline">
                {LEGAL_EMAIL}
              </a>
            </p>
          </section>
        </article>
      </PremiumPageFrame>
    </>
  );
}
