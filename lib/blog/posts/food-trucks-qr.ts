import type { BlogPost } from '../types';

export const foodTrucksQr: BlogPost = {
  slug: 'food-trucks-qr',
  title: 'Food Truck QR: Daily Menus, Locations and Festival Pre-Orders',
  description:
    'How food truck operators use dynamic QR on window boards and festival tents for daily menus, location schedules and mobile pre-orders.',
  keywords: ['food truck QR code', 'mobile food QR', 'food truck menu QR', 'festival food QR', 'food truck marketing'],
  publishedAt: '2026-06-30',
  updatedAt: '2026-06-30',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Food & Beverage',
  sections: [
    {
      type: 'p',
      content:
        'Food trucks print QR once on window boards, festival tent banners and business cards. Customers view today\'s menu, find the truck\'s current location and place pre-orders without outdated window signage.',
    },
    {
      type: 'h2',
      content: 'Window and festival touchpoints',
    },
    {
      type: 'ul',
      items: [
        'Service window daily menu signs',
        'Live location and schedule pages',
        'Festival pre-order forms',
        'Loyalty signup on business cards',
      ],
    },
    {
      type: 'h2',
      content: 'Multi-truck operators',
    },
    {
      type: 'p',
      content:
        'Update menu and location URLs each morning from one dashboard. Per-truck folders show which festivals drive the most pre-order scans.',
    },
  ],
};
