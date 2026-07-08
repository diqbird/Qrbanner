import type { QRStyleConfig } from '@/lib/qr-style';
import type { LandingPageData, LeadFormConfig } from '@/lib/landing-page';
import { buildDesignProfile, type TemplateDesignProfile } from '@/lib/template-design-standards';
import { INDUSTRY_VISUAL_PRESET_MAP, mergeIndustryVisualStyle } from '@/lib/visual-qr-presets';
import { getPrintLayoutForIndustry, type IndustryPrintLayout } from '@/lib/industry-print-layouts';
import { ARCHETYPE_INDUSTRY_TEMPLATES } from '@/lib/industry-archetype-templates';

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
  /** Populated at runtime via getTemplateById — master-prompt design metadata */
  designProfile?: TemplateDesignProfile;
  /** Linked professional visual preset */
  visualPresetId?: string;
  /** Recommended print banner layout — populated via getTemplateById */
  printLayout?: IndustryPrintLayout;
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

  {
    id: 'wifi-guest',
    name: 'Guest Wi‑Fi',
    category: 'wifi',
    tagline: 'Lobby and room cards — connect without typing passwords',
    description: 'Cafés, hotels, rentals and offices share guest network access in one scan.',
    useCases: ['Hotel room folder', 'Café counter tent', 'Co-working lobby', 'Airbnb welcome card'],
    suggestedQrName: 'Guest Wi‑Fi',
    qrData: { ssid: '', password: '', encryption: 'WPA', _venueName: '' },
    style: {
      fgColor: '#0369a1',
      bgColor: '#f0f9ff',
      dotStyle: 'rounded',
      frameStyle: 'badge',
      frameText: 'JOIN Wi‑Fi',
      errorCorrection: 'H',
    },
    sections: [
      {
        id: 'venue',
        title: 'Venue label',
        description: 'Printed name on your Wi‑Fi sign — not encoded in the QR.',
        fields: [
          { key: '_venueName', label: 'Venue name', placeholder: 'e.g. Harbor Hotel Lobby', type: 'text' },
        ],
      },
      {
        id: 'network',
        title: 'Guest network',
        description: 'SSID, password and security type for automatic join.',
        fields: [
          { key: 'ssid', label: 'Network name (SSID)', placeholder: 'Guest_WiFi', required: true, type: 'text' },
          { key: 'password', label: 'Password', placeholder: 'guest2026', type: 'text' },
          {
            key: 'encryption',
            label: 'Security type',
            type: 'select',
            options: [
              { value: 'WPA', label: 'WPA / WPA2' },
              { value: 'WEP', label: 'WEP' },
              { value: 'nopass', label: 'Open (no password)' },
            ],
          },
        ],
      },
    ],
    tips: [
      'Use a guest VLAN isolated from your business network.',
      'Rotate passwords monthly in high-traffic venues.',
      'Print at least 3×3 cm for lobby stands.',
    ],
  },

  {
    id: 'retail-stores',
    name: 'Retail & In-Store',
    category: 'url',
    tagline: 'Shelf talkers and packaging → product pages and promos',
    description: 'Link packaging, displays and window signs to live product or offer pages.',
    useCases: ['Shelf talker', 'Product hang tag', 'Window display', 'Loyalty signup'],
    suggestedQrName: 'Retail Promo — Spring Sale',
    qrData: { url: 'https://yourstore.com/promo', _productName: '', _campaign: '', _storeLocation: '' },
    style: {
      fgColor: '#7c3aed',
      bgColor: '#faf5ff',
      dotStyle: 'rounded',
      frameStyle: 'scan-me',
      frameText: 'SHOP NOW',
      gradientEnabled: true,
      gradientColor2: '#a78bfa',
    },
    sections: [
      {
        id: 'product',
        title: 'Product or promo link',
        description: 'Destination shoppers land on after scanning.',
        fields: [
          { key: 'url', label: 'Promo or product URL', placeholder: 'https://yourstore.com/spring-sale', required: true, type: 'url' },
        ],
      },
      {
        id: 'campaign',
        title: 'Campaign tracking',
        description: 'Internal labels for analytics and batches.',
        fields: [
          { key: '_productName', label: 'Product or SKU', placeholder: 'Organic olive oil 500ml', type: 'text' },
          { key: '_campaign', label: 'Campaign', placeholder: 'Spring 2026 window', type: 'text' },
          { key: '_storeLocation', label: 'Store / aisle', placeholder: 'Downtown · Aisle 4', type: 'text' },
        ],
      },
    ],
    tips: [
      'UTM tags: source=qr_shelf, medium=print.',
      'Bulk CSV import for hundreds of SKUs.',
      'Schedule promo URL swaps by date.',
    ],
  },

  {
    id: 'hotels-hospitality',
    name: 'Hotel & Hospitality',
    category: 'link_hub',
    tagline: 'One scan — Wi‑Fi, menus, spa and local guide',
    description: 'Guest hub for rooms, lobbies and pool areas.',
    useCases: ['Room tent card', 'Lobby directory', 'Pool signage', 'Spa menu stand'],
    suggestedQrName: 'Guest Hub — Main Lobby',
    qrData: { url: '' },
    style: {
      fgColor: '#1e40af',
      bgColor: '#eff6ff',
      dotStyle: 'classy-rounded',
      frameStyle: 'badge',
      frameText: 'GUEST INFO',
      gradientEnabled: true,
      gradientColor2: '#3b82f6',
    },
    sections: [
      {
        id: 'property',
        title: 'Property identity',
        description: 'Shown on the guest hub landing page.',
        fields: [
          { key: '_propertyName', label: 'Property name', placeholder: 'Harbor Bay Hotel', type: 'text' },
        ],
      },
    ],
    tips: [
      'Update seasonal spa and restaurant links without reprinting.',
      'Add language routing for international guests.',
      'Use hotel landing template for elegant branding.',
    ],
    landingPage: {
      enabled: true,
      template: 'hotel',
      title: 'Welcome',
      subtitle: 'Everything you need during your stay',
      accentColor: '#1e40af',
      ctaLabel: 'Explore',
      hubMode: true,
      hubLinks: [
        { label: 'Guest Wi‑Fi', url: '' },
        { label: 'Room Service Menu', url: '' },
        { label: 'Spa & Amenities', url: '' },
        { label: 'Local Guide', url: '' },
      ],
    },
  },

  {
    id: 'healthcare-clinics',
    name: 'Healthcare & Clinic',
    category: 'url',
    tagline: 'Patient intake and education — no paper stacks',
    description: 'Waiting room QR to forms, booking and care instructions.',
    useCases: ['Waiting room poster', 'Check-in desk', 'Exam room handout', 'Post-visit care'],
    suggestedQrName: 'Patient Portal — Main Clinic',
    qrData: { url: 'https://yourclinic.com/intake', _clinicName: '', _department: '' },
    style: {
      fgColor: '#0d9488',
      bgColor: '#f0fdfa',
      dotStyle: 'rounded',
      frameStyle: 'badge',
      frameText: 'PATIENT INFO',
    },
    sections: [
      {
        id: 'portal',
        title: 'Patient destination',
        description: 'Intake form, booking page or education PDF on your portal.',
        fields: [
          { key: 'url', label: 'Portal URL', placeholder: 'https://yourclinic.com/intake', required: true, type: 'url' },
        ],
      },
      {
        id: 'clinic',
        title: 'Clinic details',
        description: 'Landing page context — not encoded in the QR link.',
        fields: [
          { key: '_clinicName', label: 'Clinic name', placeholder: 'Westside Family Medicine', type: 'text' },
          { key: '_department', label: 'Department', placeholder: 'Pediatrics / Urgent care', type: 'text' },
        ],
      },
    ],
    tips: [
      'Never put PHI in the QR URL — link to your compliant portal.',
      'Password-protect staff-only flows.',
      'Update forms when protocols change — same printed QR.',
    ],
    landingPage: {
      enabled: true,
      template: 'business',
      title: 'Patient Resources',
      subtitle: 'Forms, appointments and care instructions',
      accentColor: '#0d9488',
      ctaLabel: 'Continue',
    },
  },

  {
    id: 'museums-venues',
    name: 'Museum & Venue',
    category: 'url',
    tagline: 'Exhibit labels → audio, tickets and donations',
    description: 'Gallery and venue QR for rich media and timed entry.',
    useCases: ['Exhibit plaque', 'Gallery zone sign', 'Donation stand', 'Timed-entry gate'],
    suggestedQrName: 'Exhibit — Gallery 3',
    qrData: { url: 'https://yourmuseum.com/exhibit/3', _exhibitTitle: '', _gallery: '' },
    style: {
      fgColor: '#78350f',
      bgColor: '#fffbeb',
      dotStyle: 'square',
      frameStyle: 'scan-me',
      frameText: 'LEARN MORE',
    },
    sections: [
      {
        id: 'exhibit',
        title: 'Exhibit destination',
        description: 'Audio guide, video, ticket page or donation link.',
        fields: [
          { key: 'url', label: 'Exhibit URL', placeholder: 'https://yourmuseum.com/exhibit/renaissance', required: true, type: 'url' },
        ],
      },
      {
        id: 'label',
        title: 'Exhibit label',
        description: 'Title shown on landing before redirect.',
        fields: [
          { key: '_exhibitTitle', label: 'Exhibit title', placeholder: 'Renaissance Masters', type: 'text' },
          { key: '_gallery', label: 'Gallery / zone', placeholder: 'Gallery 3 · East Wing', type: 'text' },
        ],
      },
    ],
    tips: [
      'Multilingual routing by visitor country.',
      'Track popular exhibits by scan volume.',
      'Minimum 2×2 cm at arm\'s length viewing distance.',
    ],
    landingPage: {
      enabled: true,
      template: 'minimal',
      title: 'Exhibit Guide',
      subtitle: 'Audio, video and extended content',
      accentColor: '#78350f',
      ctaLabel: 'Open Guide',
    },
  },

  {
    id: 'fitness-gyms',
    name: 'Fitness & Gym',
    category: 'url',
    tagline: 'Class schedules and memberships from the lobby',
    description: 'Studios and gyms link posters to timetables and signup.',
    useCases: ['Lobby schedule board', 'Equipment zone', 'Trainer poster', 'Trial pass promo'],
    suggestedQrName: 'Class Schedule — Downtown Gym',
    qrData: { url: 'https://yourgym.com/schedule', _gymName: '', _trialOffer: '' },
    style: {
      fgColor: '#dc2626',
      bgColor: '#fef2f2',
      dotStyle: 'rounded',
      frameStyle: 'badge',
      frameText: 'JOIN NOW',
      gradientEnabled: true,
      gradientColor2: '#f97316',
    },
    sections: [
      {
        id: 'schedule',
        title: 'Schedule or signup',
        description: 'Live class timetable, membership or trial page.',
        fields: [
          { key: 'url', label: 'Schedule URL', placeholder: 'https://yourgym.com/schedule', required: true, type: 'url' },
        ],
      },
      {
        id: 'gym',
        title: 'Gym branding',
        description: 'Landing page headline and promo line.',
        fields: [
          { key: '_gymName', label: 'Gym / studio name', placeholder: 'IronWorks Fitness', type: 'text' },
          { key: '_trialOffer', label: 'Trial offer', placeholder: '7-day free pass', type: 'text' },
        ],
      },
    ],
    tips: [
      'Update weekly class changes without new posters.',
      'Equipment zone QR → how-to video for each machine.',
      'Geofence routing for multi-location chains.',
    ],
    landingPage: {
      enabled: true,
      template: 'business',
      title: 'Class Schedule',
      subtitle: 'Book your next session',
      accentColor: '#dc2626',
      ctaLabel: 'View Schedule',
    },
  },

  {
    id: 'salon-spa',
    name: 'Salon & Spa',
    category: 'url',
    tagline: 'Booking and service menus from mirror clings',
    description: 'Salons link reception QR to live booking and retail offers.',
    useCases: ['Mirror cling', 'Reception desk', 'Stylist card', 'Retail shelf'],
    suggestedQrName: 'Book Appointment — Main Salon',
    qrData: { url: 'https://yoursalon.com/book', _salonName: '', _topService: '' },
    style: {
      fgColor: '#be185d',
      bgColor: '#fdf2f8',
      dotStyle: 'extra-rounded',
      cornerStyle: 'extra-rounded',
      frameStyle: 'rounded',
      frameText: 'BOOK NOW',
    },
    sections: [
      {
        id: 'booking',
        title: 'Booking link',
        description: 'Online scheduler or service menu page.',
        fields: [
          { key: 'url', label: 'Booking URL', placeholder: 'https://yoursalon.com/book', required: true, type: 'url' },
        ],
      },
      {
        id: 'salon',
        title: 'Salon details',
        description: 'Brand line on landing page.',
        fields: [
          { key: '_salonName', label: 'Salon name', placeholder: 'Luxe Hair & Spa', type: 'text' },
          { key: '_topService', label: 'Featured service', placeholder: 'Balayage · Gel manicure', type: 'text' },
        ],
      },
    ],
    tips: [
      'Seasonal promo swaps without reprinting clings.',
      'Lead form for bridal and event packages.',
      'Stylist-specific URLs for commission tracking.',
    ],
    landingPage: {
      enabled: true,
      template: 'business',
      title: 'Book Your Visit',
      subtitle: 'Services, stylists and seasonal offers',
      accentColor: '#be185d',
      ctaLabel: 'Book Now',
      leadFormEnabled: true,
      leadForm: { collectName: true, collectEmail: true, collectPhone: true, requiredEmail: true },
    },
  },

  {
    id: 'nonprofit-fundraising',
    name: 'Nonprofit & Fundraising',
    category: 'url',
    tagline: 'Donate, volunteer and sign up from printed collateral',
    description: 'Galas, drives and mailers link to donation and volunteer pages.',
    useCases: ['Gala table tent', 'Direct mail insert', 'Event poster', 'Volunteer booth'],
    suggestedQrName: 'Donate — Annual Gala 2026',
    qrData: { url: 'https://yourcharity.org/donate', _orgName: '', _campaign: '' },
    style: {
      fgColor: '#b91c1c',
      bgColor: '#fef2f2',
      dotStyle: 'rounded',
      frameStyle: 'badge',
      frameText: 'DONATE',
      errorCorrection: 'H',
    },
    sections: [
      {
        id: 'donate',
        title: 'Donation or signup',
        description: 'Givebutter, donation link, volunteer form or impact report.',
        fields: [
          { key: 'url', label: 'Campaign URL', placeholder: 'https://yourcharity.org/gala-2026', required: true, type: 'url' },
        ],
      },
      {
        id: 'org',
        title: 'Organization',
        description: 'Campaign name on landing page.',
        fields: [
          { key: '_orgName', label: 'Organization', placeholder: 'Community Garden Alliance', type: 'text' },
          { key: '_campaign', label: 'Campaign', placeholder: 'Spring planting drive 2026', type: 'text' },
        ],
      },
    ],
    tips: [
      'Swap donation URLs between campaigns — same poster QR.',
      'Track table tents vs posters by batch label.',
      'A/B test donation page copy on landing.',
    ],
    landingPage: {
      enabled: true,
      template: 'event',
      title: 'Support Our Mission',
      subtitle: 'Every gift makes a difference',
      accentColor: '#b91c1c',
      ctaLabel: 'Donate Now',
    },
  },

  {
    id: 'dental-clinics',
    name: 'Dental Practice',
    category: 'url',
    tagline: 'Intake, booking and aftercare from chairside',
    description: 'Reception and appointment cards link to patient flows.',
    useCases: ['Reception poster', 'Appointment reminder card', 'Chairside aftercare', 'Whitening promo'],
    suggestedQrName: 'Patient Intake — Main Office',
    qrData: { url: 'https://yourdental.com/intake', _practiceName: '', _servicePromo: '' },
    style: {
      fgColor: '#0891b2',
      bgColor: '#ecfeff',
      dotStyle: 'rounded',
      frameStyle: 'badge',
      frameText: 'PATIENT CARE',
    },
    sections: [
      {
        id: 'intake',
        title: 'Patient destination',
        description: 'Intake form, booking or aftercare instructions.',
        fields: [
          { key: 'url', label: 'Patient URL', placeholder: 'https://yourdental.com/intake', required: true, type: 'url' },
        ],
      },
      {
        id: 'practice',
        title: 'Practice details',
        description: 'Landing page context.',
        fields: [
          { key: '_practiceName', label: 'Practice name', placeholder: 'Bright Smile Dental', type: 'text' },
          { key: '_servicePromo', label: 'Current promo', placeholder: 'Free whitening consult', type: 'text' },
        ],
      },
    ],
    tips: [
      'Link to HIPAA-compliant portal — no PHI in QR.',
      'Aftercare PDF patients can save to photos.',
      'Promote hygiene specials on seasonal cards.',
    ],
    landingPage: {
      enabled: true,
      template: 'business',
      title: 'Patient Resources',
      subtitle: 'Intake, booking and aftercare',
      accentColor: '#0891b2',
      ctaLabel: 'Get Started',
    },
  },

  {
    id: 'home-services',
    name: 'Home Services',
    category: 'url',
    tagline: 'Truck decals and yard signs → booking and reviews',
    description: 'HVAC, plumbing and contractors capture leads from the field.',
    useCases: ['Truck decal', 'Yard sign', 'Door hanger', 'Job site sign'],
    suggestedQrName: 'Request Service — HVAC',
    qrData: { url: 'https://yourcompany.com/book', _companyName: '', _serviceArea: '', _seasonalPromo: '' },
    style: {
      fgColor: '#ea580c',
      bgColor: '#fff7ed',
      dotStyle: 'square',
      frameStyle: 'scan-me',
      frameText: 'GET QUOTE',
    },
    sections: [
      {
        id: 'booking',
        title: 'Service request',
        description: 'Online scheduler, estimate form or promo landing.',
        fields: [
          { key: 'url', label: 'Booking URL', placeholder: 'https://yourcompany.com/estimate', required: true, type: 'url' },
        ],
      },
      {
        id: 'company',
        title: 'Company details',
        description: 'Brand and territory for landing page.',
        fields: [
          { key: '_companyName', label: 'Company name', placeholder: 'CoolAir HVAC', type: 'text' },
          { key: '_serviceArea', label: 'Service area', placeholder: 'Greater Boston', type: 'text' },
          { key: '_seasonalPromo', label: 'Seasonal offer', placeholder: 'AC tune-up $79', type: 'text' },
        ],
      },
    ],
    tips: [
      'Per-technician QR for territory tracking.',
      'Rotate seasonal promos on same truck decal.',
      'Webhook to CRM when lead form submits.',
    ],
    landingPage: {
      enabled: true,
      template: 'business',
      title: 'Request Service',
      subtitle: 'Fast estimates and seasonal offers',
      accentColor: '#ea580c',
      ctaLabel: 'Book Now',
      leadFormEnabled: true,
      leadForm: { collectName: true, collectEmail: true, collectPhone: true, collectMessage: true, requiredEmail: false },
    },
  },

  {
    id: 'coffee-shops-cafes',
    name: 'Coffee Shop & Café',
    category: 'menu',
    tagline: 'Loyalty, menu and ordering from the counter',
    description: 'Cafés link table tents to loyalty signup and seasonal menus.',
    useCases: ['Counter tent', 'Table card', 'Takeaway cup sleeve', 'Loyalty poster'],
    suggestedQrName: 'Café Menu — Downtown',
    qrData: { url: 'https://yourcafe.com/menu', _cafeName: '', _loyaltyNote: '' },
    style: {
      fgColor: '#92400e',
      bgColor: '#fffbeb',
      dotStyle: 'rounded',
      frameStyle: 'badge',
      frameText: 'ORDER',
      gradientEnabled: true,
      gradientColor2: '#d97706',
    },
    sections: [
      {
        id: 'menu',
        title: 'Menu or loyalty',
        description: 'Digital menu, loyalty signup or mobile order page.',
        fields: [
          { key: 'url', label: 'Menu / loyalty URL', placeholder: 'https://yourcafe.com/menu', required: true, type: 'url' },
        ],
      },
      {
        id: 'cafe',
        title: 'Café branding',
        description: 'Name and loyalty hook on landing.',
        fields: [
          { key: '_cafeName', label: 'Café name', placeholder: 'Roast & Co.', type: 'text' },
          { key: '_loyaltyNote', label: 'Loyalty hook', placeholder: 'Scan → 10% off first order', type: 'text' },
        ],
      },
    ],
    tips: [
      'Pair with a separate Wi‑Fi QR for guest network.',
      'Update seasonal drinks without reprinting tents.',
      'UTM: source=qr_counter for attribution.',
    ],
    landingPage: {
      enabled: true,
      template: 'restaurant',
      title: 'Today\'s Menu',
      subtitle: 'Seasonal drinks and loyalty rewards',
      accentColor: '#92400e',
      ctaLabel: 'View Menu',
    },
  },

  {
    id: 'tourist-attractions',
    name: 'Tourist Attraction',
    category: 'url',
    tagline: 'Entrance scan → tickets, audio and maps',
    description: 'Landmarks and attractions guide visitors without extra hardware.',
    useCases: ['Entrance gate', 'Trail marker', 'Ticket booth', 'Audio guide post'],
    suggestedQrName: 'Visitor Guide — Main Entrance',
    qrData: { url: 'https://yourattraction.com/visit', _attractionName: '', _hours: '' },
    style: {
      fgColor: '#15803d',
      bgColor: '#f0fdf4',
      dotStyle: 'rounded',
      frameStyle: 'scan-me',
      frameText: 'VISITOR INFO',
      gradientEnabled: true,
      gradientColor2: '#22c55e',
    },
    sections: [
      {
        id: 'visit',
        title: 'Visitor destination',
        description: 'Tickets, audio guide, map or exhibit page.',
        fields: [
          { key: 'url', label: 'Visitor URL', placeholder: 'https://yourattraction.com/tickets', required: true, type: 'url' },
        ],
      },
      {
        id: 'attraction',
        title: 'Attraction details',
        description: 'Name and hours on landing page.',
        fields: [
          { key: '_attractionName', label: 'Attraction name', placeholder: 'Harbor Lighthouse', type: 'text' },
          { key: '_hours', label: 'Hours', placeholder: 'Daily 9:00–18:00', type: 'text' },
        ],
      },
    ],
    tips: [
      'Multilingual routing for international tourists.',
      'Per-entrance QR for crowd flow analytics.',
      'Update hours and exhibits without reprinting signs.',
    ],
    landingPage: {
      enabled: true,
      template: 'minimal',
      title: 'Plan Your Visit',
      subtitle: 'Tickets, audio guides and maps',
      accentColor: '#15803d',
      ctaLabel: 'Get Tickets',
    },
  },
  ...ARCHETYPE_INDUSTRY_TEMPLATES,
];

