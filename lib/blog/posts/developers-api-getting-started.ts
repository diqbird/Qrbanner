import type { BlogPost } from '../types';

export const developersApiGettingStarted: BlogPost = {
  slug: 'developers-api-getting-started',
  title: 'QRbanner REST API v1: Getting Started in 10 Minutes',
  description:
    'Create your first API key, list QR codes and receive scan webhooks with HMAC signatures — a quickstart for developers automating QR operations.',
  keywords: ['QR code API', 'QRbanner API', 'dynamic QR API', 'QR webhooks', 'QR automation'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 7,
  author: 'QRbanner Team',
  category: 'Developers',
  sections: [
    {
      type: 'p',
      content:
        'QRbanner REST API v1 lets you create, update and organize QR codes from scripts, backends and CI pipelines. API keys are available on the free plan — no sales call required.',
    },
    {
      type: 'h2',
      content: 'Create an API key',
    },
    {
      type: 'ul',
      items: [
        'Sign in and open Dashboard → Settings → API Keys',
        'Create a key with a descriptive name (e.g. "Production backend")',
        'Copy the key once — it is shown only at creation time',
        'Send it as Authorization: Bearer or X-API-Key on every request',
      ],
    },
    {
      type: 'h2',
      content: 'Create your first QR code',
    },
    {
      type: 'p',
      content:
        'POST /api/v1/qr with a JSON body containing name, category and qr_data. URL codes need { "url": "https://..." }. The response includes short_code and scan URL.',
    },
    {
      type: 'h2',
      content: 'Receive scan webhooks',
    },
    {
      type: 'p',
      content:
        'Add an HTTPS endpoint under Settings → Scan Webhooks. Each scan POSTs JSON with event, qr_code_id and scan metadata. Verify X-QRbanner-Signature with HMAC-SHA256 using your webhook secret. Inspect delivery history in the same panel.',
    },
    {
      type: 'h2',
      content: 'OpenAPI specification',
    },
    {
      type: 'p',
      content:
        'Download openapi.json from /developers or /api/openapi.json to import REST API v1 into Postman, Insomnia or your API gateway — includes QR, folder and webhook schemas.',
    },
  ],
};
