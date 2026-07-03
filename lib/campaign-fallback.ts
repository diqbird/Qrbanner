import { getTemplateById } from '@/lib/industry-templates';
import { emptyLandingPage } from '@/lib/landing-page';
import { DEFAULT_QR_STYLE, normalizeQRStyle } from '@/lib/qr-style';
import type { CampaignLocale, CampaignPlan, CampaignQrItem } from '@/lib/campaign-types';

type IndustryKey =
  | 'restaurant'
  | 'cafe'
  | 'hotel'
  | 'event'
  | 'wedding'
  | 'gym'
  | 'salon'
  | 'retail'
  | 'agency'
  | 'healthcare'
  | 'general';

function detectIndustry(prompt: string, locale: CampaignLocale): IndustryKey {
  const p = prompt.toLowerCase();
  const tr = locale === 'tr';
  if (/restoran|restaurant|bistro|dining|italian|pizza|burger|kitchen|yemek|mutfak|açılış|acilis|açiyorum|aciyorum/.test(p)) {
    return 'restaurant';
  }
  if (/cafe|café|coffee|kahve|espresso|bakery|pastane/.test(p)) return 'cafe';
  if (/hotel|otel|hospitality|konaklama|resort|spa/.test(p)) return 'hotel';
  if (/wedding|düğün|dugun|bride|groom|nikah/.test(p)) return 'wedding';
  if (/conference|konferans|festival|etkinlik|event|expo|seminer/.test(p)) return 'event';
  if (/gym|fitness|spor|workout|crossfit/.test(p)) return 'gym';
  if (/salon|spa|beauty|kuaför|kuaför|berber|nail/.test(p)) return 'salon';
  if (/store|shop|retail|mağaza|magaza|boutique|e-commerce|ecommerce/.test(p)) return 'retail';
  if (/agency|ajans|marketing|creative|dijital ajans/.test(p)) return 'agency';
  if (/clinic|dental|dentist|doctor|hastane|klinik|sağlık|saglik|health/.test(p)) return 'healthcare';
  if (tr && /restoran|kafe|otel|düğün|mağaza/.test(p)) return 'restaurant';
  return 'general';
}

