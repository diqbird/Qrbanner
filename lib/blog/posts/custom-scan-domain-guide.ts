import type { BlogPost } from '../types';

export const customScanDomainGuide: BlogPost = {
  slug: 'custom-scan-domain-setup-guide',
  title: 'Custom Scan Domains: Brand Your QR Links with scan.yourbrand.com',
  description:
    'How to point a custom scan subdomain to QRbanner for branded short links on menus, packaging and campaigns — included on the free plan.',
  keywords: ['custom QR domain', 'branded QR link', 'scan subdomain', 'white label QR URL', 'QRbanner domain'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Guides',
  sections: [
    {
      type: 'p',
      content:
        'Default short links work everywhere, but brands prefer scan.yourbrand.com on packaging and menus. QRbanner lets you add a custom scan domain on the free plan — visitors see your hostname on every redirect.',
    },
    {
      type: 'h2',
      content: 'Setup checklist',
    },
    {
      type: 'ul',
      items: [
        'Choose a subdomain (e.g. scan.acme.com or qr.acme.com)',
        'Add the CNAME record QRbanner provides in your DNS',
        'Verify the domain in Settings → Custom domains',
        'Existing dynamic codes automatically use the branded host',
      ],
    },
    {
      type: 'h2',
      content: 'Agency tip',
    },
    {
      type: 'p',
      content:
        'Agencies add one domain per client on Business and Agency plans. Pair with hidden powered-by branding on landing pages for fully white-label delivery.',
    },
  ],
};
