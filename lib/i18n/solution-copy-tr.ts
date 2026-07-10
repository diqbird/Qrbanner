import type { SolutionPage } from '@/lib/solutions';
import { SOLUTION_PLATFORM_FEATURES_TR } from './solution-sector-tr';

/**
 * Hand-curated Turkish copy for high-traffic solution pages.
 * Other slugs use template localization in `solution-localize.ts`.
 */
export const SOLUTION_COPY_TR: Record<string, Partial<SolutionPage>> = {
  'restaurant-menu': {
    title: 'Restoran Menü QR Kodu',
    headline: 'Masada taranan dijital menüler',
    description:
      'Kağıt menüleri dinamik bir QR kodu ile değiştirin. Fiyatları, alerjenleri ve günlük spesiyalleri yeniden baskı yapmadan güncelleyin.',
    metaDescription:
      'Masa ve tezgah için restoran menü QR kodu oluşturun. Menünüzü çevrimiçi güncelleyin, yeniden baskı yapmayın. Tarama analitiği olan ücretsiz QR oluşturucu.',
    keywords: ['restoran menü QR kodu', 'dijital menü QR', 'masa QR menü', 'kafe menü QR'],
    benefits: [
      'Fiyatları ve spesiyalleri anında güncelleyin',
      'Menü açılışlarını konuma ve saate göre takip edin',
      'Her telefonda çalışır — uygulama gerekmez',
      'Öğle/akşam yönlendirmesi ile farklı menüler',
    ],
    features: [
      'Menü PDF veya web URL’si ile açılış sayfası',
      'Personel menüleri için parola koruması',
      'Taramada GA4 ve Meta Pixel',
      ...SOLUTION_PLATFORM_FEATURES_TR,
    ],
    steps: [
      { title: 'Restoran şablonunu seçin', description: 'Menü URL’si, mekân adı ve Wi‑Fi notları için hazır alanlar.' },
      { title: 'Menü bağlantınızı ekleyin', description: 'Web sitenize, PDF’e veya menü platformunuza bağlayın.' },
      { title: 'Masa tentlerine basın', description: 'PNG veya baskıya hazır banner indirip masalara yerleştirin.' },
    ],
    faq: [
      {
        q: 'Her masada aynı QR kodu kullanabilir miyim?',
        a: 'Evet. Tek dinamik kod her yerde çalışır. Detaylı analitik için oda veya bölgeye özel kodlar kullanabilirsiniz.',
      },
      {
        q: 'Menüm günlük değişiyorsa ne olur?',
        a: 'Panelden hedef URL veya PDF’i güncellersiniz — basılı QR deseni aynı kalır.',
      },
    ],
  },
  'business-card': {
    title: 'Dijital Kartvizit QR Kodu',
    headline: 'Tek taramayla kişiniz telefona kaydedilir',
    description:
      'Kartvizitinizi taranabilir bir QR koda dönüştürün. Ad, telefon, e-posta ve web siteniz tek dokunuşla kaydedilir.',
    metaDescription:
      'Dijital kartvizit QR kodu oluşturun. Kart, yaka kartı ve e-posta imzalarında paylaşın; taramaları izleyin.',
    keywords: ['kartvizit QR kodu', 'vCard QR oluşturucu', 'dijital kartvizit QR'],
    benefits: [
      'Yazmaya gerek yok — kişi doğrudan telefona kaydedilir',
      'Bilgilerinizi yeniden baskı yapmadan güncelleyin',
      'Kartvizitinizin ne sıklıkla tarandığını görün',
      'Ekip üyeleri için toplu kartvizit QR’ları',
    ],
    features: [
      'vCard formatında kişi kaydı',
      'Logo ve marka renkleriyle özelleştirme',
      'Tarama analitiği ve webhook bildirimleri',
      ...SOLUTION_PLATFORM_FEATURES_TR,
    ],
    steps: [
      { title: 'Kartvizit şablonunu açın', description: 'Ad, unvan, telefon ve e-posta alanlarını doldurun.' },
      { title: 'Stilinizi seçin', description: 'Renk, logo ve çerçeve ile markanıza uyarlayın.' },
      { title: 'Kartlara ve rozetlere basın', description: 'PNG indirin veya baskı banner’ı dışa aktarın.' },
    ],
    faq: [
      {
        q: 'iPhone ve Android’de çalışır mı?',
        a: 'Evet. vCard QR kodları her iki platformda da kişi kaydı açar.',
      },
      {
        q: 'İş değiştirdiğimde yeni kart mı basmalıyım?',
        a: 'Hayır. Panelden bilgilerinizi güncelleyin; aynı QR kodu güncel kalır.',
      },
    ],
  },
};
