import type { BlogPost } from '../types';

export const webhookAutomationGuide: BlogPost = {
  slug: 'qr-scan-webhook-automation-guide',
  title: 'QR Scan Webhooks: Automate Slack, Sheets and CRM from Every Scan',
  description:
    'Step-by-step guide to QRbanner HMAC-signed webhooks — connect scans to Zapier, Slack, Google Sheets, HubSpot and custom backends.',
  keywords: ['QR webhook', 'QR scan automation', 'Zapier QR code', 'QRbanner webhook', 'scan API'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 7,
  author: 'QRbanner Team',
  category: 'Developers',
  sections: [
    {
      type: 'p',
      content:
        'Every scan can trigger a signed webhook payload with QR id, timestamp, device and geo fields. Teams use this to alert Slack channels, append Google Sheets rows or update CRM leads in real time.',
    },
    {
      type: 'h2',
      content: 'Setup in three steps',
    },
    {
      type: 'ul',
      items: [
        'Settings → Webhooks → Add endpoint and copy the signing secret',
        'Verify HMAC signatures on your server or use Zapier Catch Hook',
        'Map fields to your action — Slack message, Sheet row or CRM update',
      ],
    },
    {
      type: 'h2',
      content: 'Zapier and no-code',
    },
    {
      type: 'p',
      content:
        'See /integrations/zapier for a visual walkthrough. For custom apps, pair webhooks with our REST API documented at /developers.',
    },
    {
      type: 'h2',
      content: 'Delivery logs and debugging',
    },
    {
      type: 'p',
      content:
        'Settings → Scan Webhooks shows recent delivery attempts with HTTP status codes. Use this to debug Zapier or custom endpoints without guessing whether scans reached your stack.',
    },
    {
      type: 'h2',
      content: 'Reliability tips',
    },
    {
      type: 'p',
      content:
        'Return 2xx quickly and process asynchronously. We retry failed deliveries with exponential backoff. Filter webhooks per QR or campaign to reduce noise on high-traffic codes.',
    },
  ],
};
