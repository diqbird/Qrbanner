import { HOW_IT_WORKS_STEPS } from '@/lib/site-content';
import { localizeMarketingNumbers } from './qr-type-count';
import type { Locale } from './types';

const STEPS_TR = [
  {
    title: 'Kullanım Alanınızı Seçin',
    description: 'Hazır şablon veya 26+ QR tipinden birini seçin — menüler, kartvizitler, Wi‑Fi, sosyal linkler ve daha fazlası.',
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
] as const;

export function getHowItWorksSteps(locale: Locale) {
  const base =
    locale === 'en'
      ? HOW_IT_WORKS_STEPS
      : HOW_IT_WORKS_STEPS.map((step, i) => ({
          ...step,
          title: STEPS_TR[i]?.title ?? step.title,
          description: STEPS_TR[i]?.description ?? step.description,
        }));

  return base.map((step) => ({
    ...step,
    description: localizeMarketingNumbers(step.description, locale),
  }));
}
