export const CAMPAIGN_EXAMPLES = {
  restaurant: {
    en: 'I am opening an Italian restaurant next Friday',
    tr: "Önümüzdeki cuma İstanbul'da İtalyan restoranı açıyorum",
    de: 'Ich eröffne nächsten Freitag ein italienisches Restaurant',
    es: 'Abro un restaurante italiano el próximo viernes',
  },
  hotel: {
    en: 'We are launching a boutique hotel with spa and room service',
    tr: 'Spa ve oda servisi olan butik bir otel açıyoruz',
    de: 'Wir eröffnen ein Boutique-Hotel mit Spa und Zimmerservice',
    es: 'Lanzamos un hotel boutique con spa y servicio de habitaciones',
  },
  event: {
    en: 'Tech conference registration opens next month',
    tr: 'Gelecek ay teknoloji konferansı kayıtları başlıyor',
    de: 'Die Anmeldung zur Tech-Konferenz startet nächsten Monat',
    es: 'El registro de la conferencia tech abre el próximo mes',
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
  if (category === 'wifi') return t('fields.wifiName');
  if (['instagram', 'facebook', 'tiktok', 'linkedin'].includes(category)) return t('fields.username');
  if (category === 'whatsapp') return t('fields.whatsappNumber');
  return t('fields.urlLabel.default');
}

export type CampaignWizardStep = 'prompt' | 'review' | 'creating' | 'done';
