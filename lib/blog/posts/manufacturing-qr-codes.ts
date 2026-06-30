import type { BlogPost } from '../types';

export const manufacturingQrCodes: BlogPost = {
  slug: 'manufacturing-qr-codes',
  title: 'Manufacturing QR Codes: Work Instructions, Assets & Quality Checks',
  description:
    'Factories use dynamic QR on machines, work orders and quality stations — update SOP PDFs and inspection forms without relabeling equipment.',
  keywords: ['manufacturing QR code', 'factory QR', 'work instruction QR', 'asset tag QR', 'quality control QR'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 7,
  author: 'QRbanner Team',
  category: 'Manufacturing',
  sections: [
    {
      type: 'p',
      content:
        'Plants update SOPs frequently but machine labels last years. Dynamic QR on equipment tags and station boards keeps technicians on the latest work instruction URL.',
    },
    {
      type: 'h2',
      content: 'Shop floor placements',
    },
    {
      type: 'ul',
      items: [
        'CNC and assembly station SOP links',
        'Preventive maintenance checklists',
        'Spare parts ordering portals',
        'Safety data sheets (SDS) by chemical zone',
      ],
    },
    {
      type: 'h2',
      content: 'Governance',
    },
    {
      type: 'p',
      content:
        'Password-protect internal codes. Log revision dates on landing pages. Use batch labels per production line to compare scan adoption after training rollouts.',
    },
  ],
};
