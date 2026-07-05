export const CAMPAIGN_EXAMPLES = {
  restaurant: {
    en: 'I am opening an Italian restaurant next Friday',
    tr: "Önümüzdeki cuma İstanbul'da İtalyan restoranı açıyorum",
  },
  hotel: {
    en: 'We are launching a boutique hotel with spa and room service',
    tr: 'Spa ve oda servisi olan butik bir otel açıyoruz',
  },
  event: {
    en: 'Tech conference registration opens next month',
    tr: 'Gelecek ay teknoloji konferansı kayıtları başlıyor',
  },
} as const;

export type CampaignExampleKey = keyof typeof CAMPAIGN_EXAMPLES;

export function campaignPrimaryFieldKey(category: string): string | null {
  if (['url', 'menu', 'pdf', 'file', 'social', 'link_hub'].includes(category)) return 'url';
  if (category === 'wifi') return 'ssid';
  if (['instagram', 'facebook', 'tiktok', 'linkedin'].includes(category)) return 'username';
  if (category === 'whatsapp') return 'phone';
  return null;
}

export function campaignPrimaryFieldLabel(category: string, t: (k: string) => string): string {
  if (category === 'wifi') return 'Wi‑Fi name (SSID)';
  if (['instagram', 'facebook', 'tiktok', 'linkedin'].includes(category)) return t('fields.username');
  if (category === 'whatsapp') return t('fields.whatsappNumber');
  return t('fields.urlLabel.default');
}

export type CampaignWizardStep = 'prompt' | 'review' | 'creating' | 'done';
