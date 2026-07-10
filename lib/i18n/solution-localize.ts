import type { SolutionPage } from '@/lib/solutions';
import type { Locale } from './types';
import { SOLUTION_COPY_TR } from './solution-copy-tr';
import { SOLUTION_PLATFORM_FEATURES_TR, SOLUTION_SECTOR_TR } from './solution-sector-tr';

function sectorTr(page: SolutionPage): string {
  return SOLUTION_SECTOR_TR[page.slug] ?? page.title.replace(/\s+QR Code$/i, '').replace(/\s+QR$/i, '');
}

function buildSolutionTrTemplate(page: SolutionPage): SolutionPage {
  const sector = sectorTr(page);
  const sectorLower = sector.charAt(0).toLocaleLowerCase('tr') + sector.slice(1);

  return {
    ...page,
    title: `${sector} QR Kodu`,
    headline: `${sector} için dinamik QR kodları`,
    description: `${sector} işletmeniz veya kampanyanız için dinamik QR kodları oluşturun. Hedef linkleri yeniden baskı yapmadan güncelleyin ve taramaları gerçek zamanlı izleyin.`,
    metaDescription: `${sector} için QR kod oluşturucu: tarama analitiği, coğrafi yönlendirme, webhook otomasyonları ve baskıya hazır tasarımlar. QRbanner ile ücretsiz başlayın.`,
    keywords: [
      `${sector} QR kodu`,
      `${sectorLower} QR kod`,
      'dinamik QR kod',
      'QR kod oluşturucu',
      'QRbanner',
    ],
    benefits: [
      'Linkleri ve kampanya hedeflerini anında güncelleyin',
      'Taramaları cihaz, konum ve saat dilimine göre analiz edin',
      'Her telefonda uygulama indirmeden çalışır',
      'Coğrafi ve zaman bazlı yönlendirme kuralları',
    ],
    features: [...page.features.slice(0, Math.max(0, page.features.length - 4)), ...SOLUTION_PLATFORM_FEATURES_TR],
    steps: [
      {
        title: 'Şablonu seçin',
        description: `${sector} için hazır alanlarla oluşturma sihirbazını açın.`,
      },
      {
        title: 'İçeriği ekleyin',
        description: 'URL, PDF, vCard veya menü bağlantınızı yapıştırın.',
      },
      {
        title: 'Tasarlayıp indirin',
        description: 'Logonuzu ekleyin, taranabilirliği kontrol edin ve baskıya hazır PNG alın.',
      },
    ],
    faq: [
      {
        q: 'Basılı QR kodu değiştirmem gerekir mi?',
        a: 'Hayır. Dinamik QR’da panelden hedef linki güncellersiniz; baskıdaki desen aynı kalır.',
      },
      {
        q: 'Ücretsiz planda neler var?',
        a: 'Ücretsiz planda dinamik QR kod, tarama analitiği ve REST API erişimi bulunur.',
      },
    ],
  };
}

export function localizeSolutionPage(page: SolutionPage, locale: Locale): SolutionPage {
  if (locale !== 'tr') return page;
  const custom = SOLUTION_COPY_TR[page.slug];
  if (custom) return { ...page, ...custom };
  return buildSolutionTrTemplate(page);
}

export function solutionSectorLabel(slug: string, locale: Locale, fallbackTitle: string): string {
  if (locale === 'tr' && SOLUTION_SECTOR_TR[slug]) return SOLUTION_SECTOR_TR[slug];
  return fallbackTitle.replace(/\s+QR Code$/i, '').replace(/\s+QR$/i, '');
}
