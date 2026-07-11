import type { BlogPost } from '../../types';
import { dynamicQrCodesGuideEs } from './dynamic-qr-codes-guide';
import { restaurantMenuQrEs } from './restaurant-menu-qr';
import { wifiQrGuideEs } from './wifi-qr-guide';
import { qrAnalyticsGuideEs } from './qr-analytics-guide';
import { dynamicVsStaticQrEs } from './dynamic-vs-static-qr';
import { bulkQrGuideEs } from './bulk-qr-guide';
import { qrSecurityGuideEs } from './qr-security-guide';
import { whatsappOrderingQrEs } from './whatsapp-ordering-qr';
import { googleReviewQrEs } from './google-review-qr';
import { customScanDomainGuideEs } from './custom-scan-domain-guide';

/** Spanish (es-ES) content overrides keyed by slug (same URL, locale from cookie/header). */
export const ES_POSTS: Record<string, BlogPost> = {
  [dynamicQrCodesGuideEs.slug]: dynamicQrCodesGuideEs,
  [restaurantMenuQrEs.slug]: restaurantMenuQrEs,
  [wifiQrGuideEs.slug]: wifiQrGuideEs,
  [qrAnalyticsGuideEs.slug]: qrAnalyticsGuideEs,
  [dynamicVsStaticQrEs.slug]: dynamicVsStaticQrEs,
  [bulkQrGuideEs.slug]: bulkQrGuideEs,
  [qrSecurityGuideEs.slug]: qrSecurityGuideEs,
  [whatsappOrderingQrEs.slug]: whatsappOrderingQrEs,
  [googleReviewQrEs.slug]: googleReviewQrEs,
  [customScanDomainGuideEs.slug]: customScanDomainGuideEs,
};