export function stripMetaFields(data: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(data)) {
    if (!k.startsWith('_')) out[k] = v;
  }
  return out;
}

export function getTemplateById(id: string): IndustryTemplate | undefined {
  const template = INDUSTRY_TEMPLATES.find((t) => t.id === id);
  if (!template) return undefined;
  const style = mergeIndustryVisualStyle(template.id, template.style);
  const visualPresetId = INDUSTRY_VISUAL_PRESET_MAP[template.id];
  const printLayout = getPrintLayoutForIndustry(template.id);
  return {
    ...template,
    style,
    visualPresetId,
    printLayout,
    designProfile: buildDesignProfile({ ...template, style }),
  };
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
  const metaTitle = qrData._headline ?? qrData._eventName ?? qrData._venueName ?? qrData._fullName ?? qrData._propertyName ?? qrData._clinicName ?? qrData._exhibitTitle ?? qrData._gymName ?? qrData._salonName ?? qrData._orgName ?? qrData._practiceName ?? qrData._companyName ?? qrData._cafeName ?? qrData._attractionName ?? qrData.title;
  const metaSubtitle = [qrData._specialty, qrData._specs, qrData._price, qrData._eventDate, qrData._address]
    .filter(Boolean)
    .join(' · ');

  return {
    ...lp,
    title: lp.title ?? (metaTitle ? String(metaTitle) : template.name),
    subtitle: lp.subtitle ?? (metaSubtitle || template.tagline),
  };
}
