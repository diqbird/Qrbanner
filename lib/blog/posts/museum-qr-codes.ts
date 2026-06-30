import type { BlogPost } from '../types';

export const museumQrCodes: BlogPost = {
  slug: 'museums-venues-qr-codes-exhibits',
  title: 'Museum & Venue QR Codes: Exhibits, Audio Guides & Donations',
  description:
    'Label exhibits with dynamic QR for rich media, donations and multilingual content — plus analytics to see which galleries engage visitors most.',
  keywords: ['museum QR code', 'exhibit QR label', 'gallery QR', 'venue QR code', 'audio guide QR'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Museums',
  sections: [
    {
      type: 'p',
      content:
        'Museums replace wall text with QR-linked audio, video and high-res zoom images — especially for rotating exhibits. Dynamic codes mean curators swap content between shows while keeping the same physical label.',
    },
    {
      type: 'h2',
      content: 'Placement tips',
    },
    {
      type: 'ul',
      items: [
        'Eye-level labels beside artifacts with 2×2 cm minimum code size',
        'High contrast codes for gallery lighting conditions',
        'Landing page with donate CTA and newsletter signup',
        'Separate codes per gallery zone for popularity analytics',
      ],
    },
    {
      type: 'h2',
      content: 'Accessibility',
    },
    {
      type: 'p',
      content:
        'Pair QR with short human-readable URLs for visitors who cannot scan. Offer text-size controls on landing pages and route by language for international tourists using geofence or browser locale.',
    },
  ],
};
