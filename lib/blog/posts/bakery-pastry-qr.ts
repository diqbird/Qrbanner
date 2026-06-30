import type { BlogPost } from '../types';

export const bakeryPastryQr: BlogPost = {
  slug: 'bakery-pastry-qr',
  title: 'Bakery QR: Daily Specials, Pre-Orders and Loyalty',
  description:
    'How bakeries and pastry shops use dynamic QR on counter signs and bag tags for daily specials, pre-orders and loyalty signup.',
  keywords: ['bakery QR code', 'pastry shop QR', 'bakery loyalty QR', 'pre-order QR', 'catering QR'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Food & Beverage',
  sections: [
    {
      type: 'p',
      content:
        'Bakeries place QR on display case signs, bag tags and window decals. Customers view daily specials, submit pre-orders and join loyalty programs without reprinting counter signage.',
    },
    {
      type: 'h2',
      content: 'Counter and bag touchpoints',
    },
    {
      type: 'ul',
      items: [
        'Display case daily special signs',
        'Holiday pre-order forms',
        'Catering inquiry landing pages',
        'Loyalty signup on register stands',
      ],
    },
    {
      type: 'h2',
      content: 'Multi-location bakeries',
    },
    {
      type: 'p',
      content:
        'Update daily special URLs each morning from HQ. Per-location folders show which stores drive the most pre-order scans.',
    },
  ],
};
