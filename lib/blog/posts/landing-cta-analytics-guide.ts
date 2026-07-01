import type { BlogPost } from '../types';

export const landingCtaAnalyticsGuide: BlogPost = {
  slug: 'landing-page-cta-analytics-guide',
  title: 'Landing Page CTA Analytics: Measure Scan-to-Click Conversion',
  description:
    'Raw scan counts only tell half the story. Learn how QRbanner tracks landing page button clicks so you can optimize menus, coupons and app installs.',
  keywords: ['QR CTA analytics', 'landing page conversion', 'QR marketing ROI', 'button click tracking'],
  publishedAt: '2026-07-01',
  updatedAt: '2026-07-01',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Analytics',
  sections: [
    {
      type: 'p',
      content:
        'A restaurant QR might get 500 scans per week — but how many guests actually tapped “View menu” or “Order now”? QRbanner separates scan events from CTA clicks on branded landing pages.',
    },
    {
      type: 'h2',
      content: 'Metrics to watch',
    },
    {
      type: 'ul',
      items: [
        'CTA click rate per QR code (clicks ÷ scans).',
        'Compare variants when A/B routing is enabled.',
        'Pair with GA4 or Meta Pixel for downstream revenue.',
      ],
    },
    {
      type: 'h2',
      content: 'Where to find the data',
    },
    {
      type: 'p',
      content:
        'Open any QR → Analytics. The Landing CTA panel shows total clicks, unique clickers and recent events. Export CSV alongside country, device and time breakdowns for campaign reports.',
    },
    {
      type: 'h2',
      content: 'Optimization playbook',
    },
    {
      type: 'ul',
      items: [
        'Test shorter CTA labels (“Order” vs “Tap to order online”).',
        'Match accent colors to your print signage for trust.',
        'Relocate low-CTR codes or refresh landing copy without reprinting the QR image.',
      ],
    },
  ],
};
