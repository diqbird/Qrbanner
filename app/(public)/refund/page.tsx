import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { refundPolicyVars } from '@/lib/i18n/policy-day-vars';
import { SUPPORT_EMAIL, supportMailto } from '@/lib/site-contact';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('refundPage.metaTitle'),
    description: t('refundPage.metaDescription'),
    path: '/refund',
  });
}

export default async function RefundPage() {
  const locale = await getServerLocale();
  const dayVars = refundPolicyVars(locale);
  const t = (key: string) => translate(locale, key, dayVars);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('refundPage.title'),
          description: t('refundPage.metaDescription'),
          path: '/refund',
          locale,
        })}
      />
      <PublicBreadcrumbs items={[{ label: t('refundPage.title'), href: '/refund' }]} />
      <div className="py-10 sm:py-16">
        <article className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 text-sm leading-relaxed text-muted-foreground">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">{t('refundPage.title')}</h1>
            <p className="mt-2">{t('refundPage.lastUpdated')}</p>
          </div>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{t('refundPage.overviewTitle')}</h2>
            <p>{t('refundPage.overviewBody')}</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{t('refundPage.windowTitle')}</h2>
            <p>{t('refundPage.windowBody')}</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{t('refundPage.eligibilityTitle')}</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>{t('refundPage.eligibility1')}</li>
              <li>{t('refundPage.eligibility2')}</li>
              <li>{t('refundPage.eligibility3')}</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{t('refundPage.nonRefundableTitle')}</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>{t('refundPage.nonRefundable1')}</li>
              <li>{t('refundPage.nonRefundable2')}</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{t('refundPage.howToTitle')}</h2>
            <p>
              {t('refundPage.howToBefore')}{' '}
              <a href={supportMailto('Refund request')} className="text-primary hover:underline">
                {SUPPORT_EMAIL}
              </a>{' '}
              {t('refundPage.howToAfter')}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{t('refundPage.cancelTitle')}</h2>
            <p>
              {t('refundPage.cancelBefore')}{' '}
              <Link href="/pricing" className="text-primary hover:underline">
                {t('refundPage.pricingLink')}
              </Link>{' '}
              {t('refundPage.cancelAfter')}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{t('refundPage.merchantTitle')}</h2>
            <p>{t('refundPage.merchantBody')}</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{t('refundPage.contactTitle')}</h2>
            <p>
              <a href={supportMailto()} className="text-primary hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </p>
          </section>
        </article>
      </div>
    </>
  );
}
