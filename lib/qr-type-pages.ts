import { QR_CATEGORIES, isDynamicCategory } from '@/lib/qr-utils';

export interface QrTypePage {
  slug: string;
  categoryId: string;
  title: string;
  headline: string;
  metaDescription: string;
  keywords: string[];
  description: string;
  benefits: string[];
  useCases: string[];
  isDynamic: boolean;
}

function useCasesFor(categoryId: string, name: string): string[] {
  const map: Record<string, string[]> = {
    url: ['Product packaging', 'Posters and flyers', 'Email signatures'],
    menu: ['Table tents', 'Takeaway bags', 'Digital menu boards'],
    vcard: ['Business cards', 'Conference badges', 'Email footers'],
    wifi: ['Hotel lobbies', 'Cafés and coworking', 'Airbnb welcome folders'],
    whatsapp: ['Customer support stickers', 'Product labels', 'Event booths'],
    instagram: ['Retail displays', 'Packaging inserts', 'In-store signage'],
    link_hub: ['Bio links', 'Event programs', 'Restaurant link menus'],
    pdf: ['Brochures', 'Catalogs', 'Menus as PDF'],
    event: ['Invitations', 'Conference badges', 'Wedding programs'],
  };
  return map[categoryId] ?? [`Print on marketing materials`, `Share ${name} digitally`, `Track scans in analytics`];
}

export function buildQrTypePages(): QrTypePage[] {
  return QR_CATEGORIES.map((cat) => ({
    slug: cat.id,
    categoryId: cat.id,
    title: `${cat.name} QR Code Generator`,
    headline: `Create a ${cat.name} QR Code — Free`,
    metaDescription: `Free ${cat.name.toLowerCase()} QR code generator with branding, analytics and editable destinations. ${cat.description}`,
    keywords: [
      `${cat.shortName} QR code`,
      `${cat.name} QR generator`,
      `free ${cat.shortName.toLowerCase()} QR code`,
      'dynamic QR code',
    ],
    description: cat.description,
    benefits: [
      cat.description,
      isDynamicCategory(cat.id)
        ? 'Edit the destination anytime — no reprint needed'
        : 'Static payload encoded directly in the QR image',
      'Custom colors, logo and frame styles',
      'Download PNG, SVG or print-ready PDF',
      'Scan analytics on dynamic codes',
    ],
    useCases: useCasesFor(cat.id, cat.shortName),
    isDynamic: isDynamicCategory(cat.id),
  }));
}

export function getQrTypeBySlug(slug: string): QrTypePage | undefined {
  return buildQrTypePages().find((p) => p.slug === slug);
}
