import type { QRStyleConfig } from '@/lib/qr-style';
import { computeScannability } from '@/lib/scannability';

type TemplateForDesign = {
  id: string;
  name: string;
  category: string;
  description: string;
  useCases: string[];
  style: Partial<QRStyleConfig>;
  landingPage?: { accentColor?: string; enabled?: boolean };
};

/** Master-prompt aligned design metadata for industry templates */
export interface TemplateDesignProfile {
  designStyle: 'modern' | 'luxury' | 'minimal' | 'corporate' | 'organic' | 'tech' | 'premium';
  targetSectors: string[];
  qrDotStyle: string;
  eyeStyle: string;
  frameStyle: string;
  backgroundType: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    cta: string;
  };
  fonts: string[];
  ctaSuggestions: string[];
  printFormats: string[];
  exportFormats: string[];
  customizable: string[];
  uxNotes: string[];
  seo: { name: string; description: string; keywords: string[] };
  accessibilityNotes: string;
  readabilityTarget: number;
}

const SECTOR_MAP: Record<string, string[]> = {
  'restaurant-menu': ['Restaurant', 'Cafe', 'Table Menu', 'Digital Menu', 'Hotel'],
  'business-card': ['Business Card', 'Corporate', 'Office', 'Reception', 'Agency'],
  wedding: ['Wedding', 'Event', 'Invitation', 'Flyer'],
  'event-registration': ['Event', 'Conference', 'Exhibition', 'Poster', 'Rollup'],
  'instagram-bio': ['Instagram', 'Retail', 'E-commerce', 'Sticker', 'Packaging'],
  'youtube-channel': ['Video', 'Education', 'Startup', 'Brochure'],
  portfolio: ['Portfolio', 'Agency', 'Startup', 'Creative', 'Exhibition'],
  'cv-resume': ['Resume', 'Education', 'Corporate', 'Recruitment'],
  'crypto-donate': ['Payment', 'Nonprofit', 'Event'],
  'real-estate': ['Real Estate', 'Construction', 'Flyer', 'Poster', 'Vehicle'],
  'wifi-guest': ['Wifi', 'Hotel', 'Cafe', 'Office', 'Reception'],
  'retail-stores': ['Retail', 'Product Packaging', 'Label', 'Sticker'],
  'hotels-hospitality': ['Hotel', 'Reception', 'Table Card', 'Landing Page'],
  'healthcare-clinics': ['Healthcare', 'Doctor', 'Clinic', 'Office'],
  'museums-venues': ['Museum', 'Exhibition', 'Education', 'Tourist Attraction'],
  'fitness-gyms': ['Fitness', 'Corporate', 'Poster'],
  'salon-spa': ['Beauty', 'Salon', 'Spa', 'Retail'],
  'nonprofit-fundraising': ['Nonprofit', 'Event', 'Flyer', 'Poster'],
  'dental-clinics': ['Dentist', 'Healthcare', 'Office', 'Reception'],
  'home-services': ['Construction', 'Vehicle', 'Flyer', 'Sticker'],
  'coffee-shops-cafes': ['Cafe', 'Restaurant', 'Table Menu', 'Loyalty'],
  'tourist-attractions': ['Museum', 'Exhibition', 'Poster', 'Landing Page'],
  'campus-institution': ['Education', 'Government', 'Office', 'Poster', 'Flyer'],
  'professional-services': ['Corporate', 'Office', 'Reception', 'Business Card', 'Agency'],
  'retail-grocery': ['Retail', 'Product Packaging', 'Label', 'Sticker', 'Flyer'],
  'entertainment-venue': ['Event', 'Exhibition', 'Poster', 'Rollup', 'Flyer'],
  'automotive-marine': ['Vehicle', 'Flyer', 'Poster', 'Sticker', 'Retail'],
  'property-facilities': ['Real Estate', 'Office', 'Reception', 'Flyer', 'Poster'],
  'specialty-healthcare': ['Healthcare', 'Doctor', 'Clinic', 'Office', 'Reception'],
  'family-community': ['Nonprofit', 'Event', 'Flyer', 'Poster', 'Education'],
  'mobile-vendor': ['Food Truck', 'Sticker', 'Flyer', 'Retail', 'Event'],
  'local-services-hub': ['Construction', 'Vehicle', 'Flyer', 'Sticker', 'Retail'],
};

