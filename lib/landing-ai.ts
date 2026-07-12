import type { LandingPageData } from '@/lib/landing-page';
import { emptyLandingPage } from '@/lib/landing-page';
import type { AiLocale } from '@/lib/i18n/ai-locale';

type Locale = AiLocale;

type CopyPack = { title: string; subtitle: string; cta: string; seoTitle: string };

const COPY: Record<string, Record<Locale, CopyPack>> = {
  menu: {
    en: {
      title: 'View our menu',
      subtitle: 'Scan succeeded — browse today’s dishes and specials.',
      cta: 'Open menu',
      seoTitle: 'Restaurant menu',
    },
    tr: {
      title: 'Menümüzü görüntüleyin',
      subtitle: 'Tarama başarılı — güncel menü ve kampanyalarımıza göz atın.',
      cta: 'Menüyü aç',
      seoTitle: 'Restoran menüsü',
    },
    de: {
      title: 'Speisekarte ansehen',
      subtitle: 'Scan erfolgreich — entdecken Sie Gerichte und Specials.',
      cta: 'Speisekarte öffnen',
      seoTitle: 'Restaurantspeisekarte',
    },
    es: {
      title: 'Ver nuestro menú',
      subtitle: 'Escaneo correcto — consulta platos y especiales de hoy.',
      cta: 'Abrir menú',
      seoTitle: 'Menú del restaurante',
    },
  },
  restaurant: {
    en: {
      title: 'Welcome',
      subtitle: 'Thanks for scanning — explore our menu and offers.',
      cta: 'Continue',
      seoTitle: 'Welcome',
    },
    tr: {
      title: 'Hoş geldiniz',
      subtitle: 'Tarama için teşekkürler — menü ve fırsatlarımızı keşfedin.',
      cta: 'Devam et',
      seoTitle: 'Hoş geldiniz',
    },
    de: {
      title: 'Willkommen',
      subtitle: 'Danke für den Scan — entdecken Sie Speisekarte und Angebote.',
      cta: 'Weiter',
      seoTitle: 'Willkommen',
    },
    es: {
      title: 'Bienvenido',
      subtitle: 'Gracias por escanear — explora nuestro menú y ofertas.',
      cta: 'Continuar',
      seoTitle: 'Bienvenido',
    },
  },
  event: {
    en: {
      title: 'You’re invited',
      subtitle: 'Get event details, schedule and registration in one tap.',
      cta: 'View event',
      seoTitle: 'Event details',
    },
    tr: {
      title: 'Davetlisiniz',
      subtitle: 'Etkinlik detayları, program ve kayıt tek dokunuşla.',
      cta: 'Etkinliği gör',
      seoTitle: 'Etkinlik detayları',
    },
    de: {
      title: 'Sie sind eingeladen',
      subtitle: 'Event-Details, Programm und Anmeldung mit einem Tippen.',
      cta: 'Event ansehen',
      seoTitle: 'Event-Details',
    },
    es: {
      title: 'Estás invitado',
      subtitle: 'Detalles, agenda y registro del evento en un toque.',
      cta: 'Ver evento',
      seoTitle: 'Detalles del evento',
    },
  },
  vcard: {
    en: {
      title: 'Save my contact',
      subtitle: 'Add my details to your phone in seconds.',
      cta: 'Save contact',
      seoTitle: 'Digital business card',
    },
    tr: {
      title: 'İletişimimi kaydedin',
      subtitle: 'Bilgilerimi saniyeler içinde telefonunuza ekleyin.',
      cta: 'Kişiyi kaydet',
      seoTitle: 'Dijital kartvizit',
    },
    de: {
      title: 'Kontakt speichern',
      subtitle: 'Fügen Sie meine Daten in Sekunden Ihrem Handy hinzu.',
      cta: 'Kontakt speichern',
      seoTitle: 'Digitale Visitenkarte',
    },
    es: {
      title: 'Guarda mi contacto',
      subtitle: 'Añade mis datos a tu teléfono en segundos.',
      cta: 'Guardar contacto',
      seoTitle: 'Tarjeta de visita digital',
    },
  },
  url: {
    en: {
      title: 'Thanks for scanning',
      subtitle: 'Tap below to continue to our page.',
      cta: 'Continue',
      seoTitle: 'Welcome',
    },
    tr: {
      title: 'Tarama için teşekkürler',
      subtitle: 'Sayfamıza devam etmek için aşağıya dokunun.',
      cta: 'Devam et',
      seoTitle: 'Hoş geldiniz',
    },
    de: {
      title: 'Danke für den Scan',
      subtitle: 'Tippen Sie unten, um zu unserer Seite zu gelangen.',
      cta: 'Weiter',
      seoTitle: 'Willkommen',
    },
    es: {
      title: 'Gracias por escanear',
      subtitle: 'Toca abajo para continuar a nuestra página.',
      cta: 'Continuar',
      seoTitle: 'Bienvenido',
    },
  },
};

function pickCategory(category: string): string {
  if (category === 'menu') return 'menu';
  if (['event', 'wedding'].includes(category)) return 'event';
  if (category === 'vcard') return 'vcard';
  return 'url';
}

export function generateLandingPageCopy(
  category: string,
  qrName: string | undefined,
  locale: Locale = 'en'
): Partial<LandingPageData> {
  const key = pickCategory(category);
  const pack = COPY[key]?.[locale] ?? COPY.url[locale] ?? COPY.url.en;
  const name = qrName?.trim();

  return {
    ...emptyLandingPage,
    title: name || pack.title,
    subtitle: pack.subtitle,
    ctaLabel: pack.cta,
    seo: {
      metaTitle: name ? `${name} | ${pack.seoTitle}` : pack.seoTitle,
      metaDescription: pack.subtitle,
      indexable: false,
    },
  };
}
