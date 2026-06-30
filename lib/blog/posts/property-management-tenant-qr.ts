import type { BlogPost } from '../types';

export const propertyManagementTenantQr: BlogPost = {
  slug: 'property-management-tenant-qr',
  title: 'Property Management QR: Tenant Portals, Maintenance and Lease Docs',
  description:
    'How property managers use dynamic QR on lobby signage and unit mailers for tenant portals, maintenance requests and lease PDFs without reprinting.',
  keywords: ['property management QR', 'tenant portal QR', 'apartment QR code', 'maintenance request QR', 'lease document QR'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Real Estate',
  sections: [
    {
      type: 'p',
      content:
        'Property managers print QR once on lobby posters, elevator signs and welcome packets. Dynamic links keep tenant portals, maintenance forms and amenity guides current when policies or vendors change.',
    },
    {
      type: 'h2',
      content: 'Where to place QR codes',
    },
    {
      type: 'ul',
      items: [
        'Lobby desk and elevator landing signage',
        'Move-in welcome packets and unit mailers',
        'Amenity room rules and parking permits',
        'Maintenance closet instructions for staff',
      ],
    },
    {
      type: 'h2',
      content: 'Per-building analytics',
    },
    {
      type: 'p',
      content:
        'Create codes per property and group portfolios in folders. Compare scan peaks after policy emails vs lobby signage. Export CSV for ownership reporting.',
    },
  ],
};
