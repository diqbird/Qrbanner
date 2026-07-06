import { en } from './en';
import { tr } from './tr';
import type { Locale } from './types';

export type ScanPageCopy = {
  goHome: string;
  notFoundTitle: string;
  notFoundDesc: string;
  expiredTitle: string;
  expiredDesc: string;
  scanLimitTitle: string;
  scanLimitDesc: string;
  domainNotVerifiedTitle: string;
  domainNotVerifiedDesc: string;
  domainNotFoundDesc: string;
  passwordDocTitle: string;
  passwordHeading: string;
  passwordDesc: string;
  passwordError: string;
  passwordPlaceholder: string;
  unlock: string;
  linkBlockedTitle: string;
  linkBlockedDesc: string;
  draftPreviewTitle: string;
  draftPreviewDesc: string;
  leadNamePlaceholder: string;
  leadEmailPlaceholder: string;
  leadPhonePlaceholder: string;
  leadMessagePlaceholder: string;
  leadSubmitFailed: string;
  leadNetworkError: string;
};

export function resolveScanPageCopy(locale: Locale = 'en'): ScanPageCopy {
  const tree = locale === 'tr' ? tr : en;
  return tree.scanPage as ScanPageCopy;
}

export function pickScanLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return 'en';
  const tags = acceptLanguage.split(',').map((part) => part.trim().split(';')[0].toLowerCase());
  for (const tag of tags) {
    if (tag.startsWith('tr')) return 'tr';
  }
  return 'en';
}
