import type { BlogPost } from '../types';

export const lawFirmQrCodes: BlogPost = {
  slug: 'law-firm-qr-codes',
  title: 'Law Firm QR: Client Intake, Document Portals and Consultation Booking',
  description:
    'How law firms use dynamic QR on lobby signage and business cards for client intake, secure document uploads and consultation booking.',
  keywords: ['law firm QR code', 'legal intake QR', 'attorney marketing QR', 'law office QR', 'client portal QR'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Legal',
  sections: [
    {
      type: 'p',
      content:
        'Law firms print QR once on lobby posters, conference room signage and business cards. Dynamic links keep intake forms, document portals and practice area pages current when offerings change.',
    },
    {
      type: 'h2',
      content: 'Lobby and attorney workflows',
    },
    {
      type: 'ul',
      items: [
        'Consultation intake before the first meeting',
        'Secure document upload for existing clients',
        'Practice area promos on conference room signage',
        'Per-attorney referral cards with personal intake links',
      ],
    },
    {
      type: 'h2',
      content: 'Multi-office networks',
    },
    {
      type: 'p',
      content:
        'Create codes per office or share one network-wide design. Update forms centrally and route leads with webhooks to your CRM or case management system.',
    },
  ],
};
