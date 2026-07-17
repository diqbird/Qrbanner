import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { PremiumPageFrame } from '@/components/landing/premium/page-frame';
import { JsonLd } from '@/components/seo/json-ld';
import { PRIVACY_EMAIL } from '@/lib/site-contact';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('cookiesPage.metaTitle'),
    description: t('cookiesPage.metaDescription'),
    path: '/cookies',
  });
}

export default async function CookiesPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('cookiesPage.title'),
          description: t('cookiesPage.metaDescription'),
          path: '/cookies',
          locale,
        })}
      />
      <PremiumPageFrame narrow="3xl">
        <PublicBreadcrumbs items={[{ label: t('cookiesPage.title'), href: '/cookies' }]} />
        <article className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">{t('cookiesPage.title')}</h1>
            <p className="mt-2">{t('cookiesPage.lastUpdated')}</p>
          </div>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{t('cookiesPage.whatTitle')}</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-foreground">{t('cookiesPage.essentialLabel')}</strong>{' '}
                {t('cookiesPage.essentialBody')}
              </li>
              <li>
                <strong className="text-foreground">{t('cookiesPage.preferencesLabel')}</strong>{' '}
                {t('cookiesPage.preferencesBody')}
              </li>
              <li>
                <strong className="text-foreground">{t('cookiesPage.analyticsLabel')}</strong>{' '}
                {t('cookiesPage.analyticsBody')}
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{t('cookiesPage.choicesTitle')}</h2>
            <p>{t('cookiesPage.choicesBody')}</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{t('cookiesPage.moreTitle')}</h2>
            <p>
              {t('cookiesPage.moreBefore')}{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                {t('cookiesPage.privacyLink')}
              </Link>{' '}
              {t('cookiesPage.moreAfter')}{' '}
              <a href={`mailto:${PRIVACY_EMAIL}`} className="text-primary hover:underline">
                {PRIVACY_EMAIL}
              </a>
            </p>
          </section>
        </article>
      </PremiumPageFrame>
    </>
  );
}