function extractBusinessName(prompt: string, locale: CampaignLocale): string {
  const quoted = prompt.match(/["“]([^"”]+)["”]/)?.[1];
  if (quoted?.trim()) return quoted.trim().slice(0, 80);

  const patterns =
    locale === 'tr'
      ? [
          /(?:ad[ıi]nda|isimli)\s+([A-ZÇĞİÖŞÜa-zçğıöşü0-9][\w\s&'-]{2,40})/i,
          /([A-ZÇĞİÖŞÜ][\w&'-]{2,30})\s+(?:restoran|kafe|otel|mağaza|ajans)/i,
        ]
      : [
          /(?:called|named)\s+["']?([A-Za-z0-9][\w\s&'-]{2,40})/i,
          /([A-Z][\w&'-]{2,30})\s+(?:restaurant|cafe|hotel|store|agency)/i,
          /opening\s+(?:an?\s+)?([A-Za-z][\w\s&'-]{2,30})/i,
        ];

  for (const re of patterns) {
    const m = prompt.match(re);
    if (m?.[1]?.trim()) return m[1].trim().slice(0, 80);
  }

  if (locale === 'tr') return 'Yeni İşletmem';
  return 'My Business';
}

function item(
  partial: Omit<CampaignQrItem, 'key' | 'enabled'> & { key?: string }
): CampaignQrItem {
  return {
    key: partial.key ?? `${partial.category}-${partial.name}`.replace(/\s+/g, '-').toLowerCase(),
    enabled: true,
    ...partial,
  };
}

function templateStyle(templateId: string): Partial<ReturnType<typeof normalizeQRStyle>> | undefined {
  const tmpl = getTemplateById(templateId);
  if (!tmpl) return undefined;
  return normalizeQRStyle({ ...DEFAULT_QR_STYLE, ...tmpl.style });
}

function landingFrom(
  title: string,
  subtitle: string,
  template: 'minimal' | 'restaurant' | 'hotel' | 'event' | 'business',
  accent: string
) {
  return {
    ...emptyLandingPage,
    template,
    title,
    subtitle,
    accentColor: accent,
    ctaLabel: 'Continue',
  };
}

function restaurantKit(businessName: string, locale: CampaignLocale, accent: string): CampaignQrItem[] {
  const menuUrl = 'https://yourrestaurant.com/menu';
  const reviewUrl = 'https://g.page/r/your-google-review-link';
  const tr = locale === 'tr';
  return [
    item({
      name: tr ? `${businessName} — Menü` : `${businessName} — Menu`,
      category: 'menu',
      purpose: tr ? 'Masalarda dijital menü' : 'Digital menu on tables',
      qrData: { url: menuUrl },
      templateId: 'restaurant-menu',
      landingEnabled: true,
      landingPage: landingFrom(
        businessName,
        tr ? 'Menümüze göz atın' : 'View our menu',
        'restaurant',
        accent
      ),
      style: templateStyle('restaurant-menu'),
    }),
    item({
      name: tr ? 'Misafir Wi‑Fi' : 'Guest Wi‑Fi',
      category: 'wifi',
      purpose: tr ? 'Wi‑Fi şifresi olmadan bağlanma' : 'Join Wi‑Fi without typing',
      qrData: { ssid: `${businessName.replace(/\s+/g, '')}_Guest`, password: 'welcome123', encryption: 'WPA' },
      style: templateStyle('wifi-guest'),
    }),
    item({
      name: tr ? 'Google Yorumları' : 'Google Reviews',
      category: 'url',
      purpose: tr ? 'Mutlu müşterilerden yorum iste' : 'Ask happy guests for reviews',
      qrData: { url: reviewUrl },
      landingEnabled: true,
      landingPage: landingFrom(
        tr ? 'Bizi değerlendirin' : 'Rate your visit',
        tr ? 'Deneyiminizi paylaşın' : 'Share your experience',
        'business',
        accent
      ),
    }),
    item({
      name: 'Instagram',
      category: 'instagram',
      purpose: tr ? 'Sosyal medya takipçisi kazan' : 'Grow Instagram followers',
      qrData: { username: businessName.replace(/\s+/g, '').toLowerCase() },
    }),
    item({
      name: tr ? 'Tüm bağlantılar' : 'All links',
      category: 'link_hub',
      purpose: tr ? 'Tek QR ile menü, konum ve sosyal' : 'One QR for menu, location & social',
      qrData: { url: menuUrl },
      landingEnabled: true,
      landingPage: {
        ...landingFrom(businessName, tr ? 'Bize ulaşın' : 'Connect with us', 'restaurant', accent),
        hubMode: true,
        hubLinks: [
          { label: tr ? 'Menü' : 'Menu', url: menuUrl },
          { label: 'Instagram', url: `https://instagram.com/${businessName.replace(/\s+/g, '').toLowerCase()}` },
          { label: tr ? 'Yorum bırak' : 'Leave a review', url: reviewUrl },
        ],
      },
      templateId: 'instagram-bio',
    }),
    item({
      name: tr ? 'Konum / Yol tarifi' : 'Location & directions',
      category: 'location',
      purpose: tr ? 'Haritada konumunuzu aç' : 'Open your address in maps',
      qrData: { query: businessName },
    }),
  ];
}

function hotelKit(businessName: string, locale: CampaignLocale, accent: string): CampaignQrItem[] {
  const tr = locale === 'tr';
  const site = 'https://yourhotel.com';
  return [
    item({
      name: tr ? 'Otel ana sayfa' : 'Hotel homepage',
      category: 'url',
      purpose: tr ? 'Rezervasyon ve bilgi' : 'Bookings and info',
      qrData: { url: site },
      templateId: 'hotels-hospitality',
      landingEnabled: true,
      landingPage: landingFrom(businessName, tr ? 'Hoş geldiniz' : 'Welcome', 'hotel', accent),
      style: templateStyle('hotels-hospitality'),
    }),
    item({
      name: tr ? 'Misafir Wi‑Fi' : 'Guest Wi‑Fi',
      category: 'wifi',
      purpose: tr ? 'Lobi ve odalarda Wi‑Fi' : 'Lobby and in-room Wi‑Fi',
      qrData: { ssid: 'Hotel_Guest', password: 'staywithus', encryption: 'WPA' },
      style: templateStyle('wifi-guest'),
    }),
    item({
      name: tr ? 'Concierge bağlantıları' : 'Concierge links',
      category: 'link_hub',
      purpose: tr ? 'Oda servisi, spa, check-in' : 'Room service, spa, check-in',
      qrData: { url: site },
      landingEnabled: true,
      landingPage: {
        ...landingFrom(businessName, tr ? 'Concierge' : 'Concierge', 'hotel', accent),
        hubMode: true,
        hubLinks: [
          { label: tr ? 'Oda servisi' : 'Room service', url: `${site}/room-service` },
          { label: 'Spa', url: `${site}/spa` },
          { label: tr ? 'Check-in' : 'Check-in', url: `${site}/checkin` },
        ],
      },
    }),
  ];
}

function eventKit(businessName: string, locale: CampaignLocale, accent: string): CampaignQrItem[] {
  const tr = locale === 'tr';
  const reg = 'https://yourevent.com/register';
  return [
    item({
      name: tr ? 'Etkinlik kaydı' : 'Event registration',
      category: 'url',
      purpose: tr ? 'Kayıt ve bilet' : 'Registration and tickets',
      qrData: { url: reg },
      templateId: 'event-registration',
      landingEnabled: true,
      landingPage: landingFrom(businessName, tr ? 'Kayıt olun' : 'Register now', 'event', accent),
      style: templateStyle('event-registration'),
    }),
    item({
      name: tr ? 'Takvime ekle' : 'Add to calendar',
      category: 'event',
      purpose: tr ? 'Takvim dosyası' : 'Calendar invite',
      qrData: {
        title: businessName,
        start: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
        end: new Date(Date.now() + 7 * 86400000 + 2 * 3600000).toISOString().slice(0, 16),
        location: businessName,
      },
    }),
    item({
      name: tr ? 'Etkinlik bağlantıları' : 'Event links',
      category: 'link_hub',
      purpose: tr ? 'Program, konum, sosyal' : 'Agenda, venue, social',
      qrData: { url: reg },
      landingEnabled: true,
      landingPage: {
        ...landingFrom(businessName, tr ? 'Etkinlik merkezi' : 'Event hub', 'event', accent),
        hubMode: true,
        hubLinks: [
          { label: tr ? 'Kayıt' : 'Register', url: reg },
          { label: tr ? 'Program' : 'Agenda', url: `${reg}/agenda` },
          { label: 'Instagram', url: 'https://instagram.com/' },
        ],
      },
    }),
  ];
}

function generalKit(businessName: string, locale: CampaignLocale, accent: string): CampaignQrItem[] {
  const tr = locale === 'tr';
  const site = 'https://yourbusiness.com';
  return [
    item({
      name: tr ? 'Ana web sitesi' : 'Main website',
      category: 'url',
      purpose: tr ? 'Ana kampanya bağlantısı' : 'Primary campaign link',
      qrData: { url: site },
      landingEnabled: true,
      landingPage: landingFrom(businessName, tr ? 'Daha fazla bilgi' : 'Learn more', 'business', accent),
    }),
    item({
      name: tr ? 'Dijital kartvizit' : 'Digital business card',
      category: 'vcard',
      purpose: tr ? 'İletişim bilgilerini kaydet' : 'Save contact details',
      qrData: {
        firstName: businessName.split(' ')[0] ?? 'Contact',
        lastName: businessName.split(' ').slice(1).join(' ') || (tr ? 'İşletme' : 'Business'),
        email: 'hello@yourbusiness.com',
        phone: '+10000000000',
        org: businessName,
      },
      templateId: 'business-card',
      style: templateStyle('business-card'),
    }),
    item({
      name: tr ? 'Tüm bağlantılar' : 'Link hub',
      category: 'link_hub',
      purpose: tr ? 'Tek QR, birden fazla buton' : 'One QR, multiple buttons',
      qrData: { url: site },
      landingEnabled: true,
      landingPage: {
        ...landingFrom(businessName, tr ? 'Bizi takip edin' : 'Follow us', 'minimal', accent),
        hubMode: true,
        hubLinks: [
          { label: tr ? 'Web sitesi' : 'Website', url: site },
          { label: 'Instagram', url: 'https://instagram.com/' },
          { label: tr ? 'İletişim' : 'Contact', url: `mailto:hello@yourbusiness.com` },
        ],
      },
    }),
  ];
}

const PRINT_BY_INDUSTRY: Record<IndustryKey, { en: string[]; tr: string[] }> = {
  restaurant: {
    en: ['A4 table tent', 'Window poster', 'Menu insert', 'Instagram story'],
    tr: ['Masa tent kartı', 'Vitrin posteri', 'Menü insert', 'Instagram story'],
  },
  cafe: {
    en: ['Counter stand', 'Cup sleeve sticker', 'A5 flyer'],
    tr: ['Tezgah standı', 'Bardak sticker', 'A5 el ilanı'],
  },
  hotel: {
    en: ['Room card', 'Lobby standee', 'Elevator poster'],
    tr: ['Oda kartı', 'Lobi standı', 'Asansör posteri'],
  },
  event: {
    en: ['Registration banner', 'Badge insert', 'Email footer QR'],
    tr: ['Kayıt banner', 'Rozet QR', 'E-posta alt bilgi QR'],
  },
  wedding: {
    en: ['Table card', 'Invitation insert', 'Photo booth sign'],
    tr: ['Masa kartı', 'Davetiye insert', 'Foto kabin tabelası'],
  },
  gym: {
    en: ['Entrance poster', 'Class schedule card'],
    tr: ['Giriş posteri', 'Ders programı kartı'],
  },
  salon: {
    en: ['Mirror sticker', 'Reception desk stand'],
    tr: ['Ayna sticker', 'Resepsiyon standı'],
  },
  retail: {
    en: ['Product tag', 'Checkout counter', 'Shopping bag sticker'],
    tr: ['Ürün etiketi', 'Kasa önü', 'Poşet sticker'],
  },
  agency: {
    en: ['Proposal cover', 'Case study one-pager'],
    tr: ['Teklif kapağı', 'Vaka çalışması sayfası'],
  },
  healthcare: {
    en: ['Waiting room poster', 'Appointment card'],
    tr: ['Bekleme odası posteri', 'Randevu kartı'],
  },
  general: {
    en: ['A4 poster', 'Business card back', 'Flyer'],
    tr: ['A4 poster', 'Kartvizit arkası', 'El ilanı'],
  },
};

const SUMMARY: Record<IndustryKey, { en: string; tr: string }> = {
  restaurant: {
    en: 'A complete restaurant launch kit: menu, Wi‑Fi, reviews, social links and print-ready ideas.',
    tr: 'Tam restoran açılış kiti: menü, Wi‑Fi, yorumlar, sosyal bağlantılar ve baskı önerileri.',
  },
  cafe: {
    en: 'Café campaign with menu link, guest Wi‑Fi and social growth QR codes.',
    tr: 'Kafe kampanyası: menü, misafir Wi‑Fi ve sosyal büyüme QR kodları.',
  },
  hotel: {
    en: 'Hotel guest journey: homepage, Wi‑Fi and concierge link hub.',
    tr: 'Otel misafir yolculuğu: ana sayfa, Wi‑Fi ve concierge link hub.',
  },
  event: {
    en: 'Event registration, calendar invite and multi-link hub for attendees.',
    tr: 'Etkinlik kaydı, takvim daveti ve katılımcılar için çoklu link hub.',
  },
  wedding: {
    en: 'Wedding guest kit with RSVP, gallery and link hub.',
    tr: 'Düğün misafir kiti: RSVP, galeri ve link hub.',
  },
  gym: {
    en: 'Gym membership and class info QR campaign.',
    tr: 'Spor salonu üyelik ve ders bilgisi QR kampanyası.',
  },
  salon: {
    en: 'Salon booking and social follow QR set.',
    tr: 'Salon randevu ve sosyal takip QR seti.',
  },
  retail: {
    en: 'Retail store links, promotions and contact QR bundle.',
    tr: 'Perakende mağaza linkleri, promosyon ve iletişim QR paketi.',
  },
  agency: {
    en: 'Agency portfolio hub and contact card campaign.',
    tr: 'Ajans portföy hub ve kartvizit kampanyası.',
  },
  healthcare: {
    en: 'Clinic info, appointment and contact QR kit.',
    tr: 'Klinik bilgi, randevu ve iletişim QR kiti.',
  },
  general: {
    en: 'Starter business campaign: website, vCard and link hub.',
    tr: 'Başlangıç işletme kampanyası: web sitesi, vCard ve link hub.',
  },
};

export function generateCampaignFallback(
  prompt: string,
  locale: CampaignLocale,
  businessNameOverride?: string
): CampaignPlan {
  const industry = detectIndustry(prompt, locale);
  const businessName = businessNameOverride?.trim() || extractBusinessName(prompt, locale);
  const accent =
    industry === 'restaurant' || industry === 'cafe'
      ? '#b45309'
      : industry === 'hotel'
        ? '#1e40af'
        : industry === 'event' || industry === 'wedding'
          ? '#7c3aed'
          : '#0071e3';

  let items: CampaignQrItem[];
  switch (industry) {
    case 'restaurant':
    case 'cafe':
      items = restaurantKit(businessName, locale, accent);
      break;
    case 'hotel':
      items = hotelKit(businessName, locale, accent);
      break;
    case 'event':
    case 'wedding':
      items = eventKit(businessName, locale, accent);
      break;
    default:
      items = generalKit(businessName, locale, accent);
      break;
  }

  const print = PRINT_BY_INDUSTRY[industry] ?? PRINT_BY_INDUSTRY.general;

  return {
    businessName,
    industry,
    summary: locale === 'tr' ? SUMMARY[industry].tr : SUMMARY[industry].en,
    accentColor: accent,
    items: items.slice(0, 8),
    printSuggestions: locale === 'tr' ? print.tr : print.en,
    source: 'template',
  };
}
