import type { BlogPost } from '../types';

export const restaurantMenuQr: BlogPost = {
  slug: 'restaurant-menu-qr-codes',
  title: 'Restaurant Menu QR Codes: Setup, Design & Best Practices (2026)',
  description:
    'How to replace paper menus with dynamic QR codes — placement tips, sizing, hygiene-friendly design, and updating dishes without reprinting.',
  keywords: ['restaurant menu QR', 'digital menu QR', 'QR code menu', 'hospitality QR', 'table tent QR'],
  publishedAt: '2026-06-10',
  updatedAt: '2026-06-29',
  readingMinutes: 7,
  author: 'QRbanner Team',
  category: 'Hospitality',
  sections: [
    {
      type: 'p',
      content:
        'Paper menus are expensive to reprint and slow to update when prices or allergens change. A dynamic menu QR code on each table lets guests scan once and always see your latest PDF or web menu — while you track which locations drive the most scans.',
    },
    {
      type: 'h2',
      content: 'Why use dynamic (not static) menu QRs?',
    },
    {
      type: 'ul',
      items: [
        'Change the menu URL or PDF after printing — no new stickers needed.',
        'See scan counts by table, daypart, or campaign.',
        'Add a branded landing page before the menu opens.',
        'Route lunch vs dinner menus by schedule rules.',
      ],
    },
    {
      type: 'h2',
      content: 'Placement and sizing',
    },
    {
      type: 'p',
      content:
        'Place codes at eye level on table tents, check presenters, or window decals. Minimum print size is roughly 2×2 cm (0.8 in) with quiet zone margin. Use high contrast (dark code on light background) and test scans from 30–50 cm away under your restaurant lighting.',
    },
    {
      type: 'h2',
      content: 'Content that converts',
    },
    {
      type: 'p',
      content:
        'Lead with a short headline on your landing page (“Tonight’s menu”) and one clear button. Keep the final menu mobile-first: large tap targets, allergen icons, and fast-loading images. Update seasonal items from your QRbanner dashboard in seconds.',
    },
    {
      type: 'faq',
      faq: [
        {
          question: 'Can I use one QR for every table?',
          answer:
            'Yes. One dynamic code works everywhere. Use separate codes per location only if you want granular analytics per room or terrace.',
        },
        {
          question: 'What if Wi‑Fi is weak?',
          answer:
            'Host menus on a fast CDN or lightweight HTML page. Offer a downloadable PDF as fallback in the same QR destination.',
        },
      ],
    },
  ],
};
