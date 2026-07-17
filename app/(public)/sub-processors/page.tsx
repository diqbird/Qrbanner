import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { SUPPORT_EMAIL, supportMailto } from '@/lib/site-contact';

export const revalidate = 3600;

const PROCESSORS = [
  { name: 'subprocessorsPage.p1Name', purpose: 'subprocessorsPage.p1Purpose', location: 'subprocessorsPage.p1Location' },
  { name: 'subprocessorsPage.p2Name', purpose: 'subprocessorsPage.p2Purpose', location: 'subprocessorsPage.p2Location' },
  { name: 'subprocessorsPage.p3Name', purpose: 'subprocessorsPage.p3Purpose', location: 'subprocessorsPage.p3Location' },
  { name: 'subprocessorsPage.p4Name', purpose: 'subprocessorsPage.p4Purpose', location: 'subprocessorsPage.p4Location' },
  { name: 'subprocessorsPage.p5Name', purpose: 'subprocessorsPage.p5Purpose', location: 'subprocessorsPage.p5Location' },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('subprocessorsPage.metaTitle'),
    description: t('subprocessorsPage.metaDescription'),
    path: '/sub-processors',
  });
}

export default async function SubProcessorsPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('subprocessorsPage.title'),
          description: t('subprocessorsPage.subtitle'),
          path: '/sub-processors',
          locale,
        })}
      />
      <PublicBreadcrumbs
        items={[
          { label: t('nav.trust'), href: '/trust' },
          { label: t('nav.subprocessors'), href: '/sub-processors' },
        ]}
      />
      <div className="py-10 sm:py-16">
        <article className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
          <header>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {t('subprocessorsPage.title')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('subprocessorsPage.subtitle')}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t('subprocessorsPage.lastUpdated')}</p>
          </header>

          <div className="overflow-x-auto rounded-xl border border-border/50">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">{t('subprocessorsPage.colName')}</th>
                  <th className="px-4 py-3 font-medium">{t('subprocessorsPage.colPurpose')}</th>
                  <th className="px-4 py-3 font-medium">{t('subprocessorsPage.colLocation')}</th>
                </tr>
              </thead>
              <tbody>
                {PROCESSORS.map((row) => (
                  <tr key={row.name} className="border-t border-border/40">
                    <td className="px-4 py-3 font-medium">{t(row.name)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t(row.purpose)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t(row.location)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('subprocessorsPage.notice')}
          </p>

          <p className="text-sm text-muted-foreground">
            {t('subprocessorsPage.contact')}{' '}
            <a className="text-primary hover:underline" href={supportMailto()}>
              {SUPPORT_EMAIL}
            </a>
            {' · '}
            <Link href="/trust" className="text-primary hover:underline">
              {t('nav.trust')}
            </Link>
          </p>
        </article>
      </div>
    </>
  );
}
