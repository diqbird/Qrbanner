import { en } from './en';
import { tr } from './tr';
import type { Locale } from './types';
import { interpolate } from './types';

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

export type ScanLandingCopy = {
  defaultTitle: string;
  defaultCta: string;
  defaultMetaDesc: string;
  bannerAlt: string;
  poweredBy: string;
  leadSubmitDefault: string;
  videoEmbedTitle: string;
  redirecting: string;
  qrNameFallback: string;
  qrScanFallback: string;
};

export type SchemeScanCopy = {
  qrCodeFallback: string;
  emailTitle: string;
  emailMessage: string;
  emailButton: string;
  smsTitle: string;
  smsMessage: string;
  smsButton: string;
  phoneTitle: string;
  phoneMessage: string;
  phoneButton: string;
  locationTitle: string;
  locationMessage: string;
  locationButton: string;
  locationSecondaryButton: string;
  cryptoTitle: string;
  cryptoMessage: string;
  cryptoButton: string;
  defaultTitle: string;
  defaultMessage: string;
  defaultButton: string;
};

export type SchemePageMeta = {
  title: string;
  message: string;
  buttonLabel: string;
  secondaryLabel?: string;
};

export function resolveScanPageCopy(locale: Locale = 'en'): ScanPageCopy {
  const tree = locale === 'tr' ? tr : en;
  return tree.scanPage as ScanPageCopy;
}

export function resolveScanLandingCopy(locale: Locale = 'en'): ScanLandingCopy {
  const tree = locale === 'tr' ? tr : en;
  return tree.scanLanding as ScanLandingCopy;
}

export function resolveSchemeScanCopy(locale: Locale = 'en'): SchemeScanCopy {
  const tree = locale === 'tr' ? tr : en;
  return tree.schemeScan as SchemeScanCopy;
}

export function schemePageMeta(
  category: string,
  qrName: string | null | undefined,
  locale: Locale = 'en'
): SchemePageMeta {
  const c = resolveSchemeScanCopy(locale);
  const name = qrName?.trim() || c.qrCodeFallback;

  switch (category) {
    case 'email':
      return {
        title: c.emailTitle,
        message: interpolate(c.emailMessage, { name }),
        buttonLabel: c.emailButton,
      };
    case 'sms':
      return {
        title: c.smsTitle,
        message: interpolate(c.smsMessage, { name }),
        buttonLabel: c.smsButton,
      };
    case 'phone':
      return {
        title: c.phoneTitle,
        message: interpolate(c.phoneMessage, { name }),
        buttonLabel: c.phoneButton,
      };
    case 'location':
      return {
        title: c.locationTitle,
        message: interpolate(c.locationMessage, { name }),
        buttonLabel: c.locationButton,
        secondaryLabel: c.locationSecondaryButton,
      };
    case 'crypto':
      return {
        title: c.cryptoTitle,
        message: interpolate(c.cryptoMessage, { name }),
        buttonLabel: c.cryptoButton,
      };
    default:
      return {
        title: c.defaultTitle,
        message: c.defaultMessage,
        buttonLabel: c.defaultButton,
      };
  }
}

export function pickScanLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return 'en';
  const tags = acceptLanguage.split(',').map((part) => part.trim().split(';')[0].toLowerCase());
  for (const tag of tags) {
    if (tag.startsWith('tr')) return 'tr';
    if (tag.startsWith('de')) return 'de';
  }
  return 'en';
}
