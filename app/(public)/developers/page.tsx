import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { PremiumShell } from '@/components/landing/premium/primitives';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';
import { DEVELOPER_RATE_LIMIT_PLAN_IDS, formatDeveloperRateLimitLine } from '@/lib/i18n/api-rate-limits';
import { WEBHOOK_VERIFY_NODE_EXAMPLE } from '@/lib/webhook-test-payload';
import { ArrowRight, Code2, FileJson, Key, Webhook, Gauge, UsersRound } from 'lucide-react';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('developersPage.metaTitle'),
    description: t('developersPage.metaDescription'),
    path: '/developers',
    keywords: ['QR code API', 'QR REST API', 'dynamic QR API', 'QRbanner API', 'QR automation', 'QR webhooks'],
  });
}

const ENDPOINT_KEYS = [
  { method: 'GET', path: '/api/v1/qr', descKey: 'developersPage.epListQr' },
  { method: 'POST', path: '/api/v1/qr', descKey: 'developersPage.epCreateQr' },
  { method: 'POST', path: '/api/v1/qr/bulk', descKey: 'developersPage.epBulkQr' },
  { method: 'GET', path: '/api/v1/qr/:id', descKey: 'developersPage.epGetQr' },
  { method: 'GET', path: '/api/v1/qr/:id/analytics', descKey: 'developersPage.epAnalyticsQr' },
  { method: 'PATCH', path: '/api/v1/qr/:id', descKey: 'developersPage.epUpdateQr' },
  { method: 'DELETE', path: '/api/v1/qr/:id', descKey: 'developersPage.epDeleteQr' },
  { method: 'GET', path: '/api/v1/folders', descKey: 'developersPage.epListFolders' },
  { method: 'POST', path: '/api/v1/folders', descKey: 'developersPage.epCreateFolder' },
  { method: 'GET', path: '/api/v1/folders/:id', descKey: 'developersPage.epGetFolder' },
  { method: 'PATCH', path: '/api/v1/folders/:id', descKey: 'developersPage.epUpdateFolder' },
  { method: 'DELETE', path: '/api/v1/folders/:id', descKey: 'developersPage.epDeleteFolder' },
] as const;

const MOBILE_ENDPOINT_KEYS = [
  { method: 'GET', path: '/api/mobile/v1/summary', descKey: 'developersPage.epMobileSummary' },
  { method: 'GET', path: '/api/mobile/v1/qr', descKey: 'developersPage.epMobileListQr' },
  { method: 'POST', path: '/api/mobile/v1/qr', descKey: 'developersPage.epMobileCreateQr' },
  { method: 'GET', path: '/api/mobile/v1/qr/:id', descKey: 'developersPage.epMobileGetQr' },
  { method: 'PATCH', path: '/api/mobile/v1/qr/:id', descKey: 'developersPage.epMobileUpdateQr' },
  { method: 'DELETE', path: '/api/mobile/v1/qr/:id', descKey: 'developersPage.epMobileDeleteQr' },
] as const;

const SCIM_ENDPOINT_KEYS = [
  { method: 'GET', path: '/api/scim/v2/Users', descKey: 'developersPage.scimEpListUsers' },
  { method: 'POST', path: '/api/scim/v2/Users', descKey: 'developersPage.scimEpCreateUser' },
  { method: 'GET', path: '/api/scim/v2/Users/:id', descKey: 'developersPage.scimEpGetUser' },
  { method: 'PATCH', path: '/api/scim/v2/Users/:id', descKey: 'developersPage.scimEpUpdateUser' },
  { method: 'PUT', path: '/api/scim/v2/Users/:id', descKey: 'developersPage.scimEpPutUser' },
  { method: 'DELETE', path: '/api/scim/v2/Users/:id', descKey: 'developersPage.scimEpDeleteUser' },
  { method: 'GET', path: '/api/scim/v2/Groups', descKey: 'developersPage.scimEpListGroups' },
  { method: 'POST', path: '/api/scim/v2/Groups', descKey: 'developersPage.scimEpCreateGroup' },
  { method: 'GET', path: '/api/scim/v2/Groups/:id', descKey: 'developersPage.scimEpGetGroup' },
  { method: 'PATCH', path: '/api/scim/v2/Groups/:id', descKey: 'developersPage.scimEpUpdateGroup' },
  { method: 'PUT', path: '/api/scim/v2/Groups/:id', descKey: 'developersPage.scimEpPutGroup' },
  { method: 'DELETE', path: '/api/scim/v2/Groups/:id', descKey: 'developersPage.scimEpDeleteGroup' },
  {
    method: 'GET',
    path: '/api/scim/v2/ServiceProviderConfig',
    descKey: 'developersPage.scimEpSpConfig',
  },
  { method: 'GET', path: '/api/scim/v2/ResourceTypes', descKey: 'developersPage.scimEpResourceTypes' },
  { method: 'GET', path: '/api/scim/v2/Schemas', descKey: 'developersPage.scimEpSchemas' },
] as const;

