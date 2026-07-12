import type { Locale } from '@/lib/i18n/types';

const PROVIDER_LABELS: Record<string, Record<Locale, string>> = {
  google: { en: 'Google', tr: 'Google', de: 'Google', es: 'Google' },
  github: { en: 'GitHub', tr: 'GitHub', de: 'GitHub', es: 'GitHub' },
  microsoft: { en: 'Microsoft', tr: 'Microsoft', de: 'Microsoft', es: 'Microsoft' },
  'azure-ad': { en: 'Microsoft', tr: 'Microsoft', de: 'Microsoft', es: 'Microsoft' },
};

export function formatOAuthProviderLabels(providers: string[], locale: Locale): string[] {
  const unique = Array.from(new Set(providers.map((p) => p.toLowerCase())));
  return unique.map((provider) => {
    const labels = PROVIDER_LABELS[provider];
    if (labels) return labels[locale];
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  });
}
