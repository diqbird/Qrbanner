import type { QRStyleConfig } from '@/lib/qr-style';
import type { LandingPageData, LeadFormConfig } from '@/lib/landing-page';

export type TemplateFieldType =
  | 'text'
  | 'url'
  | 'email'
  | 'phone'
  | 'textarea'
  | 'datetime'
  | 'select'
  | 'number';

export interface TemplateFieldDef {
  key: string;
  label: string;
  placeholder?: string;
  hint?: string;
  type?: TemplateFieldType;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export interface TemplateSection {
  id: string;
  title: string;
  description: string;
  fields: TemplateFieldDef[];
}

export interface IndustryTemplate {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  useCases: string[];
  suggestedQrName: string;
  qrData: Record<string, string>;
  style: Partial<QRStyleConfig>;
  sections: TemplateSection[];
  tips: string[];
  landingPage?: Omit<Partial<LandingPageData>, 'leadForm'> & {
    enabled?: boolean;
    leadFormEnabled?: boolean;
    leadForm?: Partial<LeadFormConfig>;
  };
}

export const INDUSTRY_TEMPLATES: IndustryTemplate[] = [
  {
    id: 'restaurant-menu',
    name: 'Restaurant & Café',
    category: 'menu',
    tagline: 'Table-side digital menu — no reprint when prices change',
    description: 'QR on tables, counters and takeaway bags linking to your live menu.',
    useCases: ['Table tents', 'Window stickers', 'Delivery packaging', 'Room service cards'],
    suggestedQrName: 'Table Menu — Main Dining',
    qrData: { url: 'https://yourrestaurant.com/menu' },
    style: {
      fgColor: '#b45309',
      bgColor: '#fffbeb',
      dotStyle: 'rounded',
      cornerStyle: 'extra-rounded',
      frameStyle: 'badge',
      frameText: 'VIEW MENU',
      gradientEnabled: true,
      gradientColor2: '#f59e0b',
      errorCorrection: 'H',
    },
    sections: [
      {
        id: 'venue',
        title: 'Venue & brand',
        description: 'How guests recognize you before they open the menu.',
        fields: [
          {
            key: '_venueName',
            label: 'Restaurant name',
            placeholder: 'e.g. The Garden Bistro',
            hint: 'Used for QR name and landing page — not encoded in the menu link.',
            type: 'text',
          },
        ],
      },
      {
        id: 'menu-link',
        title: 'Menu destination',
        description: 'Link to your digital menu (website, PDF, or menu platform).',
        fields: [
          {
            key: 'url',
            label: 'Menu URL',
            placeholder: 'https://yourrestaurant.com/menu',
            hint: 'Mobile-friendly page with allergens, prices and daily specials.',
            type: 'url',
            required: true,
          },
        ],
      },
      {
        id: 'service',
        title: 'Service extras',
        description: 'Paths guests often need from the same campaign.',
        fields: [
          {
            key: '_wifiNote',
            label: 'Wi‑Fi note (optional)',
            placeholder: 'Ask staff for Wi‑Fi — or add a separate WiFi QR',
            type: 'text',
          },
          {
            key: '_reservationUrl',
            label: 'Reservations link (optional)',
            placeholder: 'https://opentable.com/...',
            hint: 'Add to landing page or use schedule routing for lunch vs dinner.',
            type: 'url',
          },
        ],
      },
    ],
    tips: [
      'Print at least 3×3 cm on table tents.',
      'Enable time-based routing for lunch / dinner menus.',
      'Use lead capture on landing for reservation requests.',
      'UTM: source=qr_menu, medium=print.',
    ],
    landingPage: {
      enabled: true,
      template: 'restaurant',
      title: "Today's Menu",
      subtitle: 'Allergens, daily specials & drinks list',
      accentColor: '#b45309',
      ctaLabel: 'Open Menu',
    },
  },

  {
    id: 'business-card',
    name: 'Business Card',
    category: 'vcard',
    tagline: 'One scan saves your full contact to their phone',
    description: 'Always up-to-date phone, email and role — no reprint.',
    useCases: ['Conference badge', 'Email signature', 'Office door', 'LinkedIn banner'],
    suggestedQrName: 'Contact — Your Name',
    qrData: {
      firstName: '',
      lastName: '',
      title: '',
      org: '',
      phone: '',
      email: '',
      website: '',
      address: '',
    },
    style: {
      fgColor: '#1e293b',
      bgColor: '#ffffff',
      dotStyle: 'classy',
      cornerStyle: 'classy',
      frameStyle: 'rounded',
      errorCorrection: 'H',
    },
    sections: [
      {
        id: 'personal',
        title: 'Personal details',
        description: 'Name and role on the saved contact card.',
        fields: [
          { key: 'firstName', label: 'First name', placeholder: 'Ayşe', required: true, type: 'text' },
          { key: 'lastName', label: 'Last name', placeholder: 'Yılmaz', required: true, type: 'text' },
          { key: 'title', label: 'Job title', placeholder: 'Sales Director', type: 'text' },
        ],
      },
      {
        id: 'company',
        title: 'Company',
        description: 'Organization name and website.',
        fields: [
          { key: 'org', label: 'Company name', placeholder: 'Acme Teknoloji A.Ş.', type: 'text' },
          { key: 'website', label: 'Website', placeholder: 'https://company.com', type: 'url' },
        ],
      },
      {
        id: 'reach',
        title: 'Contact channels',
        description: 'Mobile-first — include country code.',
        fields: [
          { key: 'phone', label: 'Phone', placeholder: '+90 532 000 00 00', type: 'phone', required: true },
          { key: 'email', label: 'Email', placeholder: 'you@company.com', type: 'email', required: true },
        ],
      },
      {
        id: 'location',
        title: 'Office address (optional)',
        description: 'Helps maps and navigation apps.',
        fields: [
          { key: 'address', label: 'Address', placeholder: 'Levent, Istanbul', type: 'textarea' },
        ],
      },
    ],
    tips: [
      'vCard is static — reprint only when phone or role changes.',
      'Use error correction H with a center logo.',
      'Add a dynamic URL QR on the back for your latest portfolio.',
    ],
  },

  {
    id: 'wedding',
    name: 'Wedding',
    category: 'url',
    tagline: 'Invitation, RSVP and details — dynamic link, no reprint',
    description: 'Landing page with RSVP form; optional redirect to registry or gallery.',
    useCases: ['Printed invitation', 'Table cards', 'Save-the-date', 'Thank-you cards'],
    suggestedQrName: 'Wedding — Names & Date',
    qrData: {
      url: 'https://yourwedding.com/details',
      title: '',
      location: '',
      description: '',
      startDate: '',
      endDate: '',
      _registryUrl: '',
    },
    style: {
      fgColor: '#9d174d',
      bgColor: '#fdf2f8',
      dotStyle: 'classy-rounded',
      cornerStyle: 'extra-rounded',
      gradientEnabled: true,
      gradientColor2: '#f472b6',
      frameStyle: 'badge',
      frameText: 'OPEN INVITE',
    },
    sections: [
      {
        id: 'couple',
        title: 'Couple & message',
        description: 'Headline on calendars and reminders.',
        fields: [
          { key: 'title', label: 'Event title', placeholder: 'Elif & Mehmet — Wedding', required: true, type: 'text' },
          { key: 'description', label: 'Invitation message', placeholder: 'Join us as we celebrate. Formal attire.', type: 'textarea' },
        ],
      },
      {
        id: 'when',
        title: 'Date & time',
        description: 'Ceremony start; end time optional for reception.',
        fields: [
          { key: 'startDate', label: 'Ceremony start', type: 'datetime', required: true },
          { key: 'endDate', label: 'Reception end (optional)', type: 'datetime' },
        ],
      },
      {
        id: 'where',
        title: 'Venue',
        description: 'Full venue name and city for maps.',
        fields: [
          { key: 'location', label: 'Venue & address', placeholder: 'Garden Venue, Bebek, Istanbul', required: true, type: 'text' },
        ],
      },
      {
        id: 'rsvp',
        title: 'RSVP & redirect',
        description: 'Landing page collects RSVPs; optional link after confirmation.',
        fields: [
          {
            key: 'url',
            label: 'After-RSVP link (optional)',
            placeholder: 'https://yourwedding.com/gallery',
            hint: 'Guests see RSVP form first, then continue here. Leave default for details-only.',
            type: 'url',
          },
          { key: '_registryUrl', label: 'Gift registry URL (optional)', placeholder: 'https://...', type: 'url' },
        ],
      },
    ],
    tips: [
      'Dynamic QR — update registry or gallery link without reprinting.',
      'Landing + lead form collects RSVP (name, email, guest count).',
      'Add event date/time in fields above for landing subtitle.',
      'Test print contrast with scannability score.',
    ],
    landingPage: {
      enabled: true,
      template: 'event',
      title: "You're Invited",
      subtitle: 'Please confirm your attendance',
      accentColor: '#9d174d',
      ctaLabel: 'View Details & RSVP',
      leadFormEnabled: true,
      leadForm: {
        collectName: true,
        collectEmail: true,
        collectPhone: true,
        collectMessage: true,
        requiredEmail: true,
      },
    },
  },

  {
    id: 'event-registration',
    name: 'Conference & Event',
    category: 'url',
    tagline: 'Scan to register — posters, badges and slides',
    description: 'Trade shows, meetups, webinars and corporate events.',
    useCases: ['Roll-up banner', 'Badge lanyard', 'Email campaign', 'Last slide'],
    suggestedQrName: 'Event Registration 2026',
    qrData: {
      url: 'https://yoursevent.com/register',
      _eventName: '',
      _eventDate: '',
      _venue: '',
      _agendaUrl: '',
    },
    style: {
      fgColor: '#4f46e5',
      bgColor: '#eef2ff',
      dotStyle: 'rounded',
      frameStyle: 'scan-me',
      frameText: 'REGISTER',
      gradientEnabled: true,
      gradientColor2: '#6366f1',
    },
    sections: [
      {
        id: 'event-info',
        title: 'Event identity',
        description: 'Name and date on landing page.',
        fields: [
          { key: '_eventName', label: 'Event name', placeholder: 'Product Summit 2026', type: 'text' },
          { key: '_eventDate', label: 'Date(s)', placeholder: '15–16 June 2026, Istanbul', type: 'text' },
        ],
      },
      {
        id: 'registration',
        title: 'Registration link',
        description: 'Ticket platform or signup page.',
        fields: [
          {
            key: 'url',
            label: 'Registration URL',
            placeholder: 'https://eventbrite.com/...',
            hint: 'UTM: source=qr_poster, medium=print',
            type: 'url',
            required: true,
          },
        ],
      },
      {
        id: 'venue',
        title: 'Venue & agenda',
        description: 'Where or how attendees join.',
        fields: [
          { key: '_venue', label: 'Venue / platform', placeholder: 'ICC Istanbul / Zoom', type: 'text' },
          { key: '_agendaUrl', label: 'Agenda URL (optional)', placeholder: 'https://yoursevent.com/agenda', type: 'url' },
        ],
      },
    ],
    tips: [
      'A/B test two registration pages.',
      'Schedule QR to go live on announcement day.',
      'Enable GA4 pixel for poster-to-signup tracking.',
    ],
    landingPage: {
      enabled: true,
      template: 'event',
      title: 'Register Now',
      subtitle: 'Limited seats — secure your spot',
      accentColor: '#4f46e5',
      ctaLabel: 'Sign Up',
      leadFormEnabled: true,
      leadForm: { collectName: true, collectEmail: true, requiredEmail: true },
    },
  },

  {
    id: 'instagram-bio',
    name: 'Instagram',
    category: 'instagram',
    tagline: 'Offline to profile — packaging, store, events',
    description: 'Drive scans to your Instagram profile or campaign.',
    useCases: ['Product box', 'Store window', 'Flyer', 'Photo wall'],
    suggestedQrName: 'Instagram — @yourbrand',
    qrData: { username: '', _campaign: '', _highlight: '' },
    style: {
      fgColor: '#c13584',
      bgColor: '#ffffff',
      gradientEnabled: true,
      gradientColor2: '#f56040',
      dotStyle: 'dots',
      frameStyle: 'badge',
      frameText: 'FOLLOW US',
    },
    sections: [
      {
        id: 'profile',
        title: 'Instagram profile',
        description: 'Username without @ — opens instagram.com/username',
        fields: [
          {
            key: 'username',
            label: 'Username',
            placeholder: 'yourbrand',
            required: true,
            type: 'text',
          },
        ],
      },
      {
        id: 'campaign',
        title: 'Campaign tracking',
        description: 'Know which print piece drove follows.',
        fields: [
          { key: '_campaign', label: 'Campaign label', placeholder: 'Summer collection box', type: 'text' },
          { key: '_highlight', label: 'Highlight to promote', placeholder: 'New arrivals / Menu', type: 'text' },
        ],
      },
    ],
    tips: [
      'Dynamic short link → change to a specific post later.',
      'NFC stickers: add ?src=nfc for source analytics.',
      'Match gradient to Instagram brand colors.',
    ],
  },

  {
    id: 'youtube-channel',
    name: 'YouTube',
    category: 'youtube',
    tagline: 'Print and packaging → subscribers',
    description: 'Channel, playlist or latest video.',
    useCases: ['Video outro', 'Merch box', 'Course handout', 'Slide deck'],
    suggestedQrName: 'YouTube — Channel',
    qrData: { username: '', url: '', _ctaText: '' },
    style: {
      fgColor: '#ff0000',
      bgColor: '#ffffff',
      dotStyle: 'rounded',
      frameStyle: 'badge',
      frameText: 'SUBSCRIBE',
      errorCorrection: 'H',
    },
    sections: [
      {
        id: 'channel',
        title: 'Channel or video',
        description: 'Handle for channel, or URL for one video/playlist.',
        fields: [
          { key: 'username', label: 'Channel handle', placeholder: '@yourchannel', type: 'text' },
          { key: 'url', label: 'Or video / playlist URL', placeholder: 'https://youtube.com/watch?v=...', type: 'url' },
        ],
      },
      {
        id: 'cta',
        title: 'Printed call-to-action',
        description: 'Line next to the QR on your material.',
        fields: [
          { key: '_ctaText', label: 'CTA text', placeholder: 'Scan to subscribe & watch tutorials', type: 'text' },
        ],
      },
    ],
    tips: [
      'Link to onboarding playlist for new viewers.',
      'Update redirect to latest video without reprinting.',
      'Red on white scans best — test on dark backgrounds.',
    ],
  },

  {
    id: 'portfolio',
    name: 'Portfolio & Creative',
    category: 'url',
    tagline: 'Show work and capture project leads',
    description: 'Designers, photographers, agencies.',
    useCases: ['Exhibition plaque', 'Freelance deck', 'Behance supplement', 'Creative CV'],
    suggestedQrName: 'Portfolio — Your Name',
    qrData: {
      url: 'https://yourportfolio.com',
      _headline: '',
      _specialty: '',
      _calendly: '',
    },
    style: {
      fgColor: '#0f172a',
      bgColor: '#f8fafc',
      dotStyle: 'extra-rounded',
      cornerStyle: 'classy-rounded',
      gradientEnabled: true,
      gradientColor2: '#64748b',
      frameStyle: 'rounded',
    },
    sections: [
      {
        id: 'work',
        title: 'Portfolio link',
        description: 'Behance, Dribbble, Notion or personal site.',
        fields: [
          { key: 'url', label: 'Portfolio URL', placeholder: 'https://behance.net/yourname', required: true, type: 'url' },
        ],
      },
      {
        id: 'positioning',
        title: 'Your positioning',
        description: 'Landing page headline before redirect.',
        fields: [
          { key: '_headline', label: 'Headline', placeholder: 'Brand & UI Designer', type: 'text' },
          { key: '_specialty', label: 'Specialty', placeholder: 'Fintech, SaaS, packaging', type: 'text' },
        ],
      },
      {
        id: 'contact',
        title: 'Book a call',
        description: 'Optional scheduling link on landing.',
        fields: [
          { key: '_calendly', label: 'Booking URL', placeholder: 'https://calendly.com/you', type: 'url' },
        ],
      },
    ],
    tips: [
      'Lead form: name, email, project type.',
      'Password-protect confidential client work.',
      'Transparent PNG on dark exhibition walls.',
    ],
    landingPage: {
      enabled: true,
      template: 'business',
      title: 'View My Work',
      subtitle: 'Selected projects & case studies',
      accentColor: '#0f172a',
      ctaLabel: 'Open Portfolio',
      leadFormEnabled: true,
      leadForm: {
        collectName: true,
        collectEmail: true,
        collectMessage: true,
        requiredEmail: true,
      },
    },
  },

  {
    id: 'cv-resume',
    name: 'CV & Resume',
    category: 'pdf',
    tagline: 'Recruiters open your latest CV in one scan',
    description: 'Update PDF link each season — same printed QR.',
    useCases: ['Job fair', 'Resume header', 'Networking', 'LinkedIn featured'],
    suggestedQrName: 'CV — Your Name 2026',
    qrData: {
      url: 'https://yoursite.com/cv.pdf',
      _fullName: '',
      _role: '',
      _linkedin: '',
    },
    style: {
      fgColor: '#0369a1',
      bgColor: '#ffffff',
      dotStyle: 'square',
      frameStyle: 'badge',
      frameText: 'MY CV',
    },
    sections: [
      {
        id: 'document',
        title: 'CV document',
        description: 'PDF on Drive, Dropbox or your site.',
        fields: [
          {
            key: 'url',
            label: 'CV URL',
            placeholder: 'https://yoursite.com/cv.pdf',
            hint: 'Dynamic QR — swap file without reprinting.',
            required: true,
            type: 'url',
          },
        ],
      },
      {
        id: 'profile',
        title: 'Professional summary',
        description: 'Shown on landing before PDF opens.',
        fields: [
          { key: '_fullName', label: 'Full name', placeholder: 'Can Demir', type: 'text' },
          { key: '_role', label: 'Target role', placeholder: 'Senior Product Manager', type: 'text' },
          { key: '_linkedin', label: 'LinkedIn (optional)', placeholder: 'https://linkedin.com/in/...', type: 'url' },
        ],
      },
    ],
    tips: [
      'Name QR "CV 2026" and archive old versions.',
      'Scan spike before interview = they opened your file.',
      'Pair with vCard QR on networking cards.',
    ],
    landingPage: {
      enabled: true,
      template: 'minimal',
      title: 'Professional CV',
      subtitle: 'Download PDF — updated 2026',
      accentColor: '#0369a1',
      ctaLabel: 'Download CV',
    },
  },

  {
    id: 'crypto-donate',
    name: 'Crypto & Donations',
    category: 'crypto',
    tagline: 'BTC or ETH receive address — no typos',
    description: 'Tips, donations, charity — static wallet QR.',
    useCases: ['Streamer tip', 'Charity poster', 'Artist jar', 'Event sponsorship'],
    suggestedQrName: 'Donate — BTC Wallet',
    qrData: { coin: 'btc', address: '', amount: '', _purpose: '' },
    style: {
      fgColor: '#f59e0b',
      bgColor: '#0f172a',
      dotStyle: 'square',
      errorCorrection: 'H',
      frameStyle: 'badge',
      frameText: 'DONATE',
    },
    sections: [
      {
        id: 'network',
        title: 'Network & asset',
        description: 'Wrong network = lost funds. Verify before print.',
        fields: [
          {
            key: 'coin',
            label: 'Cryptocurrency',
            type: 'select',
            options: [
              { value: 'btc', label: 'Bitcoin (BTC)' },
              { value: 'eth', label: 'Ethereum (ETH)' },
            ],
            required: true,
          },
        ],
      },
      {
        id: 'wallet',
        title: 'Wallet address',
        description: 'Public receive address only — never seed phrase.',
        fields: [
          { key: 'address', label: 'Address', placeholder: 'bc1q... or 0x...', required: true, type: 'text' },
        ],
      },
      {
        id: 'amount',
        title: 'Suggested amount',
        description: 'Optional pre-fill in compatible wallets.',
        fields: [
          { key: 'amount', label: 'Amount', placeholder: '0.001', type: 'text' },
          { key: '_purpose', label: 'Purpose', placeholder: 'Support our community garden', type: 'text' },
        ],
      },
    ],
    tips: [
      'Static QR — new address needs new print.',
      'Error correction H + high contrast on dark bg.',
      'Test with a small send first.',
    ],
  },

  {
    id: 'real-estate',
    name: 'Real Estate Listing',
    category: 'url',
    tagline: 'Yard sign → listing → viewing request',
    description: 'Sales, rentals and open houses with lead capture.',
    useCases: ['For-sale sign', 'Open house flyer', 'Broker card', 'Rental ad'],
    suggestedQrName: 'Listing — Street Address',
    qrData: {
      url: 'https://youragency.com/listing/123',
      _address: '',
      _price: '',
      _specs: '',
      _openHouse: '',
      _agentPhone: '',
    },
    style: {
      fgColor: '#166534',
      bgColor: '#f0fdf4',
      dotStyle: 'rounded',
      frameStyle: 'scan-me',
      frameText: 'VIEW HOME',
      gradientEnabled: true,
      gradientColor2: '#22c55e',
    },
    sections: [
      {
        id: 'listing',
        title: 'Listing page',
        description: 'Photos, price, floor plan and specs.',
        fields: [
          { key: 'url', label: 'Listing URL', placeholder: 'https://agency.com/ilan/kadikoy-3-1', required: true, type: 'url' },
        ],
      },
      {
        id: 'property',
        title: 'Property snapshot',
        description: 'Quick reference for landing page.',
        fields: [
          { key: '_address', label: 'Address', placeholder: '123 Main Street, Brooklyn, NY', type: 'text' },
          { key: '_price', label: 'Price', placeholder: '$425,000', type: 'text' },
          { key: '_specs', label: 'Specs', placeholder: '3+1 · 120 m² · 5th floor', type: 'text' },
        ],
      },
      {
        id: 'viewing',
        title: 'Open house & agent',
        description: 'Viewing times and direct contact.',
        fields: [
          { key: '_openHouse', label: 'Open house', placeholder: 'Sat 14:00–17:00', type: 'text' },
          { key: '_agentPhone', label: 'Agent phone', placeholder: '+90 532 ...', type: 'phone' },
        ],
      },
    ],
    tips: [
      'Lead form: name, phone, preferred viewing time.',
      'Geofence for TR vs international buyers.',
      'Update URL when price drops — same sign QR.',
      'NFC brochure for high-intent buyers.',
    ],
    landingPage: {
      enabled: true,
      template: 'business',
      title: 'Property Tour',
      subtitle: 'Photos, floor plan & neighborhood',
      accentColor: '#166534',
      ctaLabel: 'View Listing',
      leadFormEnabled: true,
      leadForm: {
        collectName: true,
        collectEmail: true,
        collectPhone: true,
        collectMessage: true,
        requiredEmail: false,
      },
    },
  },
];

export function stripMetaFields(data: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(data)) {
    if (!k.startsWith('_')) out[k] = v;
  }
  return out;
}

