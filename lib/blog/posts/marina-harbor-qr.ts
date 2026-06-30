import type { BlogPost } from '../types';

export const marinaHarborQr: BlogPost = {
  slug: 'marina-harbor-qr',
  title: 'Marina QR: Harbor Maps, Slip Info and Charter Bookings',
  description:
    'How marinas and harbors use dynamic QR on dock signage for harbor maps, slip assignments and charter bookings.',
  keywords: ['marina QR code', 'boating QR', 'harbor QR', 'yacht club QR', 'marina marketing'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Hospitality',
  sections: [
    {
      type: 'p',
      content:
        'Marinas print QR once on dock boards, office desks and guest packets. Boaters access harbor maps, slip info and charter booking forms without reprinting signage each season.',
    },
    {
      type: 'h2',
      content: 'Dock and guest touchpoints',
    },
    {
      type: 'ul',
      items: [
        'Guest dock information boards',
        'Harbor master office desk tents',
        'Charter and rental booking forms',
        'Seasonal rate and policy updates',
      ],
    },
    {
      type: 'h2',
      content: 'Multi-harbor operators',
    },
    {
      type: 'p',
      content:
        'Create codes per marina or share one operator-wide design. Update rate sheets centrally and compare scan peaks across harbors.',
    },
  ],
};
