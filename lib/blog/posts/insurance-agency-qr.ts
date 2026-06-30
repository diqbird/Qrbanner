import type { BlogPost } from '../types';

export const insuranceAgencyQr: BlogPost = {
  slug: 'insurance-agency-qr-codes',
  title: 'Insurance Agency QR: Quotes, Policy PDFs and Renewals from One Lobby Scan',
  description:
    'How independent insurance agencies use dynamic QR for quote intake, policy libraries and renewal reminders with compliant, updatable links.',
  keywords: ['insurance QR code', 'insurance agency marketing', 'policy QR', 'insurance lead QR', 'renewal reminder QR'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Insurance',
  sections: [
    {
      type: 'p',
      content:
        'Carrier product updates should not require reprinting every lobby tent card. Dynamic QR keeps the printed piece fixed while quote forms, policy PDFs and renewal portals stay compliant and current.',
    },
    {
      type: 'h2',
      content: 'Agent and branch rollout',
    },
    {
      type: 'ul',
      items: [
        'Lobby desk and waiting-area signage',
        'Renewal postcards and policy jackets',
        'Producer business cards with personal intake links',
        'Password-protected document hubs for sensitive PDFs',
      ],
    },
    {
      type: 'h2',
      content: 'Connect to your AMS',
    },
    {
      type: 'p',
      content:
        'Webhooks push quote form submissions to your agency management system. Export scan logs for carrier co-op reporting and compliance reviews.',
    },
  ],
};
