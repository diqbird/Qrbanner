import type { BlogPost } from '../types';

export const civicEngagementQr: BlogPost = {
  slug: 'civic-engagement-qr-codes',
  title: 'Civic Engagement QR Codes: Permits, Outreach & Public Meetings',
  description:
    'Municipalities use dynamic QR for permit portals, meeting agendas, park info and multilingual citizen outreach — update links when policies change.',
  keywords: ['civic QR code', 'municipal QR', 'government outreach QR', 'public meeting QR', 'permit QR code'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Government',
  sections: [
    {
      type: 'p',
      content:
        'City halls print new posters whenever forms move online or meeting agendas update. Dynamic QR on bus shelters, library boards and permit offices keeps citizens on the current portal without a reprint cycle.',
    },
    {
      type: 'h2',
      content: 'High-trust placements',
    },
    {
      type: 'ul',
      items: [
        'Permit and licensing lobby signage',
        'Park and recreation facility hours',
        'Public meeting agendas and livestream links',
        'Multilingual service directories',
        'Feedback and 311-style reporting forms',
      ],
    },
    {
      type: 'h2',
      content: 'Transparency',
    },
    {
      type: 'p',
      content:
        'Show a “last updated” date on landing pages. Export monthly scan summaries for council reports. Use separate codes per ward to see which neighborhoods engage most with outreach materials.',
    },
  ],
};
