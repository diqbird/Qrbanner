import type { BlogPost } from '../types';

export const carWashDetailingQr: BlogPost = {
  slug: 'car-wash-detailing-qr',
  title: 'Car Wash QR: Membership Signup, Service Menus and Queue Status',
  description:
    'How car washes and detailers use dynamic QR on bay signage and waiting area posters for membership signup and service menus.',
  keywords: ['car wash QR code', 'detailing QR', 'car wash membership QR', 'auto detailing QR', 'car wash marketing'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Automotive',
  sections: [
    {
      type: 'p',
      content:
        'Car washes print QR once on bay entrance boards, vacuum area signs and waiting room posters. Customers sign up for memberships, view service menus and check queue status without outdated bay signage.',
    },
    {
      type: 'h2',
      content: 'Bay and lobby placements',
    },
    {
      type: 'ul',
      items: [
        'Bay entrance membership signup signs',
        'Detailing service menu posters',
        'Queue status links for waiting customers',
        'Seasonal package promotion pages',
      ],
    },
    {
      type: 'h2',
      content: 'Multi-bay operators',
    },
    {
      type: 'p',
      content:
        'Create codes per location or share one operator-wide design. Update wash package pricing centrally and compare scan peaks across bays.',
    },
  ],
};
