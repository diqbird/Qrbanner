import type { BlogPost } from '../types';

export const stadiumQrCodes: BlogPost = {
  slug: 'stadium-event-qr-codes',
  title: 'Stadium & Event QR Codes: Concessions, Programs & Fan Engagement',
  description:
    'Use dynamic QR at stadiums and festivals for mobile ordering, digital programs, parking and sponsor offers — swap content between game days.',
  keywords: ['stadium QR code', 'event QR', 'sports venue QR', 'festival QR code', 'concession menu QR'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 7,
  author: 'QRbanner Team',
  category: 'Events',
  sections: [
    {
      type: 'p',
      content:
        'Venues juggle different opponents, sponsors and concession menus every event. Static QR stickers become outdated after one game. Dynamic codes on seat backs, concourse pillars and parking signs keep fans on the right link all season.',
    },
    {
      type: 'h2',
      content: 'Game-day use cases',
    },
    {
      type: 'ul',
      items: [
        'Mobile concession menus with section-specific ordering links',
        'Digital event programs instead of printed booklets',
        'Parking zone maps that update for sold-out lots',
        'Sponsor landing pages with time-limited offers',
        'Post-game surveys and newsletter signups',
      ],
    },
    {
      type: 'h2',
      content: 'Operations at scale',
    },
    {
      type: 'p',
      content:
        'Bulk-create codes per section (101–120, 201–220) via CSV import. Use campaign batches to activate sponsor swaps on kickoff. Compare scan volume by concourse level to optimize staff placement and signage.',
    },
  ],
};
