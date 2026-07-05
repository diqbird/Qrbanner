import type { BlogPost } from '../types';

export const referralProgramGuide: BlogPost = {
  slug: 'qrbanner-referral-program-guide',
  title: 'QRbanner Referral Program: Share Links, Track Signups, Claim Rewards',
  description:
    'How the QRbanner referral program works — personal links, OAuth and email signups with ?ref=, milestone perks and Pro trial credits at 5 referrals.',
  keywords: ['QRbanner referral', 'QR referral program', 'SaaS referral link', 'dynamic QR affiliate'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 5,
  author: 'QRbanner Team',
  category: 'Product',
  sections: [
    {
      type: 'p',
      content:
        'Every QRbanner account includes a personal referral link in Settings → Referral program. Share it with colleagues, clients or your audience — signups that use ?ref=YOURCODE count toward your stats.',
    },
    {
      type: 'h2',
      content: 'Email and OAuth signups',
    },
    {
      type: 'ul',
      items: [
        'Email signup: append ?ref=CODE to /signup — the code is stored at registration.',
        'Google, GitHub or Microsoft: the same ?ref= link sets a short-lived cookie so OAuth signups still credit you.',
        'Referrals are one-time per new account — duplicate signups do not inflate counts.',
      ],
    },
    {
      type: 'h2',
      content: 'Milestones and Pro trial credit',
    },
    {
      type: 'p',
      content:
        'Track progress at 1, 3, 5 and 10 verified signups. At five referrals you can claim a complimentary Pro plan upgrade. Agency partners at ten signups may qualify for a partner review.',
    },
    {
      type: 'h2',
      content: 'Tips for agencies',
    },
    {
      type: 'p',
      content:
        'Pair your referral link with case studies and the ROI calculator when pitching clients. White-label landing pages on Business and Agency plans make handoffs professional while referrals grow your account perks.',
    },
  ],
};
