import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
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
  { method: 'DELETE', path: '/api/scim/v2/Users/:id', descKey: 'developersPage.scimEpDeleteUser' },
  { method: 'GET', path: '/api/scim/v2/Groups', descKey: 'developersPage.scimEpListGroups' },
  { method: 'GET', path: '/api/scim/v2/Groups/:id', descKey: 'developersPage.scimEpGetGroup' },
  { method: 'PATCH', path: '/api/scim/v2/Groups/:id', descKey: 'developersPage.scimEpUpdateGroup' },
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
        })}
      />
      <PublicBreadcrumbs items={[{ label: t('nav.api'), href: '/developers' }]} />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <header className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              {t('developersPage.badge')}
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {t('developersPage.heroTitle')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('developersPage.heroSubtitle')}</p>
          </header>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            <div className="rounded-xl border border-border/50 bg-card/80 p-6 backdrop-blur-sm lg:col-span-2">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" /> {t('developersPage.endpointsTitle')}
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
              <div className="rounded-xl border border-border/50 bg-card/80 p-6 backdrop-blur-sm">
                <h2 className="font-display font-semibold flex items-center gap-2">
                  <Key className="h-4 w-4 text-primary" /> {t('developersPage.authTitle')}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t('developersPage.authBody')}</p>
                <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-3 text-xs">
                  {`Authorization: Bearer qb_live_...

# or

X-API-Key: qb_live_...`}
                </pre>
              </div>
              <div id="webhooks" className="rounded-xl border border-border/50 bg-card/80 p-6 backdrop-blur-sm scroll-mt-24">
                <h2 className="font-display font-semibold flex items-center gap-2">
                  <Webhook className="h-4 w-4 text-primary" /> {t('developersPage.webhooksTitle')}
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
                <Link href="/integrations" className="mt-4 inline-block text-sm text-primary hover:underline">
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
              <div className="rounded-xl border border-border/50 bg-card/80 p-6 backdrop-blur-sm">
                <h2 className="font-display font-semibold flex items-center gap-2">
                  <FileJson className="h-4 w-4 text-primary" /> {t('developersPage.openapiTitle')}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t('developersPage.openapiBody')}</p>
                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href="/developers/reference"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
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
              <div className="rounded-xl border border-border/50 bg-card/80 p-6 backdrop-blur-sm">
                <h2 className="font-display font-semibold flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-primary" /> {t('developersPage.rateLimitsTitle')}
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
              <div className="rounded-xl border border-border/50 bg-card/80 p-6 backdrop-blur-sm">
                <h2 className="font-display font-semibold">{t('developersPage.baseUrlTitle')}</h2>
                <p className="mt-3 font-mono text-sm">https://qrbanner.com</p>
              </div>
              <Link href="/signup">
                <Button className="w-full gap-2">
                  {t('developersPage.cta')} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <section
            id="mobile-api"
            className="mt-16 scroll-mt-24 rounded-xl border border-border/50 bg-card/80 p-6 sm:p-8 backdrop-blur-sm"
          >
            <h2 className="font-display text-xl font-bold">{t('developersPage.mobileTitle')}</h2>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground leading-relaxed">
              {t('developersPage.mobileBody')}
            </p>
            <p className="mt-2 text-sm">
              <Link href="/apps" className="font-medium text-primary hover:underline">
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
            className="mt-16 scroll-mt-24 rounded-xl border border-border/50 bg-card/80 p-6 sm:p-8 backdrop-blur-sm"
          >
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <UsersRound className="h-5 w-5 text-primary" /> {t('developersPage.scimTitle')}
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground leading-relaxed">
              {t('developersPage.scimBody')}
            </p>
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

          <section className="mt-16 rounded-xl border border-border/50 bg-card/80 p-8 backdrop-blur-sm">
            <h2 className="font-display text-xl font-bold">{t('developersPage.exampleTitle')}</h2>
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
      </div>
    </>
  );
}
