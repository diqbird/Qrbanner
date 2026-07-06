import { LOCALE_STORAGE_KEY, type Locale } from '@/lib/i18n';

/** Read UI locale in browser-only flows (bulk ZIP, etc.). */
export function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === 'tr' || stored === 'en') return stored;
  } catch {
    /* ignore */
  }
  if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('tr')) {
    return 'tr';
  }
  return 'en';
}
