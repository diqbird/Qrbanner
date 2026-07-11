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
import { hotelQrCodesEs } from './hotel-qr-codes';
import { retailQrCodesEs } from './retail-qr-codes';
import { healthcareQrCodesEs } from './healthcare-qr-codes';
import { realEstateOpenHouseQrEs } from './real-estate-open-house-qr';
import { coffeeShopLoyaltyQrEs } from './coffee-shop-loyalty-qr';
import { salonSpaQrCodesEs } from './salon-spa-qr-codes';
import { webhookAutomationGuideEs } from './webhook-automation-guide';
import { referralProgramGuideEs } from './referral-program-guide';
import { tradeShowBoothQrEs } from './trade-show-booth-qr';
import { fitnessGymQrEs } from './fitness-gym-qr';

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
  [hotelQrCodesEs.slug]: hotelQrCodesEs,
  [retailQrCodesEs.slug]: retailQrCodesEs,
  [healthcareQrCodesEs.slug]: healthcareQrCodesEs,
  [realEstateOpenHouseQrEs.slug]: realEstateOpenHouseQrEs,
  [coffeeShopLoyaltyQrEs.slug]: coffeeShopLoyaltyQrEs,
  [salonSpaQrCodesEs.slug]: salonSpaQrCodesEs,
  [webhookAutomationGuideEs.slug]: webhookAutomationGuideEs,
  [referralProgramGuideEs.slug]: referralProgramGuideEs,
  [tradeShowBoothQrEs.slug]: tradeShowBoothQrEs,
  [fitnessGymQrEs.slug]: fitnessGymQrEs,
};
