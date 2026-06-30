import type { BlogPost } from '../types';

export const farmersMarketQr: BlogPost = {
  slug: 'farmers-market-qr',
  title: 'Farmers Market QR: Vendor Directories, Weekly Specials and Signups',
  description:
    'How farmers markets use dynamic QR on entrance signage for vendor directories, weekly specials and vendor applications.',
  keywords: ['farmers market QR', 'farm stand QR', 'produce market QR', 'vendor directory QR', 'farmers market marketing'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Food & Beverage',
  sections: [
    {
      type: 'p',
      content:
        'Farmers markets print QR once on entrance gates and info booths. Shoppers access vendor maps, weekly specials and vendor signup forms without reprinting signage each market day.',
    },
    {
      type: 'h2',
      content: 'Entrance and vendor touchpoints',
    },
    {
      type: 'ul',
      items: [
        'Gate and parking lot entrance signage',
        'Info booth tent and newsletter signup',
        'Vendor application forms for new stalls',
        'Weekly produce and artisan specials',
      ],
    },
    {
      type: 'h2',
      content: 'Seasonal updates',
    },
    {
      type: 'p',
      content:
        'Update vendor lineups and seasonal hours from the dashboard. Same QR on stored entrance banners — new directory on opening day.',
    },
  ],
};
