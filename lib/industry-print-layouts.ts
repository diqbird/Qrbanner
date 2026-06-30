import type { PrintTemplateId } from '@/lib/print-banner';

export interface IndustryPrintLayout {
  recommended: PrintTemplateId;
  alternates: PrintTemplateId[];
  /** Suggested banner headline when exporting */
  headline?: string;
  /** Suggested subtitle line */
  subtitle?: string;
  /** Minimum QR print size in cm for reliable scans */
  minPrintCm: number;
  notes: string;
}

/** Industry template id → recommended print formats */
export const INDUSTRY_PRINT_LAYOUT_MAP: Record<string, IndustryPrintLayout> = {
  'restaurant-menu': {
    recommended: 'desk-stand',
    alternates: ['table-card', 'a5-flyer', 'sticker'],
    headline: 'Scan for Menu',
    subtitle: 'View our digital menu on your phone',
    minPrintCm: 3,
    notes: 'Table tents work best at 3×3 cm QR minimum. Use desk stand for fold-and-display.',
  },
  'business-card': {
    recommended: 'business-card',
    alternates: ['sticker', 'a5-flyer'],
    headline: 'Save Contact',
    subtitle: 'Scan to add to your phone',
    minPrintCm: 2,
    notes: 'Business card layout — QR on back or corner. Keep QR at least 2 cm.',
  },
  wedding: {
    recommended: 'a5-flyer',
    alternates: ['desk-stand', 'table-card'],
    headline: 'You\'re Invited',
    subtitle: 'Scan for details & RSVP',
    minPrintCm: 2.5,
    notes: 'A5 inserts for invitations; table cards for reception seating.',
  },
  'event-registration': {
    recommended: 'rollup',
    alternates: ['a4-portrait', 'a5-flyer', 'desk-stand'],
    headline: 'Register Now',
    subtitle: 'Scan to sign up — limited seats',
    minPrintCm: 4,
    notes: 'Roll-up for venue entrances; A4 posters for concourse placement.',
  },
  'instagram-bio': {
    recommended: 'sticker',
    alternates: ['story', 'business-card'],
    headline: 'Follow Us',
    subtitle: 'Scan for Instagram profile',
    minPrintCm: 2,
    notes: 'Stickers on packaging and retail displays; story format for social.',
  },
  'youtube-channel': {
    recommended: 'story',
    alternates: ['sticker', 'a5-flyer'],
    headline: 'Subscribe',
    subtitle: 'Scan to watch & subscribe',
    minPrintCm: 2.5,
    notes: 'Vertical story layout for video outros and merch inserts.',
  },
  portfolio: {
    recommended: 'business-card',
    alternates: ['a5-flyer', 'desk-stand'],
    headline: 'View Portfolio',
    subtitle: 'Selected work & case studies',
    minPrintCm: 2,
    notes: 'Business card for networking; A5 for exhibition handouts.',
  },
  'cv-resume': {
    recommended: 'a5-flyer',
    alternates: ['business-card', 'desk-stand'],
    headline: 'My CV',
    subtitle: 'Scan to download PDF resume',
    minPrintCm: 2.5,
    notes: 'A5 handout at job fairs; QR on resume header.',
  },
  'crypto-donate': {
    recommended: 'sticker',
    alternates: ['table-card', 'a5-flyer'],
    headline: 'Donate',
    subtitle: 'Scan wallet address — no typos',
    minPrintCm: 3,
    notes: 'High contrast sticker for tip jars and event booths.',
  },
  'real-estate': {
    recommended: 'a4-portrait',
    alternates: ['a4-landscape', 'sticker'],
    headline: 'View Listing',
    subtitle: 'Photos, floor plan & open house',
    minPrintCm: 4,
    notes: 'Yard signs: A4 landscape or portrait at 4+ cm QR for drive-by scans.',
  },
  'wifi-guest': {
    recommended: 'sticker',
    alternates: ['table-card', 'desk-stand'],
    headline: 'Guest Wi‑Fi',
    subtitle: 'Scan to connect automatically',
    minPrintCm: 3,
    notes: 'Lobby sticker or small table card — static Wi‑Fi QR, no frame needed.',
  },
  'retail-stores': {
    recommended: 'sticker',
    alternates: ['a5-flyer', 'table-card'],
    headline: 'Shop Now',
    subtitle: 'Product info & limited offers',
    minPrintCm: 2,
    notes: 'Shelf labels from 2 cm; sticker format for packaging.',
  },
  'hotels-hospitality': {
    recommended: 'desk-stand',
    alternates: ['table-card', 'a5-flyer'],
    headline: 'Guest Information',
    subtitle: 'Wi‑Fi, menu & local guide',
    minPrintCm: 3,
    notes: 'Room tent cards and lobby desk stands — fold at dashed line.',
  },
  'healthcare-clinics': {
    recommended: 'desk-stand',
    alternates: ['a5-flyer', 'table-card'],
    headline: 'Patient Portal',
    subtitle: 'Forms, booking & care instructions',
    minPrintCm: 3,
    notes: 'Waiting room desk stand; A5 for intake instructions.',
  },
  'museums-venues': {
    recommended: 'a5-flyer',
    alternates: ['sticker', 'a4-portrait'],
    headline: 'Exhibit Guide',
    subtitle: 'Audio, video & extended content',
    minPrintCm: 2.5,
    notes: 'Exhibit labels: sticker 2.5 cm+ at arm\'s length.',
  },
  'fitness-gyms': {
    recommended: 'desk-stand',
    alternates: ['a4-portrait', 'story'],
    headline: 'Class Schedule',
    subtitle: 'Book your next session',
    minPrintCm: 3,
    notes: 'Lobby desk stand for weekly schedule updates.',
  },
  'salon-spa': {
    recommended: 'table-card',
    alternates: ['desk-stand', 'sticker'],
    headline: 'Book Now',
    subtitle: 'Services, stylists & offers',
    minPrintCm: 2.5,
    notes: 'Mirror cling size — compact table card works on reception.',
  },
  'nonprofit-fundraising': {
    recommended: 'a5-flyer',
    alternates: ['desk-stand', 'rollup'],
    headline: 'Support Our Mission',
    subtitle: 'Every gift makes a difference',
    minPrintCm: 3,
    notes: 'Gala table tents and event posters; roll-up for venue entry.',
  },
  'dental-clinics': {
    recommended: 'table-card',
    alternates: ['desk-stand', 'a5-flyer'],
    headline: 'Patient Care',
    subtitle: 'Intake, booking & aftercare',
    minPrintCm: 2.5,
    notes: 'Chairside and reception counter cards.',
  },
  'home-services': {
    recommended: 'a4-landscape',
    alternates: ['sticker', 'a5-flyer'],
    headline: 'Request Service',
    subtitle: 'Fast estimates & seasonal offers',
    minPrintCm: 4,
    notes: 'Yard signs and truck decals — landscape A4 at 4+ cm QR.',
  },
  'coffee-shops-cafes': {
    recommended: 'table-card',
    alternates: ['desk-stand', 'sticker'],
    headline: 'Today\'s Menu',
    subtitle: 'Seasonal drinks & loyalty rewards',
    minPrintCm: 2.5,
    notes: 'Counter tent and table cards; sticker for cup sleeves.',
  },
  'tourist-attractions': {
    recommended: 'a4-portrait',
    alternates: ['a5-flyer', 'rollup'],
    headline: 'Plan Your Visit',
    subtitle: 'Tickets, maps & audio guides',
    minPrintCm: 4,
    notes: 'Entrance signage — large QR for outdoor foot traffic.',
  },
  'campus-institution': {
    recommended: 'a4-portrait',
    alternates: ['a5-flyer', 'desk-stand', 'sticker'],
    headline: 'Campus Services',
    subtitle: 'Maps, dining & student resources',
    minPrintCm: 3,
    notes: 'Building placards and lobby posters; bulk CSV per room.',
  },
  'professional-services': {
    recommended: 'business-card',
    alternates: ['a5-flyer', 'desk-stand'],
    headline: 'Client Portal',
    subtitle: 'Intake forms & secure documents',
    minPrintCm: 2,
    notes: 'Lobby signage and professional mailers.',
  },
  'retail-grocery': {
    recommended: 'sticker',
    alternates: ['a5-flyer', 'table-card'],
    headline: 'Shop Specials',
    subtitle: 'Weekly deals & loyalty',
    minPrintCm: 2,
    notes: 'Shelf talkers and entrance signs.',
  },
  'entertainment-venue': {
    recommended: 'a4-portrait',
    alternates: ['rollup', 'desk-stand', 'story'],
    headline: 'Get Tickets',
    subtitle: 'Showtimes, merch & events',
    minPrintCm: 3,
    notes: 'Lobby posters and event standees.',
  },
  'automotive-marine': {
    recommended: 'a4-landscape',
    alternates: ['sticker', 'business-card'],
    headline: 'View Details',
    subtitle: 'Inventory, service & marina info',
    minPrintCm: 4,
    notes: 'Window stickers and dock signage.',
  },
  'property-facilities': {
    recommended: 'desk-stand',
    alternates: ['a5-flyer', 'sticker', 'table-card'],
    headline: 'Building Portal',
    subtitle: 'Tenant & member services',
    minPrintCm: 3,
    notes: 'Lobby desk stands and dock labels.',
  },
  'specialty-healthcare': {
    recommended: 'table-card',
    alternates: ['desk-stand', 'a5-flyer'],
    headline: 'Patient Care',
    subtitle: 'Intake & appointment booking',
    minPrintCm: 2.5,
    notes: 'Reception counter cards.',
  },
  'family-community': {
    recommended: 'a5-flyer',
    alternates: ['desk-stand', 'table-card'],
    headline: 'Welcome',
    subtitle: 'Enrollment & community updates',
    minPrintCm: 3,
    notes: 'Lobby signs and bulletin inserts.',
  },
  'mobile-vendor': {
    recommended: 'sticker',
    alternates: ['table-card', 'story'],
    headline: 'Today\'s Menu',
    subtitle: 'Order from your phone',
    minPrintCm: 2.5,
    notes: 'Truck window sticker — update location on landing.',
  },
  'local-services-hub': {
    recommended: 'a4-landscape',
    alternates: ['sticker', 'business-card', 'table-card'],
    headline: 'Book Now',
    subtitle: 'Appointments & service requests',
    minPrintCm: 3,
    notes: 'Storefront and vehicle decals.',
  },
};

export function getPrintLayoutForIndustry(industryTemplateId: string): IndustryPrintLayout | undefined {
  return INDUSTRY_PRINT_LAYOUT_MAP[industryTemplateId];
}

export function getOrderedPrintTemplatesForIndustry(
  industryTemplateId: string
): { id: PrintTemplateId; recommended: boolean }[] {
  const layout = INDUSTRY_PRINT_LAYOUT_MAP[industryTemplateId];
  if (!layout) return [];
  const ids = [layout.recommended, ...layout.alternates.filter((id) => id !== layout.recommended)];
  return ids.map((id) => ({ id, recommended: id === layout.recommended }));
}