export default async function DevelopersPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('developersPage.title'),
          description: t('developersPage.subtitle'),
          path: '/developers',
          locale,
        })}
      />
      <PremiumShell>
        <div className="ph-container pb-16 pt-6 sm:pb-24 sm:pt-8">
          <PublicBreadcrumbs items={[{ label: t('nav.api'), href: '/developers' }]} />
          <header className="relative mx-auto max-w-2xl text-center">
            <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 flex justify-center" aria-hidden>
              <div className="h-40 w-72 rounded-full bg-[#2563EB]/15 blur-[70px] dark:bg-[#2563EB]/25" />
            </div>
            <p className="ph-eyebrow mb-4">{t('developersPage.badge')}</p>
            <h1 className="ph-title text-4xl leading-[1.1] sm:text-5xl">{t('developersPage.heroTitle')}</h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('developersPage.heroSubtitle')}</p>
          </header>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            <div className="ph-card p-6 hover:translate-y-0 hover:scale-100 lg:col-span-2">
              <h2 className="ph-title flex items-center gap-2 text-xl">
                <Code2 className="h-5 w-5 text-[#2563EB] dark:text-sky-400" aria-hidden />{' '}
                {t('developersPage.endpointsTitle')}
              </h2>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[480px] text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">{t('developersPage.methodHeader')}</th>
                      <th className="pb-3 pr-4 font-medium">{t('developersPage.pathHeader')}</th>
                      <th className="pb-3 font-medium">{t('developersPage.descHeader')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ENDPOINT_KEYS.map((ep) => (
                      <tr key={ep.path + ep.method} className="border-b border-border/40 last:border-0">
                        <td className="py-3 pr-4">
                          <Badge variant="outline" className="font-mono text-xs">
                            {ep.method}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 font-mono text-xs">{ep.path}</td>
                        <td className="py-3 text-muted-foreground">{t(ep.descKey)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6">
              <div className="ph-card p-6 hover:translate-y-0 hover:scale-100">
                <h2 className="ph-title flex items-center gap-2 text-base">
                  <Key className="h-4 w-4 text-[#2563EB] dark:text-sky-400" aria-hidden />{' '}
                  {t('developersPage.authTitle')}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t('developersPage.authBody')}</p>
                <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-3 text-xs">
                  {`Authorization: Bearer qb_live_...

# or

X-API-Key: qb_live_...`}
                </pre>
              </div>
              <div id="webhooks" className="ph-card scroll-mt-24 p-6 hover:translate-y-0 hover:scale-100">
                <h2 className="ph-title flex items-center gap-2 text-base">
                  <Webhook className="h-4 w-4 text-[#2563EB] dark:text-sky-400" aria-hidden />{' '}
                  {t('developersPage.webhooksTitle')}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t('developersPage.webhooksBody')}</p>
                <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-3 text-xs leading-relaxed">
                  {`{
  "event": "scan",
  "qr_code_id": "...",
  "qr_name": "Store Istanbul",
  "short_code": "abc12",
  "scan": {
    "country": "TR",
    "city": "Istanbul",
    "device": "mobile",
    "scanned_at": "2026-06-29T12:00:00.000Z"
  }
}`}
                </pre>
                <Link
                  href={localizePath('/integrations', locale)}
                  className="mt-4 inline-block text-sm text-[#2563EB] hover:underline dark:text-sky-400"
                >
                  {t('developersPage.integrationsLink')} →
                </Link>
                <h3 className="mt-6 font-display text-sm font-semibold">{t('developersPage.webhooksVerifyTitle')}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {t('developersPage.webhooksVerifyBody')}
                </p>
                <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-3 text-xs leading-relaxed">
                  {WEBHOOK_VERIFY_NODE_EXAMPLE}
                </pre>
              </div>
              <div className="ph-card p-6 hover:translate-y-0 hover:scale-100">
                <h2 className="ph-title flex items-center gap-2 text-base">
                  <FileJson className="h-4 w-4 text-[#2563EB] dark:text-sky-400" aria-hidden />{' '}
                  {t('developersPage.openapiTitle')}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t('developersPage.openapiBody')}</p>
                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href={localizePath('/developers/reference', locale)}
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:underline dark:text-sky-400"
                  >
                    {t('developersPage.openapiExplore')} →
                  </Link>
                  <Link
                    href="/api/openapi.json"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('developersPage.openapiLink')} →
                  </Link>
                </div>
              </div>
              <div className="ph-card p-6 hover:translate-y-0 hover:scale-100">
                <h2 className="ph-title flex items-center gap-2 text-base">
                  <Gauge className="h-4 w-4 text-[#2563EB] dark:text-sky-400" aria-hidden />{' '}
                  {t('developersPage.rateLimitsTitle')}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {t('developersPage.rateLimitsBody')}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {DEVELOPER_RATE_LIMIT_PLAN_IDS.map((planId) => (
                    <li key={planId}>{formatDeveloperRateLimitLine(planId, locale)}</li>
                  ))}
                </ul>
              </div>
              <div className="ph-card p-6 hover:translate-y-0 hover:scale-100">
                <h2 className="ph-title text-base">{t('developersPage.baseUrlTitle')}</h2>
                <p className="mt-3 font-mono text-sm">https://qrbanner.com</p>
              </div>
              <Link href="/signup" className="ph-btn-primary w-full">
                {t('developersPage.cta')} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>

          <section
            id="mobile-api"
            className="ph-card mt-16 scroll-mt-24 p-6 hover:translate-y-0 hover:scale-100 sm:p-8"
          >
            <h2 className="ph-title text-xl">{t('developersPage.mobileTitle')}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {t('developersPage.mobileBody')}
            </p>
            <p className="mt-2 text-sm">
              <Link
                href={localizePath('/apps', locale)}
                className="font-medium text-[#2563EB] hover:underline dark:text-sky-400"
              >
                {t('developersPage.mobileAppsLink')} →
              </Link>
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">{t('developersPage.methodHeader')}</th>
                    <th className="pb-2 pr-4 font-medium">{t('developersPage.pathHeader')}</th>
                    <th className="pb-2 font-medium">{t('developersPage.descHeader')}</th>
                  </tr>
                </thead>
                <tbody>
                  {MOBILE_ENDPOINT_KEYS.map((ep) => (
                    <tr key={ep.path + ep.method} className="border-b border-border/40 last:border-0">
                      <td className="py-3 pr-4">
                        <Badge variant="outline" className="font-mono text-xs">
                          {ep.method}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 font-mono text-xs">{ep.path}</td>
                      <td className="py-3 text-muted-foreground">{t(ep.descKey)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section
            id="scim"
            className="ph-card mt-16 scroll-mt-24 p-6 hover:translate-y-0 hover:scale-100 sm:p-8"
          >
            <h2 className="ph-title flex items-center gap-2 text-xl">
              <UsersRound className="h-5 w-5 text-[#2563EB] dark:text-sky-400" aria-hidden />{' '}
              {t('developersPage.scimTitle')}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {t('developersPage.scimBody')}
            </p>
            <Link
              href={localizePath('/developers/reference', locale)}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:underline dark:text-sky-400"
            >
              {t('developersPage.scimOpenapiExplore')} →
            </Link>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="font-display text-sm font-semibold">{t('developersPage.scimSetupTitle')}</h3>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground leading-relaxed">
                  <li>{t('developersPage.scimSetup1')}</li>
                  <li>{t('developersPage.scimSetup2')}</li>
                  <li>{t('developersPage.scimSetup3')}</li>
                  <li>{t('developersPage.scimSetup4')}</li>
                </ol>
                <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-3 text-xs leading-relaxed">
                  {`Base URL: https://qrbanner.com/api/scim/v2
Authorization: Bearer qrb_scim_...

# Roles ↔ virtual Groups: admin | editor | viewer`}
                </pre>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[360px] text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">{t('developersPage.methodHeader')}</th>
                      <th className="pb-3 pr-4 font-medium">{t('developersPage.pathHeader')}</th>
                      <th className="pb-3 font-medium">{t('developersPage.descHeader')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SCIM_ENDPOINT_KEYS.map((ep) => (
                      <tr key={ep.path + ep.method} className="border-b border-border/40 last:border-0">
                        <td className="py-2.5 pr-4">
                          <Badge variant="outline" className="font-mono text-xs">
                            {ep.method}
                          </Badge>
                        </td>
                        <td className="py-2.5 pr-4 font-mono text-xs">{ep.path}</td>
                        <td className="py-2.5 text-muted-foreground">{t(ep.descKey)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="ph-card mt-16 p-6 hover:translate-y-0 hover:scale-100">
            <h2 className="ph-title text-lg">{t('securityPage.liveLinksTitle')}</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                { href: '/trust', label: t('securityPage.liveTrust') },
                { href: '/trust/soc2-readiness', label: t('trustPage.linkSoc2Readiness') },
                { href: '/trust/hipaa-readiness', label: t('trustPage.linkHipaaReadiness') },
                { href: '/trust/procurement-request', label: t('nav.procurementRequest') },
                { href: '/security', label: t('status.relatedSecurity') },
                { href: '/status', label: t('securityPage.liveStatus') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={localizePath(link.href, locale)}
                    className="font-medium text-[#2563EB] hover:underline dark:text-sky-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="ph-card mt-16 p-8 hover:translate-y-0 hover:scale-100">
            <h2 className="ph-title text-xl">{t('developersPage.exampleTitle')}</h2>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 text-xs leading-relaxed">
              {`curl -X POST https://qrbanner.com/api/v1/qr \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Store Istanbul",
    "category": "url",
    "qr_data": { "url": "https://example.com/tr" }
  }'`}
            </pre>
          </section>
        </div>
      </PremiumShell>
    </>
  );
}
