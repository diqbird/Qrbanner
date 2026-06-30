import type { BlogPost } from '../types';

export const nonprofitFundraisingQr: BlogPost = {
  slug: 'nonprofit-fundraising-qr-codes',
  title: 'Nonprofit Fundraising QR Codes: Donations, Events & Volunteer Signups',
  description:
    'Charities and nonprofits use QR on mailers, gala tables and street campaigns for donations, volunteer forms and impact stories — update campaigns without reprinting.',
  keywords: ['nonprofit QR code', 'donation QR', 'charity QR code', 'fundraising QR', 'volunteer signup QR'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Nonprofit',
  sections: [
    {
      type: 'p',
      content:
        'Fundraising teams print appeal mailers and event programs months ahead. Dynamic QR lets you swap donation URLs, matching-gift partners and impact videos when campaigns pivot.',
    },
    {
      type: 'h2',
      content: 'Campaign placements',
    },
    {
      type: 'ul',
      items: [
        'Gala table tents with donate + auction links',
        'Direct mail reply cards with mobile giving',
        'Volunteer shift signup at community events',
        'Impact story videos on street fundraising boards',
      ],
    },
    {
      type: 'h2',
      content: 'Measure impact',
    },
    {
      type: 'p',
      content:
        'Tag codes by campaign batch to compare mail vs. event performance. Add UTM parameters for Google Analytics. Route recurring donors to a thank-you page with upgrade CTA.',
    },
  ],
};
