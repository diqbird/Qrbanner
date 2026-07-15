import type { Metadata } from 'next';
import Link from 'next/link';
import { ClipboardList } from 'lucide-react';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { Badge } from '@/components/ui/badge';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export const revalidate = 3600;

const EVIDENCE_ROWS = [
  { area: 'soc2Readiness.rowAccess', evidence: 'soc2Readiness.evAccess' },
  { area: 'soc2Readiness.rowCreds', evidence: 'soc2Readiness.evCreds' },
  { area: 'soc2Readiness.rowTransport', evidence: 'soc2Readiness.evTransport' },
  { area: 'soc2Readiness.rowWebhooks', evidence: 'soc2Readiness.evWebhooks' },
  { area: 'soc2Readiness.rowAvailability', evidence: 'soc2Readiness.evAvailability' },
  { area: 'soc2Readiness.rowConfidentiality', evidence: 'soc2Readiness.evConfidentiality' },
  { area: 'soc2Readiness.rowPrivacy', evidence: 'soc2Readiness.evPrivacy' },
  { area: 'soc2Readiness.rowBilling', evidence: 'soc2Readiness.evBilling' },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('soc2Readiness.metaTitle'),
    description: t('soc2Readiness.metaDescription'),
    path: '/trust/soc2-readiness',
  });
}

export default async function Soc2ReadinessPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('soc2Readiness.title'),
          description: t('soc2Readiness.subtitle'),
          path: '/trust/soc2-readiness',
        })}
      />
      <PublicBreadcrumbs
        items={[
          { label: t('nav.trust'), href: '/trust' },
          { label: t('soc2Readiness.breadcrumb'), href: '/trust/soc2-readiness' },
        ]}
      />
      <div className="py-10 sm:py-16">
        <article className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
          <header>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <ClipboardList className="h-6 w-6 text-primary" aria-hidden />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {t('soc2Readiness.title')}
              </h1>
              <Badge variant="outline">{t('trustPage.complianceBadge')}</Badge>
            </div>
            <p className="mt-4 text-lg text-muted-foreground">{t('soc2Readiness.subtitle')}</p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {t('soc2Readiness.notCert')}
            </p>
          </header>

          <section className="surface-3d overflow-x-auto rounded-2xl border border-white/30 bg-card/80 p-5 backdrop-blur-md dark:border-white/10">
            <h2 className="font-display text-lg font-semibold">{t('soc2Readiness.tableTitle')}</h2>
            <table className="mt-4 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/50 text-xs text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">{t('soc2Readiness.colArea')}</th>
                  <th className="py-2 font-medium">{t('soc2Readiness.colEvidence')}</th>
                </tr>
              </thead>
              <tbody>
                {EVIDENCE_ROWS.map((row) => (
                  <tr key={row.area} className="border-b border-border/30 align-top">
                    <td className="py-3 pr-4 font-medium">{t(row.area)}</td>
                    <td className="py-3 text-muted-foreground leading-relaxed">{t(row.evidence)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <h2 className="font-display text-lg font-semibold text-foreground">
              {t('soc2Readiness.roadmapTitle')}
            </h2>
            <ol className="list-decimal space-y-2 pl-5">
              <li>{t('trustPage.soc2Step1')}</li>
              <li>{t('trustPage.soc2Step2')}</li>
              <li>{t('trustPage.soc2Step3')}</li>
              <li>{t('trustPage.soc2Step4')}</li>
            </ol>
            <p className="text-xs">{t('trustPage.soc2Disclaimer')}</p>
          </section>

          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/security" className="font-medium text-primary hover:underline">
              {t('trustPage.linkSecurity')}
            </Link>
            <Link href="/status" className="font-medium text-primary hover:underline">
              {t('trustPage.linkStatus')}
            </Link>
            <Link href="/trust/procurement-request" className="font-medium text-primary hover:underline">
              {t('trustPage.linkProcurement')}
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
