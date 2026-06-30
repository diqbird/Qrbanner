import type { BlogPost } from '../types';

export const optometryPracticeQr: BlogPost = {
  slug: 'optometry-practice-qr',
  title: 'Optometry Practice QR: Patient Intake, Booking and Eyewear Promos',
  description:
    'How optometry practices use dynamic QR on reception signage for patient intake, online booking and eyewear promos without reprinting.',
  keywords: ['optometry QR code', 'eye care QR', 'optometrist marketing', 'patient intake QR', 'eyewear promo QR'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Healthcare',
  sections: [
    {
      type: 'p',
      content:
        'Optometry offices print QR once on reception tents and recall postcards. Dynamic links keep intake forms, booking pages and lens promos current when offers change.',
    },
    {
      type: 'h2',
      content: 'Reception and recall workflows',
    },
    {
      type: 'ul',
      items: [
        'New patient intake before eye exams',
        'Online booking for routine and specialty visits',
        'Back-to-school and lens promos on displays',
        'Recall postcards with updatable booking links',
      ],
    },
    {
      type: 'h2',
      content: 'Multi-location groups',
    },
    {
      type: 'p',
      content:
        'Create codes per office or share one group-wide design. Update promos centrally and compare scan peaks across locations for seasonal campaigns.',
    },
  ],
};
