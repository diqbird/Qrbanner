import type { SolutionPage } from '@/lib/solutions';
import type { Locale } from './types';
import { SOLUTION_COPY_TR } from './solution-copy-tr';
import { SOLUTION_COPY_DE } from './solution-copy-de';
import { SOLUTION_COPY_ES } from './solution-copy-es';
import { SOLUTION_PLATFORM_FEATURES_TR, SOLUTION_SECTOR_TR } from './solution-sector-tr';
import { SOLUTION_PLATFORM_FEATURES_DE, SOLUTION_SECTOR_DE } from './solution-sector-de';
import { SOLUTION_PLATFORM_FEATURES_ES, SOLUTION_SECTOR_ES } from './solution-sector-es';

function sectorLabel(page: SolutionPage, locale: Locale): string {
  if (locale === 'tr' && SOLUTION_SECTOR_TR[page.slug]) return SOLUTION_SECTOR_TR[page.slug];
  if (locale === 'de' && SOLUTION_SECTOR_DE[page.slug]) return SOLUTION_SECTOR_DE[page.slug];
  if (locale === 'es' && SOLUTION_SECTOR_ES[page.slug]) return SOLUTION_SECTOR_ES[page.slug];
  return page.title.replace(/\s+QR Code$/i, '').replace(/\s+QR$/i, '');
}

function buildSolutionTrTemplate(page: SolutionPage): SolutionPage {
  const sector = sectorLabel(page, 'tr');
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

function buildSolutionDeTemplate(page: SolutionPage): SolutionPage {
  const sector = sectorLabel(page, 'de');
  const sectorLower = sector.charAt(0).toLocaleLowerCase('de') + sector.slice(1);

  return {
    ...page,
    title: `${sector} QR-Code`,
    headline: `Dynamische QR-Codes für ${sector}`,
    description: `Erstellen Sie dynamische QR-Codes für ${sectorLower}. Ziele ohne Neudruck aktualisieren und Scans in Echtzeit verfolgen.`,
    metaDescription: `QR-Code-Generator für ${sectorLower}: Scan-Analysen, Geofencing, Webhook-Automatisierung und druckfertige Designs. Kostenlos mit QRbanner starten.`,
    keywords: [
      `${sector} QR-Code`,
      `${sectorLower} QR Code`,
      'dynamischer QR-Code',
      'QR-Code Generator',
      'QRbanner',
    ],
    benefits: [
      'Links und Kampagnenziele sofort aktualisieren',
      'Scans nach Gerät, Standort und Zeitzone analysieren',
      'Funktioniert auf jedem Smartphone ohne App-Download',
      'Geofencing- und zeitbasierte Routing-Regeln',
    ],
    features: [...page.features.slice(0, Math.max(0, page.features.length - 4)), ...SOLUTION_PLATFORM_FEATURES_DE],
    steps: [
      {
        title: 'Vorlage wählen',
        description: `Assistenten mit vorausgefüllten Feldern für ${sector} öffnen.`,
      },
      {
        title: 'Inhalt hinzufügen',
        description: 'URL, PDF, vCard oder Menü-Link einfügen.',
      },
      {
        title: 'Designen & exportieren',
        description: 'Logo hinzufügen, Scannability prüfen und druckfertiges PNG exportieren.',
      },
    ],
    faq: [
      {
        q: 'Muss ich den gedruckten QR-Code austauschen?',
        a: 'Nein. Bei dynamischen QR-Codes aktualisieren Sie das Ziel im Dashboard — das gedruckte Muster bleibt gleich.',
      },
      {
        q: 'Was ist im kostenlosen Plan enthalten?',
        a: 'Dynamische QR-Codes, Scan-Analysen und REST-API-Zugang sind im Free-Plan enthalten.',
      },
    ],
  };
}

function buildSolutionEsTemplate(page: SolutionPage): SolutionPage {
  const sector = sectorLabel(page, 'es');
  const sectorLower = sector.charAt(0).toLocaleLowerCase('es') + sector.slice(1);

  return {
    ...page,
    title: `Código QR ${sector}`,
    headline: `Códigos QR dinámicos para ${sector}`,
    description: `Crea códigos QR dinámicos para ${sectorLower}. Actualiza destinos sin reimprimir y sigue los escaneos en tiempo real.`,
    metaDescription: `Generador de códigos QR para ${sectorLower}: analítica de escaneos, geovallas, automatización con webhooks y diseños listos para imprimir. Empieza gratis con QRbanner.`,
    keywords: [
      `código QR ${sectorLower}`,
      `${sectorLower} QR`,
      'código QR dinámico',
      'generador de códigos QR',
      'QRbanner',
    ],
    benefits: [
      'Actualiza enlaces y objetivos de campaña al instante',
      'Analiza escaneos por dispositivo, ubicación y zona horaria',
      'Funciona en cualquier móvil sin instalar apps',
      'Reglas de enrutamiento geográfico y por horario',
    ],
    features: [...page.features.slice(0, Math.max(0, page.features.length - 4)), ...SOLUTION_PLATFORM_FEATURES_ES],
    steps: [
      {
        title: 'Elige una plantilla',
        description: `Abre el asistente con campos predefinidos para ${sector}.`,
      },
      {
        title: 'Añade el contenido',
        description: 'Pega la URL, PDF, vCard o enlace del menú.',
      },
      {
        title: 'Diseña y descarga',
        description: 'Añade tu logo, comprueba la legibilidad y exporta PNG listo para imprimir.',
      },
    ],
    faq: [
      {
        q: '¿Debo cambiar el código QR impreso?',
        a: 'No. Con códigos QR dinámicos actualizas el destino en el panel; el patrón impreso no cambia.',
      },
      {
        q: '¿Qué incluye el plan gratuito?',
        a: 'El plan gratuito incluye códigos QR dinámicos, analítica de escaneos y acceso a la API REST.',
      },
    ],
  };
}

export function localizeSolutionPage(page: SolutionPage, locale: Locale): SolutionPage {
  if (locale === 'tr') {
    const custom = SOLUTION_COPY_TR[page.slug];
    if (custom) return { ...page, ...custom };
    return buildSolutionTrTemplate(page);
  }
  if (locale === 'de') {
    const custom = SOLUTION_COPY_DE[page.slug];
    if (custom) return { ...page, ...custom };
    return buildSolutionDeTemplate(page);
  }
  if (locale === 'es') {
    const custom = SOLUTION_COPY_ES[page.slug];
    if (custom) return { ...page, ...custom };
    return buildSolutionEsTemplate(page);
  }
  return page;
}

export function solutionSectorLabel(slug: string, locale: Locale, fallbackTitle: string): string {
  if (locale === 'tr' && SOLUTION_SECTOR_TR[slug]) return SOLUTION_SECTOR_TR[slug];
  if (locale === 'de' && SOLUTION_SECTOR_DE[slug]) return SOLUTION_SECTOR_DE[slug];
  if (locale === 'es' && SOLUTION_SECTOR_ES[slug]) return SOLUTION_SECTOR_ES[slug];
  return fallbackTitle.replace(/\s+QR Code$/i, '').replace(/\s+QR$/i, '');
}
