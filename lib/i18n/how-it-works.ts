import { HOW_IT_WORKS_STEPS } from '@/lib/site-content';
import { localizeMarketingNumbers } from './qr-type-count';
import type { Locale } from './types';

type StepCopy = { title: string; description: string };

const STEPS_TR: StepCopy[] = [
  {
    title: 'Kullanım Alanınızı Seçin',
    description:
      'Hazır şablon veya 26+ QR tipinden birini seçin — menüler, kartvizitler, Wi‑Fi, sosyal linkler ve daha fazlası.',
  },
  {
    title: 'Özelleştirin ve Markalayın',
    description: 'İçerik, renkler ve logo ekleyin. İsteğe bağlı zaman, konum veya cihaz kuralları belirleyin.',
  },
  {
    title: 'Yazdırın veya Paylaşın',
    description: 'PNG veya SVG indirin, baskıya hazır posterler oluşturun veya kısa linkinizi her yerde paylaşın.',
  },
  {
    title: 'Takip Edin ve İyileştirin',
    description: 'Taramaları gerçek zamanlı izleyin, raporları dışa aktarın, lead toplayın ve işe yarayanı optimize edin.',
  },
];

const STEPS_DE: StepCopy[] = [
  {
    title: 'Anwendungsfall wählen',
    description:
      'Wählen Sie eine fertige Vorlage oder einen von 26+ QR-Typen — Speisekarten, Visitenkarten, WLAN, Social Links und mehr.',
  },
  {
    title: 'Anpassen & branden',
    description: 'Inhalt, Farben und Logo hinzufügen. Optional Regeln für Zeit, Standort oder Gerät festlegen.',
  },
  {
    title: 'Drucken oder teilen',
    description: 'PNG oder SVG herunterladen, druckfertige Poster erstellen oder Ihren Kurzlink überall teilen.',
  },
  {
    title: 'Tracken & optimieren',
    description: 'Scans in Echtzeit verfolgen, Berichte exportieren, Leads erfassen und optimieren, was funktioniert.',
  },
];

const STEPS_ES: StepCopy[] = [
  {
    title: 'Elige tu caso de uso',
    description:
      'Elige una plantilla lista o uno de más de 26 tipos de QR — menús, tarjetas de visita, Wi‑Fi, enlaces sociales y más.',
  },
  {
    title: 'Personaliza y marca',
    description: 'Añade contenido, colores y logo. Define reglas opcionales de hora, ubicación o dispositivo.',
  },
  {
    title: 'Imprime o comparte',
    description: 'Descarga PNG o SVG, crea pósters listos para imprimir o comparte tu enlace corto en todas partes.',
  },
  {
    title: 'Sigue y mejora',
    description: 'Controla escaneos en tiempo real, exporta informes, captura leads y optimiza lo que funciona.',
  },
];

function stepsFor(locale: Locale): StepCopy[] | undefined {
  if (locale === 'tr') return STEPS_TR;
  if (locale === 'de') return STEPS_DE;
  if (locale === 'es') return STEPS_ES;
  return undefined;
}

export function getHowItWorksSteps(locale: Locale) {
  const localized = stepsFor(locale);
  const base = localized
    ? HOW_IT_WORKS_STEPS.map((step, i) => ({
        ...step,
        title: localized[i]?.title ?? step.title,
        description: localized[i]?.description ?? step.description,
      }))
    : HOW_IT_WORKS_STEPS;

  return base.map((step) => ({
    ...step,
    description: localizeMarketingNumbers(step.description, locale),
  }));
}
