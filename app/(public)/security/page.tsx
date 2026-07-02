import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { SUPPORT_EMAIL, supportMailto } from '@/lib/site-contact';
import { Shield } from 'lucide-react';

export const revalidate = 3600;

const SECTIONS = [
  {
    title: 'securityPage.infraTitle',
    items: ['securityPage.infra1', 'securityPage.infra2', 'securityPage.infra3'],
  },
  {
    title: 'securityPage.dataTitle',
    items: ['securityPage.data1', 'securityPage.data2', 'securityPage.data3', 'securityPage.data4'],
  },
  {
    title: 'securityPage.accountTitle',
    items: [
      'securityPage.account1',
      'securityPage.account2',
      'securityPage.account3',
      'securityPage.account4',
      'securityPage.account5',
    ],
  },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    title: t('securityPage.metaTitle'),
    description: t('securityPage.metaDescription'),
    path: '/security',
  });
}

export default async function SecurityPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('securityPage.title'),
          description: t('securityPage.subtitle'),
          path: '/security',
        })}
      />
      <PublicBreadcrumbs items={[{ label: t('nav.security'), href: '/security' }]} />
      <div className="py-10 sm:py-16">
        <article className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6">
          <header>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Shield className="h-6 w-6 text-primary" aria-hidden />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t('securityPage.title')}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('securityPage.subtitle')}</p>
          </header>

          {SECTIONS.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="font-display text-xl font-semibold">{t(section.title)}</h2>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground leading-relaxed">
                {section.items.map((key) => (
                  <li key={key}>{t(key)}</li>
                ))}
              </ul>
            </section>
          ))}

          <p className="text-sm text-muted-foreground">
            {t('securityPage.contact')}{' '}
            <Link href={supportMailto('QRbanner Security')} className="text-primary hover:underline">
              {SUPPORT_EMAIL}
            </Link>
          </p>
        </article>
      </div>
    </>
  );
}
