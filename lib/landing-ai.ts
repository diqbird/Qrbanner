import type { LandingPageData } from '@/lib/landing-page';
import { emptyLandingPage } from '@/lib/landing-page';

type Locale = 'en' | 'tr';

const COPY: Record<string, Record<Locale, { title: string; subtitle: string; cta: string; seoTitle: string }>> = {
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
  const pack = COPY[key]?.[locale] ?? COPY.url[locale];
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
