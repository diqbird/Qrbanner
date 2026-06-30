import type { BlogPost } from '../types';

export const veterinaryClinicQr: BlogPost = {
  slug: 'veterinary-clinic-qr',
  title: 'Veterinary Clinic QR: Pet Intake, Appointments and Aftercare',
  description:
    'How veterinary clinics use dynamic QR for pet intake forms, online booking and vaccination reminders without reprinting lobby signage.',
  keywords: ['veterinary QR code', 'vet clinic QR', 'pet intake QR', 'animal hospital QR', 'veterinary marketing'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Healthcare',
  sections: [
    {
      type: 'p',
      content:
        'Veterinary clinics place QR on reception desks, kennel cards and appointment reminders. Owners complete intake on their phone before visits and access aftercare guides after procedures.',
    },
    {
      type: 'h2',
      content: 'Common placements',
    },
    {
      type: 'ul',
      items: [
        'Lobby desk and exam room signage',
        'Vaccination reminder postcards',
        'Wellness plan and flea/tick promos',
        'Emergency after-hours instructions',
      ],
    },
    {
      type: 'h2',
      content: 'Track what works',
    },
    {
      type: 'p',
      content:
        'Compare scan peaks after reminder mailers vs lobby signage. Export CSV for practice manager reviews and seasonal campaign planning.',
    },
  ],
};
