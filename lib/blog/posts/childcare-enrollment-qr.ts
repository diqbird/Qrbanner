import type { BlogPost } from '../types';

export const childcareEnrollmentQr: BlogPost = {
  slug: 'childcare-enrollment-qr',
  title: 'Childcare QR: Enrollment, Parent Portals and Event Signups',
  description:
    'How childcare and daycare centers use dynamic QR for enrollment intake, parent communication and event signups without reprinting lobby signage.',
  keywords: ['childcare QR code', 'daycare QR', 'preschool enrollment QR', 'parent portal QR', 'daycare marketing'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Education',
  sections: [
    {
      type: 'p',
      content:
        'Childcare centers place QR on lobby desks, tour packets and parent bulletin boards. Families complete enrollment on their phone and access portals for updates and events.',
    },
    {
      type: 'h2',
      content: 'Where to place QR codes',
    },
    {
      type: 'ul',
      items: [
        'Lobby desk and tour welcome packets',
        'Parent bulletin boards and newsletters',
        'Field trip and event permission forms',
        'Policy handbook and calendar updates',
      ],
    },
    {
      type: 'h2',
      content: 'Per-campus analytics',
    },
    {
      type: 'p',
      content:
        'Create codes per campus and group locations in folders. Compare enrollment scan peaks after open houses vs digital ads.',
    },
  ],
};
