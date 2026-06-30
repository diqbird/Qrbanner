import type { BlogPost } from '../types';

export const bulkQrGuide: BlogPost = {
  slug: 'bulk-qr-codes-csv-import',
  title: 'Bulk QR Codes: CSV Import for Multi-Location Rollouts',
  description:
    'Create hundreds of dynamic QR codes from a spreadsheet — ideal for retail chains, events, and product packaging. CSV format, naming, and QA checklist.',
  keywords: ['bulk QR codes', 'CSV QR import', 'mass QR generator', 'retail QR rollout', 'QR batch'],
  publishedAt: '2026-06-22',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Operations',
  sections: [
    {
      type: 'p',
      content:
        'Launching QR at dozens of stores or SKUs manually is slow and error-prone. QRbanner bulk import reads a CSV, creates dynamic codes in one batch, and assigns a shared batch ID so you can filter them later as a campaign.',
    },
    {
      type: 'h2',
      content: 'CSV columns',
    },
    {
      type: 'ul',
      items: [
        'name — label shown in your dashboard (e.g. “Store 042 – Entrance”).',
        'category — url, menu, vcard, wifi, etc.',
        'content — destination URL or category-specific payload.',
        'Optional: folder, labels, UTM tags per row.',
      ],
    },
    {
      type: 'h2',
      content: 'Pre-flight checklist',
    },
    {
      type: 'ul',
      items: [
        'Validate URLs return HTTP 200 before import.',
        'Use consistent naming for reporting.',
        'Export results CSV with short codes for your print vendor.',
        'Spot-check 5 random codes on iOS and Android after import.',
      ],
    },
    {
      type: 'h2',
      content: 'After import',
    },
    {
      type: 'p',
      content:
        'Open the dashboard campaign filter to see the whole batch. Apply a shared style template for print-ready PNG/SVG exports. Plan limits cap row count per plan — upgrade before large rollouts.',
    },
  ],
};
