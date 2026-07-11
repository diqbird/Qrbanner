import type { BlogPost } from '../../types';
import { dynamicQrCodesGuideDe } from './dynamic-qr-codes-guide';
import { restaurantMenuQrDe } from './restaurant-menu-qr';
import { wifiQrGuideDe } from './wifi-qr-guide';
import { qrAnalyticsGuideDe } from './qr-analytics-guide';
import { dynamicVsStaticQrDe } from './dynamic-vs-static-qr';
import { bulkQrGuideDe } from './bulk-qr-guide';
import { qrSecurityGuideDe } from './qr-security-guide';
import { whatsappOrderingQrDe } from './whatsapp-ordering-qr';
import { googleReviewQrDe } from './google-review-qr';
import { customScanDomainGuideDe } from './custom-scan-domain-guide';

/** German (de-DE) content overrides keyed by slug (same URL, locale from cookie/header). */
export const DE_POSTS: Record<string, BlogPost> = {
  [dynamicQrCodesGuideDe.slug]: dynamicQrCodesGuideDe,
  [restaurantMenuQrDe.slug]: restaurantMenuQrDe,
  [wifiQrGuideDe.slug]: wifiQrGuideDe,
  [qrAnalyticsGuideDe.slug]: qrAnalyticsGuideDe,
  [dynamicVsStaticQrDe.slug]: dynamicVsStaticQrDe,
  [bulkQrGuideDe.slug]: bulkQrGuideDe,
  [qrSecurityGuideDe.slug]: qrSecurityGuideDe,
  [whatsappOrderingQrDe.slug]: whatsappOrderingQrDe,
  [googleReviewQrDe.slug]: googleReviewQrDe,
  [customScanDomainGuideDe.slug]: customScanDomainGuideDe,
};
