export type CategoryFieldLayout =
  | 'url'
  | 'url_labeled'
  | 'text'
  | 'whatsapp'
  | 'telegram'
  | 'discord'
  | 'social_profile'
  | 'youtube'
  | 'spotify'
  | 'zoom'
  | 'google_meet'
  | 'location'
  | 'crypto'
  | 'vcard'
  | 'wifi'
  | 'email'
  | 'sms'
  | 'phone'
  | 'event'
  | 'google_review'
  | 'paypal'
  | 'upi'
  | 'signal'
  | 'gs1';

export type CategoryFieldConfig = {
  layout: CategoryFieldLayout;
  /** i18n key under fields.urlLabel.* or fields.urlLabel.default */
  urlLabelKey?: string;
  urlPlaceholderKey?: string;
};

const URL_DEFAULT: CategoryFieldConfig = { layout: 'url' };

const REGISTRY: Record<string, CategoryFieldConfig> = {
  url: URL_DEFAULT,
  menu: { layout: 'url', urlLabelKey: 'menu' },
  social: { layout: 'url', urlLabelKey: 'social' },
  app: { layout: 'url', urlLabelKey: 'app' },
  pdf: { layout: 'url', urlLabelKey: 'pdf' },
  file: { layout: 'url', urlLabelKey: 'file' },
  text: { layout: 'text' },
  whatsapp: { layout: 'whatsapp' },
  telegram: { layout: 'telegram' },
  discord: { layout: 'discord' },
  instagram: { layout: 'social_profile' },
  facebook: { layout: 'social_profile' },
  tiktok: { layout: 'social_profile' },
  linkedin: { layout: 'social_profile' },
  youtube: { layout: 'youtube' },
  spotify: { layout: 'spotify' },
  zoom: { layout: 'zoom' },
  google_meet: { layout: 'google_meet' },
  location: { layout: 'location' },
  crypto: { layout: 'crypto' },
  vcard: { layout: 'vcard' },
  wifi: { layout: 'wifi' },
  email: { layout: 'email' },
  sms: { layout: 'sms' },
  phone: { layout: 'phone' },
  event: { layout: 'event' },
  google_review: { layout: 'google_review' },
  paypal: { layout: 'paypal' },
  upi: { layout: 'upi' },
  signal: { layout: 'signal' },
  apple_music: {
    layout: 'url_labeled',
    urlPlaceholderKey: 'appleMusicUrlPlaceholder',
    urlLabelKey: 'appleMusic',
  },
  google_drive: {
    layout: 'url_labeled',
    urlPlaceholderKey: 'driveUrlPlaceholder',
    urlLabelKey: 'googleDrive',
  },
  dropbox: {
    layout: 'url_labeled',
    urlPlaceholderKey: 'dropboxUrlPlaceholder',
    urlLabelKey: 'dropbox',
  },
  gs1: { layout: 'gs1' },
};

export function getCategoryFieldConfig(category: string): CategoryFieldConfig {
  return REGISTRY[category] ?? URL_DEFAULT;
}

export function resolveUrlLabelKey(category: string): string {
  const config = getCategoryFieldConfig(category);
  if (config.urlLabelKey) return `fields.urlLabel.${config.urlLabelKey}`;
  if (['menu', 'pdf', 'file', 'app', 'social'].includes(category)) {
    return `fields.urlLabel.${category}`;
  }
  return 'fields.urlLabel.default';
}