export function getTemplateById(id: string): IndustryTemplate | undefined {
  return INDUSTRY_TEMPLATES.find((t) => t.id === id);
}

export function validateTemplateRequiredFields(
  template: IndustryTemplate,
  data: Record<string, string>
): boolean {
  for (const section of template.sections) {
    for (const field of section.fields) {
      if (field.required && !(data[field.key] ?? '').trim()) return false;
    }
  }
  return true;
}

export function buildLandingFromTemplate(
  template: IndustryTemplate,
  qrData: Record<string, string>
): Omit<Partial<LandingPageData>, 'leadForm'> & {
  enabled?: boolean;
  leadFormEnabled?: boolean;
  leadForm?: Partial<LeadFormConfig>;
} {
  const lp = template.landingPage ?? {};
  const metaTitle = qrData._headline ?? qrData._eventName ?? qrData._venueName ?? qrData._fullName ?? qrData.title;
  const metaSubtitle = [qrData._specialty, qrData._specs, qrData._price, qrData._eventDate, qrData._address]
    .filter(Boolean)
    .join(' · ');

  return {
    ...lp,
    title: lp.title ?? (metaTitle ? String(metaTitle) : template.name),
    subtitle: lp.subtitle ?? (metaSubtitle || template.tagline),
  };
}
