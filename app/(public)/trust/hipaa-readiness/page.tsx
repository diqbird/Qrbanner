import type { Metadata } from 'next';
import Link from 'next/link';
import { HeartPulse } from 'lucide-react';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { PremiumPageFrame } from '@/components/landing/premium/page-frame';
import { JsonLd } from '@/components/seo/json-ld';
import { Badge } from '@/components/ui/badge';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export const revalidate = 3600;

const EVIDENCE_ROWS = [
  { area: 'hipaaReadiness.rowTransport', evidence: 'hipaaReadiness.evTransport' },
  { area: 'hipaaReadiness.rowAccess', evidence: 'hipaaReadiness.evAccess' },
  { area: 'hipaaReadiness.rowCreds', evidence: 'hipaaReadiness.evCreds' },
  { area: 'hipaaReadiness.rowConfidentiality', evidence: 'hipaaReadiness.evConfidentiality' },
  { area: 'hipaaReadiness.rowPrivacy', evidence: 'hipaaReadiness.evPrivacy' },
  { area: 'hipaaReadiness.rowProcurement', evidence: 'hipaaReadiness.evProcurement' },
  { area: 'hipaaReadiness.rowPhi', evidence: 'hipaaReadiness.evPhi' },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('hipaaReadiness.metaTitle'),
    description: t('hipaaReadiness.metaDescription'),
    path: '/trust/hipaa-readiness',
  });
}

export default async function HipaaReadinessPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('hipaaReadiness.title'),
          description: t('hipaaReadiness.subtitle'),
          path: '/trust/hipaa-readiness',
          locale,
        })}
      />
      <PremiumPageFrame narrow="3xl">
        <PublicBreadcrumbs
        items={[
        { label: t('nav.trust'), href: '/trust' },
        { label: t('hipaaReadiness.breadcrumb'), href: '/trust/hipaa-readiness' },
        ]}
        />
        <article className="space-y-8">
          <header>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <HeartPulse className="h-6 w-6 text-primary" aria-hidden />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {t('hipaaReadiness.title')}
              </h1>
              <Badge variant="outline">{t('trustPage.complianceBadge')}</Badge>
            </div>
            <p className="mt-4 text-lg text-muted-foreground">{t('hipaaReadiness.subtitle')}</p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {t('hipaaReadiness.notCert')}
            </p>
          </header>

          <section className="surface-3d overflow-x-auto rounded-2xl border border-white/30 bg-card/80 p-5 backdrop-blur-md dark:border-white/10">
            <h2 className="font-display text-lg font-semibold">{t('hipaaReadiness.tableTitle')}</h2>
            <table className="mt-4 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/50 text-xs text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">{t('hipaaReadiness.colArea')}</th>
                  <th className="py-2 font-medium">{t('hipaaReadiness.colEvidence')}</th>
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
              {t('hipaaReadiness.roadmapTitle')}
            </h2>
            <ol className="list-decimal space-y-2 pl-5">
              <li>{t('hipaaReadiness.step1')}</li>
              <li>{t('hipaaReadiness.step2')}</li>
              <li>{t('hipaaReadiness.step3')}</li>
              <li>{t('hipaaReadiness.step4')}</li>
            </ol>
            <p className="text-xs">{t('hipaaReadiness.disclaimer')}</p>
          </section>

          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/trust/soc2-readiness" className="font-medium text-primary hover:underline">
              {t('trustPage.linkSoc2Readiness')}
            </Link>
            <Link href="/security" className="font-medium text-primary hover:underline">
              {t('trustPage.linkSecurity')}
            </Link>
            <Link href="/trust/procurement-request" className="font-medium text-primary hover:underline">
              {t('trustPage.linkProcurement')}
            </Link>
          </div>
        </article>
      </PremiumPageFrame>
    </>
  );
}
