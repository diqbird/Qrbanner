import type { BlogPost } from '../types';

export const wineTastingRoomQr: BlogPost = {
  slug: 'wine-tasting-room-qr',
  title: 'Winery QR: Tasting Menus, Wine Club Signups and Event Tickets',
  description:
    'How wineries and tasting rooms use dynamic QR on bottle neckers and table tents for tasting menus, club signups and event tickets.',
  keywords: ['winery QR code', 'tasting room QR', 'wine club QR', 'vineyard marketing', 'wine tasting QR'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Food & Beverage',
  sections: [
    {
      type: 'p',
      content:
        'Wineries place QR on bottle neck hangers, tasting bar tents and event posters. Guests access current tasting flights, join wine clubs and buy tickets from one scan.',
    },
    {
      type: 'h2',
      content: 'Tasting room placements',
    },
    {
      type: 'ul',
      items: [
        'Bottle neck hangers and shelf talkers',
        'Tasting bar table tents',
        'Harvest festival and event posters',
        'DTC shop links from tasting pours',
      ],
    },
    {
      type: 'h2',
      content: 'Release day swaps',
    },
    {
      type: 'p',
      content:
        'Rotate tasting menus and club offers on release day. Same neck hanger QR — new vintage landing page in minutes.',
    },
  ],
};
