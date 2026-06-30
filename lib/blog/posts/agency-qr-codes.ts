import type { BlogPost } from '../types';

export const agencyQrCodes: BlogPost = {
  slug: 'marketing-agency-qr-white-label-guide',
  title: 'Agency Guide: White-Label QR Codes for Client Campaigns',
  description:
    'How agencies deliver dynamic QR at scale — workspaces, custom domains, hidden branding, bulk import and client reporting on QRbanner Agency plan.',
  keywords: ['agency QR codes', 'white label QR', 'QR reseller platform', 'client QR campaigns', 'marketing agency QR'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 7,
  author: 'QRbanner Team',
  category: 'Agencies',
  sections: [
    {
      type: 'p',
      content:
        'Agencies juggle dozens of client campaigns — each with different domains, landing pages and reporting needs. A single QR tool with white-label options beats stitching together generic generators per project.',
    },
    {
      type: 'h2',
      content: 'Agency workflow on QRbanner',
    },
    {
      type: 'ul',
      items: [
        'Create a folder or workspace per client',
        'Bulk-import event or retail codes from CSV',
        'Point scan.yourclient.com via custom domain verify',
        'Hide “Powered by QRbanner” on Agency / Business plans',
        'Push scan events to client Slack via webhooks',
      ],
    },
    {
      type: 'h2',
      content: 'What to bill clients for',
    },
    {
      type: 'p',
      content:
        'Package QR setup as a line item: creative, landing page copy, print file export and monthly analytics review. Dynamic codes justify a retainer because destinations and routing rules evolve without reprint costs.',
    },
    {
      type: 'h2',
      content: 'Referral growth',
    },
    {
      type: 'p',
      content:
        'Share your referral link from Settings — earn credit when clients sign up and verify. Combine with ROI calculator on your pitch deck to show print savings vs static codes.',
    },
  ],
};
