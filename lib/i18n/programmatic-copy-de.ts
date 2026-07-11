import type { UseCasePage } from '@/lib/use-case-pages';
import type { QrTypePage } from '@/lib/qr-type-pages';

const USE_CASE_BENEFITS_DE = [
  'Ziele ohne Neudruck aktualisieren',
  'Scans nach Region und Gerät analysieren',
  'Marken-Logo und Farben anpassen',
  'Co-Marketing mit zeit- und standortbasierten Regeln',
];

const USE_CASE_STEPS_DE = [
  'Dynamischen QR-Code im Assistenten erstellen',
  'Logo und Markenfarben hinzufügen',
  'Als PNG, SVG oder Print-Banner exportieren',
  'Scans im Dashboard in Echtzeit verfolgen',
];

function useCaseTopic(page: UseCasePage): string {
  return page.title
    .replace(/^QR Codes (on|for) /i, '')
    .replace(/ QR Codes?$/i, '')
    .trim();
}

export function buildUseCaseDeTemplate(page: UseCasePage): UseCasePage {
  const topic = useCaseTopic(page);
  const topicLower = topic.charAt(0).toLocaleLowerCase('de') + topic.slice(1);

  return {
    ...page,
    title: `QR-Codes für ${topic}`,
    headline: `${topic}: dynamische QR-Codes für bessere Ergebnisse`,
    metaDescription: `Dynamische QR-Codes für ${topicLower}. Analysen, Geofencing und API — kostenlos mit QRbanner starten.`,
    description: `Erstellen Sie QR-Codes für ${topicLower}. Ziele jederzeit im Dashboard ändern und Scans messen — ohne Neudruck.`,
    benefits: page.benefits.length >= 4 ? USE_CASE_BENEFITS_DE : page.benefits,
    steps: USE_CASE_STEPS_DE,
  };
}

export function buildQrTypeDeTemplate(page: QrTypePage): QrTypePage {
  const typeName = page.title.replace(/ QR Code$/i, '').trim();

  return {
    ...page,
    title: `${typeName} QR-Code`,
    headline: `${typeName} — QR-Code mit Analysen und Branding`,
    metaDescription: `${typeName} QR-Code erstellen: dynamisch, markenkonform und mit Scan-Analysen. Kostenlos mit QRbanner.`,
    description: `Generieren Sie ${typeName.toLowerCase()} QR-Codes mit Logo, Farben und Echtzeit-Analysen. Ziele jederzeit aktualisieren.`,
    benefits: page.benefits.length >= 3
      ? [
          'Dynamische Links — kein Neudruck nötig',
          'Scan-Analysen nach Gerät und Standort',
          'Druckfertige PNG/SVG-Exporte',
          ...page.benefits.slice(3),
        ]
      : page.benefits,
  };
}
