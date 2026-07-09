import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { ShieldCheck } from 'lucide-react';

export const revalidate = 3600;

const LINKS = [
  { href: '/security', title: 'trustPage.linkSecurity', desc: 'trustPage.linkSecurityDesc' },
  { href: '/status', title: 'trustPage.linkStatus', desc: 'trustPage.linkStatusDesc' },
  { href: '/enterprise', title: 'trustPage.linkEnterprise', desc: 'trustPage.linkEnterpriseDesc' },
  {
    href: '/downloads/enterprise-overview',
    title: 'trustPage.linkOverview',
    desc: 'trustPage.linkOverviewDesc',
  },
  { href: '/privacy', title: 'trustPage.linkPrivacy', desc: 'trustPage.linkPrivacyDesc' },
  { href: '/dpa', title: 'trustPage.linkDpa', desc: 'trustPage.linkDpaDesc' },
  {
    href: '/sub-processors',
    title: 'trustPage.linkSubprocessors',
    desc: 'trustPage.linkSubprocessorsDesc',
  },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('trustPage.metaTitle'),
    description: t('trustPage.metaDescription'),
    path: '/trust',
  });
}

export default async function TrustPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('trustPage.title'),
          description: t('trustPage.subtitle'),
          path: '/trust',
        })}
      />
      <PublicBreadcrumbs items={[{ label: t('nav.trust'), href: '/trust' }]} />
      <div className="py-10 sm:py-16">
        <article className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6">
          <header>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" aria-hidden />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {t('trustPage.title')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('trustPage.subtitle')}</p>
          </header>

          <section className="rounded-xl border border-border/60 bg-muted/30 p-5 space-y-2">
            <h2 className="font-display text-lg font-semibold">{t('trustPage.complianceTitle')}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('trustPage.complianceBody')}
            </p>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-border/50 bg-card p-5 transition-colors hover:border-primary/40"
              >
                <p className="font-medium">{t(link.title)}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t(link.desc)}</p>
              </Link>
            ))}
          </section>
        </article>
      </div>
    </>
  );
}
