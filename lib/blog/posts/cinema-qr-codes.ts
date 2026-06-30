import type { BlogPost } from '../types';

export const cinemaQrCodes: BlogPost = {
  slug: 'cinema-qr-codes-ticketing',
  title: 'Cinema QR Codes: Ticketing, Concessions & Loyalty',
  description:
    'Use dynamic QR at cinemas for mobile tickets, concession menus, trailer links and loyalty signups — update showtimes without reprinting posters.',
  keywords: ['cinema QR code', 'movie theater QR', 'ticket QR', 'concession menu QR', 'cinema marketing'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Entertainment',
  sections: [
    {
      type: 'p',
      content:
        'Cinemas rotate posters weekly but printed QR stickers often point to last month’s blockbuster trailer. Dynamic QR on standees, seat backs and ticket stubs keeps fans on the right promo for each film run.',
    },
    {
      type: 'h2',
      content: 'Where to place codes',
    },
    {
      type: 'ul',
      items: [
        'Lobby standees linking to trailers and showtimes',
        'Concession menus with combo deals that change by daypart',
        'Ticket stubs for post-show surveys and loyalty apps',
        'Parking signs for pre-order snacks',
      ],
    },
    {
      type: 'h2',
      content: 'Measure engagement',
    },
    {
      type: 'p',
      content:
        'Tag codes by auditorium zone to compare lobby vs. hallway placement. Swap trailer URLs on release Friday without touching physical signage. Route weekend family audiences to kids’ matinee landing pages using schedule rules.',
    },
  ],
};
