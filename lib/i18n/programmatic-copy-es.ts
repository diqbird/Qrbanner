import type { UseCasePage } from '@/lib/use-case-pages';
import type { QrTypePage } from '@/lib/qr-type-pages';

const USE_CASE_BENEFITS_ES = [
  'Actualiza destinos sin reimprimir',
  'Analiza escaneos por región y dispositivo',
  'Personaliza logo y colores de marca',
  'Co-marketing con reglas por horario y ubicación',
];

const USE_CASE_STEPS_ES = [
  'Crea un código QR dinámico en el asistente',
  'Añade logo y colores de marca',
  'Exporta en PNG, SVG o banner para imprimir',
  'Sigue los escaneos en tiempo real en el panel',
];

function useCaseTopic(page: UseCasePage): string {
  return page.title
    .replace(/^QR Codes (on|for) /i, '')
    .replace(/ QR Codes?$/i, '')
    .trim();
}

export function buildUseCaseEsTemplate(page: UseCasePage): UseCasePage {
  const topic = useCaseTopic(page);
  const topicLower = topic.charAt(0).toLocaleLowerCase('es') + topic.slice(1);

  return {
    ...page,
    title: `Códigos QR para ${topic}`,
    headline: `${topic}: códigos QR dinámicos para mejores resultados`,
    metaDescription: `Códigos QR dinámicos para ${topicLower}. Analítica, geovallas y API — empieza gratis con QRbanner.`,
    description: `Crea códigos QR para ${topicLower}. Cambia destinos en el panel y mide escaneos — sin reimprimir.`,
    benefits: page.benefits.length >= 4 ? USE_CASE_BENEFITS_ES : page.benefits,
    steps: USE_CASE_STEPS_ES,
  };
}

export function buildQrTypeEsTemplate(page: QrTypePage): QrTypePage {
  const typeName = page.title.replace(/ QR Code$/i, '').trim();

  return {
    ...page,
    title: `Código QR ${typeName}`,
    headline: `${typeName} — código QR con analítica y branding`,
    metaDescription: `Crea un código QR ${typeName.toLowerCase()}: dinámico, con tu marca y analítica de escaneos. Gratis con QRbanner.`,
    description: `Genera códigos QR ${typeName.toLowerCase()} con logo, colores y analítica en tiempo real. Actualiza destinos cuando quieras.`,
    benefits: page.benefits.length >= 3
      ? [
          'Enlaces dinámicos — sin reimprimir',
          'Analítica de escaneos por dispositivo y ubicación',
          'Exportaciones PNG/SVG listas para imprimir',
          ...page.benefits.slice(3),
        ]
      : page.benefits,
  };
}
