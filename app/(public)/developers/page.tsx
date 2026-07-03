import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { ArrowRight, Code2, FileJson, Key, Webhook, Gauge } from 'lucide-react';

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
  { method: 'GET', path: '/api/v1/qr/:id', descKey: 'developersPage.epGetQr' },
  { method: 'PUT', path: '/api/v1/qr/:id', descKey: 'developersPage.epUpdateQr' },
  { method: 'DELETE', path: '/api/v1/qr/:id', descKey: 'developersPage.epDeleteQr' },
  { method: 'GET', path: '/api/v1/folders', descKey: 'developersPage.epListFolders' },
  { method: 'POST', path: '/api/v1/folders', descKey: 'developersPage.epCreateFolder' },
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
              </div>
              <div className="rounded-xl border border-border/50 bg-card/80 p-6 backdrop-blur-sm">
                <h2 className="font-display font-semibold flex items-center gap-2">
                  <FileJson className="h-4 w-4 text-primary" /> {t('developersPage.openapiTitle')}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t('developersPage.openapiBody')}</p>
                <Link
                  href="/api/openapi.json"
                  className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('developersPage.openapiLink')} →
                </Link>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/80 p-6 backdrop-blur-sm">
                <h2 className="font-display font-semibold flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-primary" /> {t('developersPage.rateLimitsTitle')}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {t('developersPage.rateLimitsBody')}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <li>{t('developersPage.rateLimitsFree')}</li>
                  <li>{t('developersPage.rateLimitsPro')}</li>
                  <li>{t('developersPage.rateLimitsBusiness')}</li>
                  <li>{t('developersPage.rateLimitsAgency')}</li>
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
