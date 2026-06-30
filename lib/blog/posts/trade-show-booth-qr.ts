import type { BlogPost } from '../types';

export const tradeShowBoothQr: BlogPost = {
  slug: 'trade-show-booth-qr',
  title: 'Trade Show Booth QR: Lead Capture, Demos and Session Links',
  description:
    'How exhibitors use dynamic QR on booth banners and badge inserts for lead capture, product demos and session schedules.',
  keywords: ['trade show QR code', 'expo booth QR', 'conference QR', 'lead capture QR', 'exhibition QR'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Marketing',
  sections: [
    {
      type: 'p',
      content:
        'Exhibitors print QR once on banner stands, table tents and badge inserts. Attendees access product demos, lead forms and session schedules without outdated booth handouts.',
    },
    {
      type: 'h2',
      content: 'Booth and badge placements',
    },
    {
      type: 'ul',
      items: [
        'Banner stand and backwall graphics',
        'Table tent lead capture forms',
        'Badge insert session schedules',
        'Post-show follow-up landing pages',
      ],
    },
    {
      type: 'h2',
      content: 'Track leads per event',
    },
    {
      type: 'p',
      content:
        'Create codes per trade show or use UTM parameters. Webhooks push scan events to your CRM and compare booth performance across events.',
    },
  ],
};
