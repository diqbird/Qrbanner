import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { SUPPORT_EMAIL, supportMailto } from '@/lib/site-contact';

export const revalidate = 3600;

const SECTIONS = [
  { title: 'dpaPage.scopeTitle', body: 'dpaPage.scopeBody' },
  { title: 'dpaPage.rolesTitle', body: 'dpaPage.rolesBody' },
  { title: 'dpaPage.processingTitle', body: 'dpaPage.processingBody' },
  { title: 'dpaPage.securityTitle', body: 'dpaPage.securityBody' },
  { title: 'dpaPage.requestsTitle', body: 'dpaPage.requestsBody' },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('dpaPage.metaTitle'),
    description: t('dpaPage.metaDescription'),
    path: '/dpa',
  });
}

export default async function DpaPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('dpaPage.title'),
          description: t('dpaPage.subtitle'),
          path: '/dpa',
          locale,
        })}
      />
      <PublicBreadcrumbs
        items={[
          { label: t('nav.trust'), href: '/trust' },
          { label: t('nav.dpa'), href: '/dpa' },
        ]}
      />
      <div className="py-10 sm:py-16">
        <article className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
          <header>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {t('dpaPage.title')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('dpaPage.subtitle')}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t('dpaPage.lastUpdated')}</p>
          </header>

          {SECTIONS.map((section) => (
            <section key={section.title} className="space-y-2">
              <h2 className="font-display text-xl font-semibold">{t(section.title)}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(section.body)}</p>
            </section>
          ))}

          <p className="text-sm text-muted-foreground">
            {t('dpaPage.contact')}{' '}
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
