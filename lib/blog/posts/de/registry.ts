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
import { hotelQrCodesDe } from './hotel-qr-codes';
import { retailQrCodesDe } from './retail-qr-codes';
import { healthcareQrCodesDe } from './healthcare-qr-codes';
import { realEstateOpenHouseQrDe } from './real-estate-open-house-qr';
import { coffeeShopLoyaltyQrDe } from './coffee-shop-loyalty-qr';
import { salonSpaQrCodesDe } from './salon-spa-qr-codes';
import { webhookAutomationGuideDe } from './webhook-automation-guide';
import { referralProgramGuideDe } from './referral-program-guide';
import { tradeShowBoothQrDe } from './trade-show-booth-qr';
import { fitnessGymQrDe } from './fitness-gym-qr';

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
  [hotelQrCodesDe.slug]: hotelQrCodesDe,
  [retailQrCodesDe.slug]: retailQrCodesDe,
  [healthcareQrCodesDe.slug]: healthcareQrCodesDe,
  [realEstateOpenHouseQrDe.slug]: realEstateOpenHouseQrDe,
  [coffeeShopLoyaltyQrDe.slug]: coffeeShopLoyaltyQrDe,
  [salonSpaQrCodesDe.slug]: salonSpaQrCodesDe,
  [webhookAutomationGuideDe.slug]: webhookAutomationGuideDe,
  [referralProgramGuideDe.slug]: referralProgramGuideDe,
  [tradeShowBoothQrDe.slug]: tradeShowBoothQrDe,
  [fitnessGymQrDe.slug]: fitnessGymQrDe,
};
