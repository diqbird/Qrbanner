import type { Metadata } from 'next';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('privacyPage.metaTitle'),
    description: t('privacyPage.metaDescription'),
    path: '/privacy',
  });
}

const COLLECT_ITEMS = [
  { label: 'privacyPage.collectAccountLabel', body: 'privacyPage.collectAccountBody' },
  { label: 'privacyPage.collectQrLabel', body: 'privacyPage.collectQrBody' },
  { label: 'privacyPage.collectScanLabel', body: 'privacyPage.collectScanBody' },
  { label: 'privacyPage.collectLeadLabel', body: 'privacyPage.collectLeadBody' },
  { label: 'privacyPage.collectTeamLabel', body: 'privacyPage.collectTeamBody' },
  { label: 'privacyPage.collectLogsLabel', body: 'privacyPage.collectLogsBody' },
] as const;

export default async function PrivacyPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('privacyPage.title'),
          description: t('privacyPage.metaDescription'),
          path: '/privacy',
        })}
      />
      <PublicBreadcrumbs items={[{ label: t('privacyPage.title'), href: '/privacy' }]} />
      <div className="py-10 sm:py-16">
        <article className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 text-sm leading-relaxed text-muted-foreground">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">{t('privacyPage.title')}</h1>
            <p className="mt-2">{t('privacyPage.lastUpdated')}</p>
          </div>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{t('privacyPage.overviewTitle')}</h2>
            <p>{t('privacyPage.overviewBody')}</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{t('privacyPage.collectTitle')}</h2>
            <ul className="list-disc space-y-2 pl-5">
              {COLLECT_ITEMS.map((item) => (
                <li key={item.label}>
                  <strong className="text-foreground">{t(item.label)}</strong> {t(item.body)}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{t('privacyPage.useTitle')}</h2>
            <p>{t('privacyPage.useBody')}</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{t('privacyPage.pixelsTitle')}</h2>
            <p>{t('privacyPage.pixelsBody')}</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{t('privacyPage.contactTitle')}</h2>
            <p>
              <a href="mailto:privacy@qrbanner.com" className="text-primary hover:underline">
                privacy@qrbanner.com
              </a>
            </p>
          </section>
        </article>
      </div>
    </>
  );
}
