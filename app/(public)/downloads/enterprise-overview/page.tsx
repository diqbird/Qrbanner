import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { SUPPORT_EMAIL } from '@/lib/site-contact';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { localizeEnterpriseOverviewItem } from '@/lib/i18n/api-rate-limits';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('enterpriseOverview.metaTitle'),
    description: t('enterpriseOverview.metaDescription'),
    path: '/downloads/enterprise-overview',
  });
}

const SECTIONS = [
  { title: 'enterpriseOverview.ssoTitle', items: 'enterpriseOverview.ssoItems' },
  { title: 'enterpriseOverview.securityTitle', items: 'enterpriseOverview.securityItems' },
  { title: 'enterpriseOverview.slaTitle', items: 'enterpriseOverview.slaItems' },
  { title: 'enterpriseOverview.procurementTitle', items: 'enterpriseOverview.procurementItems' },
] as const;

export default async function EnterpriseOverviewPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <PublicBreadcrumbs
        items={[
          { label: t('nav.enterprise'), href: '/enterprise' },
          { label: t('enterpriseOverview.title'), href: '/downloads/enterprise-overview' },
        ]}
      />
      <div className="py-10 sm:py-16 print:py-6">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 print:max-w-none print:px-8">
          <header className="border-b border-border pb-8 print:pb-4">
            <p className="text-sm font-medium text-primary">QRbanner</p>
            <h1 className="mt-2 font-display text-3xl font-bold">{t('enterpriseOverview.title')}</h1>
            <p className="mt-3 text-muted-foreground">{t('enterpriseOverview.subtitle')}</p>
            <p className="mt-4 hidden text-sm text-muted-foreground print:block">
              {t('enterpriseOverview.printHint')}
            </p>
          </header>

          {SECTIONS.map((section) => {
            const items = t(section.items).split('|');
            return (
              <section key={section.title} className="mt-10 print:mt-6">
                <h2 className="font-display text-xl font-semibold">{t(section.title)}</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground leading-relaxed">
                  {items.map((item) => (
                    <li key={item}>{localizeEnterpriseOverviewItem(item, locale)}</li>
                  ))}
                </ul>
              </section>
            );
          })}

          <footer className="mt-12 border-t border-border pt-8 text-sm text-muted-foreground print:mt-8">
            <p>
              {t('enterpriseOverview.contact')}{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary">
                {SUPPORT_EMAIL}
              </a>
            </p>
            <p className="mt-4 print:hidden">
              <Link href="/enterprise#contact-sales" className="text-primary hover:underline">
                {t('enterprise.ctaSales')}
              </Link>
            </p>
          </footer>
        </article>
      </div>
    </>
  );
}