const CTA_MAP: Record<string, string[]> = {
  'restaurant-menu': ['View Menu', 'Order Now', 'Scan Me'],
  'business-card': ['Contact Us', 'Scan Me', 'Call Now'],
  wedding: ['Join Event', 'RSVP', 'Scan Me'],
  'event-registration': ['Register', 'Join Event', 'Book Now'],
  'instagram-bio': ['Follow Us', 'Scan Me', 'See Product'],
  'youtube-channel': ['Subscribe', 'Watch Video', 'Scan Me'],
  portfolio: ['View Portfolio', 'Contact Us', 'Book Now'],
  'cv-resume': ['Download PDF', 'View Portfolio', 'Contact Us'],
  'crypto-donate': ['Donate', 'Pay Here', 'Scan Me'],
  'real-estate': ['View Listing', 'Book Now', 'Contact Us'],
  'wifi-guest': ['Connect WiFi', 'Scan Me'],
  'retail-stores': ['Shop Now', 'Get Offer', 'See Product'],
  'hotels-hospitality': ['Guest Info', 'View Menu', 'Connect WiFi'],
  'healthcare-clinics': ['Patient Portal', 'Book Now', 'Contact Us'],
  'museums-venues': ['Learn More', 'Get Tickets', 'Scan Me'],
  'fitness-gyms': ['Join Now', 'Book Now', 'View Schedule'],
  'salon-spa': ['Book Now', 'View Menu', 'Get Offer'],
  'nonprofit-fundraising': ['Donate', 'Join Event', 'Contact Us'],
  'dental-clinics': ['Book Now', 'Patient Care', 'Contact Us'],
  'home-services': ['Get Quote', 'Book Now', 'Call Now'],
  'coffee-shops-cafes': ['View Menu', 'Order Now', 'Get Offer'],
  'tourist-attractions': ['Get Tickets', 'Open Map', 'Learn More'],
  'campus-institution': ['Learn More', 'View Map', 'Scan Me'],
  'professional-services': ['Contact Us', 'Book Now', 'Scan Me'],
  'retail-grocery': ['Shop Now', 'View Menu', 'Get Offer'],
  'entertainment-venue': ['Get Tickets', 'Learn More', 'Scan Me'],
  'automotive-marine': ['Book Now', 'View Listing', 'Contact Us'],
  'property-facilities': ['Learn More', 'Book Now', 'Contact Us'],
  'specialty-healthcare': ['Book Now', 'Patient Care', 'Contact Us'],
  'family-community': ['Learn More', 'Donate', 'Join Event'],
  'mobile-vendor': ['Order Now', 'View Menu', 'Scan Me'],
  'local-services-hub': ['Book Now', 'Get Quote', 'Call Now'],
};

export function applyTemplateStyleStandards(style: Partial<QRStyleConfig>): Partial<QRStyleConfig> {
  const corner = style.cornerStyle ?? 'rounded';
  const fg = style.fgColor ?? '#000000';
  return {
    ...style,
    errorCorrection: style.errorCorrection ?? 'H',
    margin: Math.max(6, style.margin ?? 8),
    cornerDotStyle: style.cornerDotStyle ?? corner,
    frameColor: style.frameColor ?? fg,
    frameTextColor: style.frameTextColor ?? '#ffffff',
    logoSize: style.logoSize ?? 0.22,
    transparentBg: style.transparentBg ?? false,
  };
}

function inferDesignStyle(style: Partial<QRStyleConfig>): TemplateDesignProfile['designStyle'] {
  if (style.gradientEnabled) return 'premium';
  const fg = (style.fgColor ?? '').toLowerCase();
  if (fg === '#0f172a' || fg === '#1e293b') return 'corporate';
  if (['#9d174d', '#be185d', '#b91c1c'].includes(fg)) return 'luxury';
  if (style.dotStyle === 'square' && !style.gradientEnabled) return 'minimal';
  if (['#166534', '#15803d', '#92400e'].includes(fg)) return 'organic';
  if (['#4f46e5', '#0369a1', '#0891b2'].includes(fg)) return 'tech';
  return 'modern';
}

