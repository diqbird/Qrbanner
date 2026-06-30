import type { BlogPost } from '../types';

export const accountingFirmQr: BlogPost = {
  slug: 'accounting-firm-qr',
  title: 'Accounting Firm QR: Client Intake, Tax Portals and Document Uploads',
  description:
    'How accounting firms use dynamic QR for tax season intake, secure document uploads and appointment booking without reprinting mailers.',
  keywords: ['accounting firm QR', 'CPA QR code', 'tax client intake QR', 'accountant marketing', 'client portal QR'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Professional Services',
  sections: [
    {
      type: 'p',
      content:
        'Accounting firms place QR on lobby desks, tax envelopes and year-end mailers. Clients complete intake on their phone and upload documents to secure portals before appointments.',
    },
    {
      type: 'h2',
      content: 'Tax season placements',
    },
    {
      type: 'ul',
      items: [
        'Lobby desk and waiting-area signage',
        'Tax return envelopes and organizer mailers',
        'Deadline reminder postcards',
        'Partner business cards with personal intake links',
      ],
    },
    {
      type: 'h2',
      content: 'Connect to your practice software',
    },
    {
      type: 'p',
      content:
        'Webhooks push form submissions to your practice management system. Export scan logs for partner reporting and seasonal campaign reviews.',
    },
  ],
};
