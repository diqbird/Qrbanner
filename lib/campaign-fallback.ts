import { getTemplateById } from '@/lib/industry-templates';
import { emptyLandingPage } from '@/lib/landing-page';
import { DEFAULT_QR_STYLE, normalizeQRStyle } from '@/lib/qr-style';
import { pickAiText } from '@/lib/i18n/ai-locale';
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

function t<T>(locale: CampaignLocale, texts: { en: T; tr: T; de: T; es: T }): T {
  return pickAiText(locale, texts);
}

function detectIndustry(prompt: string, _locale: CampaignLocale): IndustryKey {
  const p = prompt.toLowerCase();
  if (
    /restoran|restaurant|bistro|dining|italian|pizza|burger|kitchen|yemek|mutfak|açılış|acilis|açiyorum|aciyorum|gasthaus|speisekarte|ristorante|comida/.test(
      p
    )
  ) {
    return 'restaurant';
  }
  if (/cafe|café|coffee|kahve|espresso|bakery|pastane|kaffee|cafetería|cafeteria/.test(p)) return 'cafe';
  if (/hotel|otel|hospitality|konaklama|resort|spa|hôtel|hospedaje/.test(p)) return 'hotel';
  if (/wedding|düğün|dugun|bride|groom|nikah|hochzeit|boda|matrimonio/.test(p)) return 'wedding';
  if (/conference|konferans|festival|etkinlik|event|expo|seminer|veranstaltung|evento/.test(p)) {
    return 'event';
  }
  if (/gym|fitness|spor|workout|crossfit|fitnessstudio|gimnasio|gimnasio/.test(p)) return 'gym';
  if (/salon|spa|beauty|kuaför|kuafor|berber|nail|friseur|peluquer[ií]a|barber[ií]a/.test(p)) {
    return 'salon';
  }
  if (/store|shop|retail|mağaza|magaza|boutique|e-commerce|ecommerce|geschäft|tienda|comercio/.test(p)) {
    return 'retail';
  }
  if (/agency|ajans|marketing|creative|dijital ajans|agentur|agencia/.test(p)) return 'agency';
  if (/clinic|dental|dentist|doctor|hastane|klinik|sağlık|saglik|health|arzt|clínica|clinica/.test(p)) {
    return 'healthcare';
  }
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
      : locale === 'de'
        ? [
            /(?:namens|heißt|genannt)\s+["']?([A-Za-zÄÖÜäöüß0-9][\w\s&'-]{2,40})/i,
            /([A-ZÄÖÜ][\w&'-]{2,30})\s+(?:Restaurant|Café|Hotel|Geschäft|Agentur)/i,
          ]
        : locale === 'es'
          ? [
              /(?:llamad[oa]|llamado|llamada|nombre)\s+["']?([A-Za-zÁÉÍÓÚÑáéíóúñ0-9][\w\s&'-]{2,40})/i,
              /([A-ZÁÉÍÓÚÑ][\w&'-]{2,30})\s+(?:restaurante|café|hotel|tienda|agencia)/i,
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

  return t(locale, {
    en: 'My Business',
    tr: 'Yeni İşletmem',
    de: 'Mein Unternehmen',
    es: 'Mi negocio',
  });
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
  accent: string,
  locale: CampaignLocale
) {
  return {
    ...emptyLandingPage,
    template,
    title,
    subtitle,
    accentColor: accent,
    ctaLabel: t(locale, {
      en: 'Continue',
      tr: 'Devam et',
      de: 'Weiter',
      es: 'Continuar',
    }),
  };
}

function restaurantKit(businessName: string, locale: CampaignLocale, accent: string): CampaignQrItem[] {
  const menuUrl = 'https://yourrestaurant.com/menu';
  const reviewUrl = 'https://g.page/r/your-google-review-link';
  return [
    item({
      name: t(locale, {
        en: `${businessName} — Menu`,
        tr: `${businessName} — Menü`,
        de: `${businessName} — Speisekarte`,
        es: `${businessName} — Menú`,
      }),
      category: 'menu',
      purpose: t(locale, {
        en: 'Digital menu on tables',
        tr: 'Masalarda dijital menü',
        de: 'Digitale Speisekarte am Tisch',
        es: 'Menú digital en las mesas',
      }),
      qrData: { url: menuUrl },
      templateId: 'restaurant-menu',
      landingEnabled: true,
      landingPage: landingFrom(
        businessName,
        t(locale, {
          en: 'View our menu',
          tr: 'Menümüze göz atın',
          de: 'Unsere Speisekarte ansehen',
          es: 'Consulta nuestro menú',
        }),
        'restaurant',
        accent,
        locale
      ),
      style: templateStyle('restaurant-menu'),
    }),
    item({
      name: t(locale, {
        en: 'Guest Wi‑Fi',
        tr: 'Misafir Wi‑Fi',
        de: 'Gäste-WLAN',
        es: 'Wi‑Fi para invitados',
      }),
      category: 'wifi',
      purpose: t(locale, {
        en: 'Join Wi‑Fi without typing',
        tr: 'Wi‑Fi şifresi olmadan bağlanma',
        de: 'WLAN ohne Tippen verbinden',
        es: 'Conéctate al Wi‑Fi sin escribir',
      }),
      qrData: { ssid: `${businessName.replace(/\s+/g, '')}_Guest`, password: 'welcome123', encryption: 'WPA' },
      style: templateStyle('wifi-guest'),
    }),
    item({
      name: t(locale, {
        en: 'Google Reviews',
        tr: 'Google Yorumları',
        de: 'Google-Bewertungen',
        es: 'Reseñas de Google',
      }),
      category: 'url',
      purpose: t(locale, {
        en: 'Ask happy guests for reviews',
        tr: 'Mutlu müşterilerden yorum iste',
        de: 'Zufriedene Gäste um Bewertungen bitten',
        es: 'Pide reseñas a clientes satisfechos',
      }),
      qrData: { url: reviewUrl },
      landingEnabled: true,
      landingPage: landingFrom(
        t(locale, {
          en: 'Rate your visit',
          tr: 'Bizi değerlendirin',
          de: 'Bewerten Sie Ihren Besuch',
          es: 'Valora tu visita',
        }),
        t(locale, {
          en: 'Share your experience',
          tr: 'Deneyiminizi paylaşın',
          de: 'Teilen Sie Ihre Erfahrung',
          es: 'Comparte tu experiencia',
        }),
        'business',
        accent,
        locale
      ),
    }),
    item({
      name: 'Instagram',
      category: 'instagram',
      purpose: t(locale, {
        en: 'Grow Instagram followers',
        tr: 'Sosyal medya takipçisi kazan',
        de: 'Instagram-Follower gewinnen',
        es: 'Gana seguidores en Instagram',
      }),
      qrData: { username: businessName.replace(/\s+/g, '').toLowerCase() },
    }),
    item({
      name: t(locale, {
        en: 'All links',
        tr: 'Tüm bağlantılar',
        de: 'Alle Links',
        es: 'Todos los enlaces',
      }),
      category: 'link_hub',
      purpose: t(locale, {
        en: 'One QR for menu, location & social',
        tr: 'Tek QR ile menü, konum ve sosyal',
        de: 'Ein QR für Speisekarte, Standort & Social',
        es: 'Un QR para menú, ubicación y redes',
      }),
      qrData: { url: menuUrl },
      landingEnabled: true,
      landingPage: {
        ...landingFrom(
          businessName,
          t(locale, {
            en: 'Connect with us',
            tr: 'Bize ulaşın',
            de: 'Kontaktieren Sie uns',
            es: 'Conéctate con nosotros',
          }),
          'restaurant',
          accent,
          locale
        ),
        hubMode: true,
        hubLinks: [
          {
            label: t(locale, { en: 'Menu', tr: 'Menü', de: 'Speisekarte', es: 'Menú' }),
            url: menuUrl,
          },
          { label: 'Instagram', url: `https://instagram.com/${businessName.replace(/\s+/g, '').toLowerCase()}` },
          {
            label: t(locale, {
              en: 'Leave a review',
              tr: 'Yorum bırak',
              de: 'Bewertung hinterlassen',
              es: 'Deja una reseña',
            }),
            url: reviewUrl,
          },
        ],
      },
      templateId: 'instagram-bio',
    }),
    item({
      name: t(locale, {
        en: 'Location & directions',
        tr: 'Konum / Yol tarifi',
        de: 'Standort & Wegbeschreibung',
        es: 'Ubicación y cómo llegar',
      }),
      category: 'location',
      purpose: t(locale, {
        en: 'Open your address in maps',
        tr: 'Haritada konumunuzu aç',
        de: 'Adresse in Karten öffnen',
        es: 'Abrir la dirección en mapas',
      }),
      qrData: { query: businessName },
    }),
  ];
}

function hotelKit(businessName: string, locale: CampaignLocale, accent: string): CampaignQrItem[] {
  const site = 'https://yourhotel.com';
  return [
    item({
      name: t(locale, {
        en: 'Hotel homepage',
        tr: 'Otel ana sayfa',
        de: 'Hotel-Startseite',
        es: 'Página del hotel',
      }),
      category: 'url',
      purpose: t(locale, {
        en: 'Bookings and info',
        tr: 'Rezervasyon ve bilgi',
        de: 'Buchungen und Infos',
        es: 'Reservas e información',
      }),
      qrData: { url: site },
      templateId: 'hotels-hospitality',
      landingEnabled: true,
      landingPage: landingFrom(
        businessName,
        t(locale, { en: 'Welcome', tr: 'Hoş geldiniz', de: 'Willkommen', es: 'Bienvenido' }),
        'hotel',
        accent,
        locale
      ),
      style: templateStyle('hotels-hospitality'),
    }),
    item({
      name: t(locale, {
        en: 'Guest Wi‑Fi',
        tr: 'Misafir Wi‑Fi',
        de: 'Gäste-WLAN',
        es: 'Wi‑Fi para huéspedes',
      }),
      category: 'wifi',
      purpose: t(locale, {
        en: 'Lobby and in-room Wi‑Fi',
        tr: 'Lobi ve odalarda Wi‑Fi',
        de: 'WLAN in Lobby und Zimmer',
        es: 'Wi‑Fi en lobby y habitaciones',
      }),
      qrData: { ssid: 'Hotel_Guest', password: 'staywithus', encryption: 'WPA' },
      style: templateStyle('wifi-guest'),
    }),
    item({
      name: t(locale, {
        en: 'Concierge links',
        tr: 'Concierge bağlantıları',
        de: 'Concierge-Links',
        es: 'Enlaces de conserjería',
      }),
      category: 'link_hub',
      purpose: t(locale, {
        en: 'Room service, spa, check-in',
        tr: 'Oda servisi, spa, check-in',
        de: 'Zimmerservice, Spa, Check-in',
        es: 'Servicio a la habitación, spa, check-in',
      }),
      qrData: { url: site },
      landingEnabled: true,
      landingPage: {
        ...landingFrom(businessName, 'Concierge', 'hotel', accent, locale),
        hubMode: true,
        hubLinks: [
          {
            label: t(locale, {
              en: 'Room service',
              tr: 'Oda servisi',
              de: 'Zimmerservice',
              es: 'Servicio a la habitación',
            }),
            url: `${site}/room-service`,
          },
          { label: 'Spa', url: `${site}/spa` },
          { label: 'Check-in', url: `${site}/checkin` },
        ],
      },
    }),
  ];
}

function eventKit(businessName: string, locale: CampaignLocale, accent: string): CampaignQrItem[] {
  const reg = 'https://yourevent.com/register';
  return [
    item({
      name: t(locale, {
        en: 'Event registration',
        tr: 'Etkinlik kaydı',
        de: 'Event-Anmeldung',
        es: 'Registro del evento',
      }),
      category: 'url',
      purpose: t(locale, {
        en: 'Registration and tickets',
        tr: 'Kayıt ve bilet',
        de: 'Anmeldung und Tickets',
        es: 'Registro y entradas',
      }),
      qrData: { url: reg },
      templateId: 'event-registration',
      landingEnabled: true,
      landingPage: landingFrom(
        businessName,
        t(locale, {
          en: 'Register now',
          tr: 'Kayıt olun',
          de: 'Jetzt anmelden',
          es: 'Regístrate ahora',
        }),
        'event',
        accent,
        locale
      ),
      style: templateStyle('event-registration'),
    }),
    item({
      name: t(locale, {
        en: 'Add to calendar',
        tr: 'Takvime ekle',
        de: 'Zum Kalender hinzufügen',
        es: 'Añadir al calendario',
      }),
      category: 'event',
      purpose: t(locale, {
        en: 'Calendar invite',
        tr: 'Takvim dosyası',
        de: 'Kalendereinladung',
        es: 'Invitación de calendario',
      }),
      qrData: {
        title: businessName,
        start: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
        end: new Date(Date.now() + 7 * 86400000 + 2 * 3600000).toISOString().slice(0, 16),
        location: businessName,
      },
    }),
    item({
      name: t(locale, {
        en: 'Event links',
        tr: 'Etkinlik bağlantıları',
        de: 'Event-Links',
        es: 'Enlaces del evento',
      }),
      category: 'link_hub',
      purpose: t(locale, {
        en: 'Agenda, venue, social',
        tr: 'Program, konum, sosyal',
        de: 'Programm, Ort, Social',
        es: 'Agenda, sede y redes',
      }),
      qrData: { url: reg },
      landingEnabled: true,
      landingPage: {
        ...landingFrom(
          businessName,
          t(locale, {
            en: 'Event hub',
            tr: 'Etkinlik merkezi',
            de: 'Event-Hub',
            es: 'Centro del evento',
          }),
          'event',
          accent,
          locale
        ),
        hubMode: true,
        hubLinks: [
          {
            label: t(locale, { en: 'Register', tr: 'Kayıt', de: 'Anmelden', es: 'Registrarse' }),
            url: reg,
          },
          {
            label: t(locale, { en: 'Agenda', tr: 'Program', de: 'Programm', es: 'Agenda' }),
            url: `${reg}/agenda`,
          },
          { label: 'Instagram', url: 'https://instagram.com/' },
        ],
      },
    }),
  ];
}

function generalKit(businessName: string, locale: CampaignLocale, accent: string): CampaignQrItem[] {
  const site = 'https://yourbusiness.com';
  return [
    item({
      name: t(locale, {
        en: 'Main website',
        tr: 'Ana web sitesi',
        de: 'Hauptwebsite',
        es: 'Sitio web principal',
      }),
      category: 'url',
      purpose: t(locale, {
        en: 'Primary campaign link',
        tr: 'Ana kampanya bağlantısı',
        de: 'Primärer Kampagnenlink',
        es: 'Enlace principal de la campaña',
      }),
      qrData: { url: site },
      landingEnabled: true,
      landingPage: landingFrom(
        businessName,
        t(locale, {
          en: 'Learn more',
          tr: 'Daha fazla bilgi',
          de: 'Mehr erfahren',
          es: 'Más información',
        }),
        'business',
        accent,
        locale
      ),
    }),
    item({
      name: t(locale, {
        en: 'Digital business card',
        tr: 'Dijital kartvizit',
        de: 'Digitale Visitenkarte',
        es: 'Tarjeta de visita digital',
      }),
      category: 'vcard',
      purpose: t(locale, {
        en: 'Save contact details',
        tr: 'İletişim bilgilerini kaydet',
        de: 'Kontaktdaten speichern',
        es: 'Guardar datos de contacto',
      }),
      qrData: {
        firstName: businessName.split(' ')[0] ?? 'Contact',
        lastName:
          businessName.split(' ').slice(1).join(' ') ||
          t(locale, { en: 'Business', tr: 'İşletme', de: 'Unternehmen', es: 'Negocio' }),
        email: 'hello@yourbusiness.com',
        phone: '+10000000000',
        org: businessName,
      },
      templateId: 'business-card',
      style: templateStyle('business-card'),
    }),
    item({
      name: t(locale, {
        en: 'Link hub',
        tr: 'Tüm bağlantılar',
        de: 'Link-Hub',
        es: 'Centro de enlaces',
      }),
      category: 'link_hub',
      purpose: t(locale, {
        en: 'One QR, multiple buttons',
        tr: 'Tek QR, birden fazla buton',
        de: 'Ein QR, mehrere Buttons',
        es: 'Un QR, varios botones',
      }),
      qrData: { url: site },
      landingEnabled: true,
      landingPage: {
        ...landingFrom(
          businessName,
          t(locale, {
            en: 'Follow us',
            tr: 'Bizi takip edin',
            de: 'Folgen Sie uns',
            es: 'Síguenos',
          }),
          'minimal',
          accent,
          locale
        ),
        hubMode: true,
        hubLinks: [
          {
            label: t(locale, { en: 'Website', tr: 'Web sitesi', de: 'Website', es: 'Sitio web' }),
            url: site,
          },
          { label: 'Instagram', url: 'https://instagram.com/' },
          {
            label: t(locale, { en: 'Contact', tr: 'İletişim', de: 'Kontakt', es: 'Contacto' }),
            url: `mailto:hello@yourbusiness.com`,
          },
        ],
      },
    }),
  ];
}

const PRINT_BY_INDUSTRY: Record<IndustryKey, { en: string[]; tr: string[]; de: string[]; es: string[] }> = {
  restaurant: {
    en: ['A4 table tent', 'Window poster', 'Menu insert', 'Instagram story'],
    tr: ['Masa tent kartı', 'Vitrin posteri', 'Menü insert', 'Instagram story'],
    de: ['A4 Tischaufsteller', 'Schaufensterposter', 'Speisekarten-Beilage', 'Instagram Story'],
    es: ['Carte de mesa A4', 'Póster de escaparate', 'Inserto de menú', 'Historia de Instagram'],
  },
  cafe: {
    en: ['Counter stand', 'Cup sleeve sticker', 'A5 flyer'],
    tr: ['Tezgah standı', 'Bardak sticker', 'A5 el ilanı'],
    de: ['Thekenaufsteller', 'Becherhülle-Sticker', 'A5 Flyer'],
    es: ['Soporte de mostrador', 'Sticker de vaso', 'Folleto A5'],
  },
  hotel: {
    en: ['Room card', 'Lobby standee', 'Elevator poster'],
    tr: ['Oda kartı', 'Lobi standı', 'Asansör posteri'],
    de: ['Zimmerkarte', 'Lobby-Aufsteller', 'Aufzugsposter'],
    es: ['Tarjeta de habitación', 'Totem de lobby', 'Póster de ascensor'],
  },
  event: {
    en: ['Registration banner', 'Badge insert', 'Email footer QR'],
    tr: ['Kayıt banner', 'Rozet QR', 'E-posta alt bilgi QR'],
    de: ['Anmelde-Banner', 'Badge-Beilage', 'E-Mail-Fußzeilen-QR'],
    es: ['Banner de registro', 'Inserto de credencial', 'QR en pie de email'],
  },
  wedding: {
    en: ['Table card', 'Invitation insert', 'Photo booth sign'],
    tr: ['Masa kartı', 'Davetiye insert', 'Foto kabin tabelası'],
    de: ['Tischkarte', 'Einladungsbeilage', 'Fotobox-Schild'],
    es: ['Tarjeta de mesa', 'Inserto de invitación', 'Cartel de fotomatón'],
  },
  gym: {
    en: ['Entrance poster', 'Class schedule card'],
    tr: ['Giriş posteri', 'Ders programı kartı'],
    de: ['Eingangsposter', 'Kursplan-Karte'],
    es: ['Póster de entrada', 'Tarjeta de horarios'],
  },
  salon: {
    en: ['Mirror sticker', 'Reception desk stand'],
    tr: ['Ayna sticker', 'Resepsiyon standı'],
    de: ['Spiegel-Sticker', 'Empfangs-Aufsteller'],
    es: ['Sticker de espejo', 'Soporte de recepción'],
  },
  retail: {
    en: ['Product tag', 'Checkout counter', 'Shopping bag sticker'],
    tr: ['Ürün etiketi', 'Kasa önü', 'Poşet sticker'],
    de: ['Produktanhänger', 'Kassenaufsteller', 'Tragetaschen-Sticker'],
    es: ['Etiqueta de producto', 'Mostrador de caja', 'Sticker de bolsa'],
  },
  agency: {
    en: ['Proposal cover', 'Case study one-pager'],
    tr: ['Teklif kapağı', 'Vaka çalışması sayfası'],
    de: ['Angebotsdeckblatt', 'Case-Study-Einseiter'],
    es: ['Portada de propuesta', 'Página de caso de estudio'],
  },
  healthcare: {
    en: ['Waiting room poster', 'Appointment card'],
    tr: ['Bekleme odası posteri', 'Randevu kartı'],
    de: ['Wartezimmer-Poster', 'Terminkarte'],
    es: ['Póster de sala de espera', 'Tarjeta de cita'],
  },
  general: {
    en: ['A4 poster', 'Business card back', 'Flyer'],
    tr: ['A4 poster', 'Kartvizit arkası', 'El ilanı'],
    de: ['A4 Poster', 'Visitenkarten-Rückseite', 'Flyer'],
    es: ['Póster A4', 'Reverso de tarjeta', 'Folleto'],
  },
};

const SUMMARY: Record<IndustryKey, { en: string; tr: string; de: string; es: string }> = {
  restaurant: {
    en: 'A complete restaurant launch kit: menu, Wi‑Fi, reviews, social links and print-ready ideas.',
    tr: 'Tam restoran açılış kiti: menü, Wi‑Fi, yorumlar, sosyal bağlantılar ve baskı önerileri.',
    de: 'Komplettes Restaurant-Starterkit: Speisekarte, WLAN, Bewertungen, Social Links und Druckideen.',
    es: 'Kit completo de apertura: menú, Wi‑Fi, reseñas, redes sociales e ideas de impresión.',
  },
  cafe: {
    en: 'Café campaign with menu link, guest Wi‑Fi and social growth QR codes.',
    tr: 'Kafe kampanyası: menü, misafir Wi‑Fi ve sosyal büyüme QR kodları.',
    de: 'Café-Kampagne mit Speisekarte, Gäste-WLAN und Social-Growth-QR-Codes.',
    es: 'Campaña de café con menú, Wi‑Fi de invitados y QR de crecimiento social.',
  },
  hotel: {
    en: 'Hotel guest journey: homepage, Wi‑Fi and concierge link hub.',
    tr: 'Otel misafir yolculuğu: ana sayfa, Wi‑Fi ve concierge link hub.',
    de: 'Hotel-Gästejourney: Startseite, WLAN und Concierge-Link-Hub.',
    es: 'Recorrido del huésped: página principal, Wi‑Fi y hub de conserjería.',
  },
  event: {
    en: 'Event registration, calendar invite and multi-link hub for attendees.',
    tr: 'Etkinlik kaydı, takvim daveti ve katılımcılar için çoklu link hub.',
    de: 'Event-Anmeldung, Kalendereinladung und Multi-Link-Hub für Teilnehmende.',
    es: 'Registro del evento, invitación de calendario y hub de enlaces para asistentes.',
  },
  wedding: {
    en: 'Wedding guest kit with RSVP, gallery and link hub.',
    tr: 'Düğün misafir kiti: RSVP, galeri ve link hub.',
    de: 'Hochzeitsgäste-Kit mit RSVP, Galerie und Link-Hub.',
    es: 'Kit de invitados de boda con RSVP, galería y hub de enlaces.',
  },
  gym: {
    en: 'Gym membership and class info QR campaign.',
    tr: 'Spor salonu üyelik ve ders bilgisi QR kampanyası.',
    de: 'Fitnessstudio-Kampagne für Mitgliedschaft und Kursinfos.',
    es: 'Campaña QR de membresía e información de clases.',
  },
  salon: {
    en: 'Salon booking and social follow QR set.',
    tr: 'Salon randevu ve sosyal takip QR seti.',
    de: 'Salon-Set für Buchung und Social Follow.',
    es: 'Set QR de reserva de salón y seguimiento en redes.',
  },
  retail: {
    en: 'Retail store links, promotions and contact QR bundle.',
    tr: 'Perakende mağaza linkleri, promosyon ve iletişim QR paketi.',
    de: 'Einzelhandels-Paket: Links, Aktionen und Kontakt-QR.',
    es: 'Paquete QR de tienda: enlaces, promociones y contacto.',
  },
  agency: {
    en: 'Agency portfolio hub and contact card campaign.',
    tr: 'Ajans portföy hub ve kartvizit kampanyası.',
    de: 'Agentur-Kampagne mit Portfolio-Hub und Visitenkarte.',
    es: 'Campaña de agencia con hub de portafolio y tarjeta de contacto.',
  },
  healthcare: {
    en: 'Clinic info, appointment and contact QR kit.',
    tr: 'Klinik bilgi, randevu ve iletişim QR kiti.',
    de: 'Klinik-Kit: Infos, Termin und Kontakt-QR.',
    es: 'Kit QR de clínica: información, cita y contacto.',
  },
  general: {
    en: 'Starter business campaign: website, vCard and link hub.',
    tr: 'Başlangıç işletme kampanyası: web sitesi, vCard ve link hub.',
    de: 'Starter-Kampagne: Website, vCard und Link-Hub.',
    es: 'Campaña inicial: sitio web, vCard y hub de enlaces.',
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
    summary: t(locale, SUMMARY[industry]),
    accentColor: accent,
    items: items.slice(0, 8),
    printSuggestions: t(locale, print),
    source: 'template',
  };
}
