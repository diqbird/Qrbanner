import type { BlogPost } from '../../types';

export const developersApiGettingStartedDe: BlogPost = {
  slug: 'developers-api-getting-started',
  title: 'QRbanner REST API v1: Einstieg in 10 Minuten',
  description:
    'Ersten API-Key anlegen, QR-Codes auflisten und Scan-Webhooks mit HMAC-Signaturen empfangen — Quickstart für Entwickler, die QR-Operationen automatisieren.',
  keywords: ['QR-Code API', 'QRbanner API', 'dynamische QR API', 'QR Webhooks', 'QR-Automatisierung'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 7,
  author: 'QRbanner Team',
  category: 'Entwickler',
  sections: [
    {
      type: 'p',
      content:
        'Die QRbanner REST API v1 lässt Sie QR-Codes aus Scripts, Backends und CI-Pipelines erstellen, aktualisieren und organisieren. API-Keys sind im Free-Plan verfügbar — kein Sales-Call nötig.',
    },
    {
      type: 'h2',
      content: 'API-Key erstellen',
    },
    {
      type: 'ul',
      items: [
        'Anmelden und Dashboard → Einstellungen → API Keys öffnen',
        'Key mit aussagekräftigem Namen erstellen (z. B. „Production backend“)',
        'Key einmal kopieren — er wird nur bei der Erstellung angezeigt',
        'Bei jeder Anfrage als Authorization: Bearer oder X-API-Key senden',
      ],
    },
    {
      type: 'h2',
      content: 'Ersten QR-Code erstellen',
    },
    {
      type: 'p',
      content:
        'POST /api/v1/qr mit einem JSON-Body aus name, category und qr_data. URL-Codes brauchen { "url": "https://..." }. Die Antwort enthält short_code und Scan-URL.',
    },
    {
      type: 'h2',
      content: 'Scan-Webhooks empfangen',
    },
    {
      type: 'p',
      content:
        'HTTPS-Endpoint unter Einstellungen → Scan Webhooks hinterlegen. Jeder Scan sendet per POST JSON mit event, qr_code_id und Scan-Metadaten. X-QRbanner-Signature mit HMAC-SHA256 und Ihrem Webhook-Secret verifizieren. Lieferhistorie im selben Panel einsehen.',
    },
    {
      type: 'h2',
      content: 'OpenAPI-Spezifikation',
    },
    {
      type: 'p',
      content:
        'openapi.json von /developers oder /api/openapi.json herunterladen und REST API v1 in Postman, Insomnia oder Ihr API-Gateway importieren — inkl. QR-, Ordner- und Webhook-Schemas.',
    },
  ],
};
