import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { PremiumShell } from '@/components/landing/premium/primitives';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';
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
  {
    href: '/trust/soc2-readiness',
    title: 'trustPage.linkSoc2Readiness',
    desc: 'trustPage.linkSoc2ReadinessDesc',
  },
  {
    href: '/trust/hipaa-readiness',
    title: 'trustPage.linkHipaaReadiness',
    desc: 'trustPage.linkHipaaReadinessDesc',
  },
  {
    href: '/trust/procurement-request',
    title: 'trustPage.linkProcurement',
    desc: 'trustPage.linkProcurementDesc',
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
          locale,
        })}
      />
      <PremiumShell>
        <div className="ph-container pb-16 pt-6 sm:pb-24 sm:pt-8">
          <article className="mx-auto max-w-3xl space-y-10">
            <PublicBreadcrumbs items={[{ label: t('nav.trust'), href: '/trust' }]} />
            <header className="relative">
              <div className="pointer-events-none absolute -left-8 -top-8 -z-10 h-40 w-72 rounded-full bg-[#2563EB]/15 blur-[70px] dark:bg-[#2563EB]/25" aria-hidden />
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB]/10 text-[#2563EB] dark:bg-sky-400/15 dark:text-sky-400">
                <ShieldCheck className="h-6 w-6" aria-hidden />
              </span>
              <p className="ph-eyebrow mb-3">{t('nav.trust')}</p>
              <h1 className="ph-title text-3xl leading-[1.1] sm:text-4xl">{t('trustPage.title')}</h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('trustPage.subtitle')}</p>
            </header>

            <section className="ph-card space-y-3 p-5 hover:translate-y-0 hover:scale-100">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="ph-title text-lg">{t('trustPage.complianceTitle')}</h2>
                <span className="rounded-full border border-border/60 bg-background/80 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('trustPage.complianceBadge')}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{t('trustPage.complianceBody')}</p>
              <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                <li>{t('trustPage.soc2Step1')}</li>
                <li>{t('trustPage.soc2Step2')}</li>
                <li>{t('trustPage.soc2Step3')}</li>
                <li>{t('trustPage.soc2Step4')}</li>
              </ol>
              <p className="text-xs text-muted-foreground">{t('trustPage.soc2Disclaimer')}</p>
              <div className="flex flex-wrap gap-4">
                {[
                  { href: '/trust/soc2-readiness', label: t('trustPage.linkSoc2Readiness') },
                  { href: '/trust/hipaa-readiness', label: t('trustPage.linkHipaaReadiness') },
                  { href: '/trust/procurement-request', label: t('trustPage.linkProcurement') },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={localizePath(link.href, locale)}
                    className="inline-flex text-sm font-medium text-[#2563EB] hover:underline dark:text-sky-400"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </section>

            <section className="ph-card space-y-2 p-5 hover:translate-y-0 hover:scale-100">
              <h2 className="ph-title text-lg">{t('trustPage.supportTitle')}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{t('trustPage.supportBody')}</p>
            </section>

            <section className="grid gap-3 sm:grid-cols-2">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={localizePath(link.href, locale)}
                  className="ph-card p-5"
                >
                  <p className="ph-title text-base">{t(link.title)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t(link.desc)}</p>
                </Link>
              ))}
            </section>
          </article>
        </div>
      </PremiumShell>
    </>
  );
}