function inferBackground(style: Partial<QRStyleConfig>): string {
  if (style.transparentBg) return 'Transparent';
  if (style.gradientEnabled) return 'Gradient';
  const bg = (style.bgColor ?? '#ffffff').toLowerCase();
  if (bg === '#0f172a' || bg === '#000000') return 'Dark Mode';
  if (bg === '#ffffff' || bg === '#fff') return 'Light Mode';
  return 'Light Mode';
}

export function buildDesignProfile(template: TemplateForDesign): TemplateDesignProfile {
  const style = applyTemplateStyleStandards(template.style);
  const scan = computeScannability(style);
  const primary = style.fgColor ?? '#000000';
  const background = style.bgColor ?? '#ffffff';
  const accent = style.gradientColor2 ?? template.landingPage?.accentColor ?? primary;

  return {
    designStyle: inferDesignStyle(style),
    targetSectors: SECTOR_MAP[template.id] ?? ['Corporate', 'Flyer', 'Poster'],
    qrDotStyle: style.dotStyle ?? 'rounded',
    eyeStyle: style.cornerStyle ?? 'rounded',
    frameStyle: style.frameStyle ?? 'none',
    backgroundType: inferBackground(style),
    colors: {
      primary,
      secondary: accent,
      accent: template.landingPage?.accentColor ?? accent,
      background,
      text: primary,
      cta: template.landingPage?.accentColor ?? primary,
    },
    fonts: ['Inter', 'DM Sans', 'Plus Jakarta Sans'],
    ctaSuggestions: CTA_MAP[template.id] ?? ['Scan Me', 'Learn More', 'Open Website'],
    printFormats: ['A4', 'A5', 'Desk Stand', 'Sticker', 'Table Card', 'Rollup'],
    exportFormats: ['SVG', 'PNG', 'PDF'],
    customizable: [
      'Logo',
      'Colors',
      'Frame',
      'QR Shape',
      'Eye Shape',
      'CTA Text',
      'Margin',
      'Gradient',
    ],
    uxNotes: [
      'Quiet zone margin ≥ 6 modules for reliable scanning.',
      'Error correction H recommended for print and logo embed.',
      `Scannability grade ${scan.grade} (${scan.score}/100) — target ≥ 90.`,
      'Test scan at final print size before bulk production.',
    ],
    seo: {
      name: `${template.name} QR Code Template`,
      description: template.description,
      keywords: [
        `${template.name.toLowerCase()} QR code`,
        'professional QR template',
        'custom QR design',
        ...template.useCases.map((u) => `${u.toLowerCase()} QR`),
      ].slice(0, 8),
    },
    accessibilityNotes:
      scan.score >= 75
        ? 'WCAG-friendly contrast for QR modules; frame CTA should stay ≥ 4.5:1 against frame background.'
        : 'Increase contrast between QR dots and background before print — current palette may fail outdoor scans.',
    readabilityTarget: Math.max(90, scan.score),
  };
}

export interface TemplateAuditResult {
  id: string;
  name: string;
  scannabilityScore: number;
  scannabilityGrade: string;
  passesMasterPrompt: boolean;
  gaps: string[];
}

export function auditIndustryTemplate(template: TemplateForDesign & { name: string }): TemplateAuditResult {
  const style = applyTemplateStyleStandards(template.style);
  const scan = computeScannability(style);
  const gaps: string[] = [];

  if ((style.margin ?? 0) < 6) gaps.push('Quiet zone margin below 6 modules');
  if (style.errorCorrection !== 'H') gaps.push('Error correction should be H for print');
  if (!style.frameText && style.frameStyle && style.frameStyle !== 'none') {
    gaps.push('Frame present but no CTA frame text');
  }
  if (!template.landingPage?.enabled && template.category === 'url') {
    gaps.push('No branded landing page — lower conversion on mobile');
  }
  if (scan.score < 75) gaps.push('Scannability score below B grade');

  return {
    id: template.id,
    name: template.name,
    scannabilityScore: scan.score,
    scannabilityGrade: scan.grade,
    passesMasterPrompt: gaps.length === 0 && scan.score >= 75,
    gaps,
  };
}
