import type { Locale } from '@/lib/i18n/types';
import type { BlogPost } from './types';
import { whatsappOrderingQrTr } from './posts/tr/whatsapp-ordering-qr';
import { googleReviewQrTr } from './posts/tr/google-review-qr';
import { dynamicQrCodesGuideTr } from './posts/tr/dynamic-qr-codes-guide';
import { restaurantMenuQrTr } from './posts/tr/restaurant-menu-qr';
import { wifiQrGuideTr } from './posts/tr/wifi-qr-guide';
import { qrAnalyticsGuideTr } from './posts/tr/qr-analytics-guide';
import { bulkQrGuideTr } from './posts/tr/bulk-qr-guide';
import { dynamicVsStaticQrTr } from './posts/tr/dynamic-vs-static-qr';
import { coffeeShopLoyaltyQrTr } from './posts/tr/coffee-shop-loyalty-qr';
import { foodTrucksQrTr } from './posts/tr/food-trucks-qr';
import { hotelQrCodesTr } from './posts/tr/hotel-qr-codes';
import { retailQrCodesTr } from './posts/tr/retail-qr-codes';
import { stadiumQrCodesTr } from './posts/tr/stadium-qr-codes';
import { realEstateOpenHouseQrTr } from './posts/tr/real-estate-open-house-qr';
import { healthcareQrCodesTr } from './posts/tr/healthcare-qr-codes';
import { salonSpaQrCodesTr } from './posts/tr/salon-spa-qr-codes';
import { dentalPracticeQrTr } from './posts/tr/dental-practice-qr-codes';
import { lawFirmQrCodesTr } from './posts/tr/law-firm-qr-codes';
import { fitnessGymQrTr } from './posts/tr/fitness-gym-qr';
import { universityQrCodesTr } from './posts/tr/university-qr-codes';
import { agencyQrCodesTr } from './posts/tr/agency-qr-codes';
import { governmentQrCodesTr } from './posts/tr/government-qr-codes';
import { museumQrCodesTr } from './posts/tr/museum-qr-codes';
import { cinemaQrCodesTr } from './posts/tr/cinema-qr-codes';
import { pharmacyQrCodesTr } from './posts/tr/pharmacy-qr-codes';
import { civicEngagementQrTr } from './posts/tr/civic-engagement-qr';
import { supermarketLoyaltyQrTr } from './posts/tr/supermarket-loyalty-qr';
import { logisticsQrCodesTr } from './posts/tr/logistics-qr-codes';
import { manufacturingQrCodesTr } from './posts/tr/manufacturing-qr-codes';
import { automotiveDealershipQrTr } from './posts/tr/automotive-dealership-qr';
import { nonprofitFundraisingQrTr } from './posts/tr/nonprofit-fundraising-qr';
import { nonprofitGalaQrTr } from './posts/tr/nonprofit-gala-qr';
import { affiliateQrMarketingTr } from './posts/tr/affiliate-qr-marketing';
import { breweryTaproomQrTr } from './posts/tr/brewery-taproom-qr';
import { printShopBannerQrTr } from './posts/tr/print-shop-banner-qr';
import { customScanDomainGuideTr } from './posts/tr/custom-scan-domain-guide';
import { webhookAutomationGuideTr } from './posts/tr/webhook-automation-guide';
import { qrSecurityGuideTr } from './posts/tr/qr-security-guide';
import { landingCtaAnalyticsGuideTr } from './posts/tr/landing-cta-analytics-guide';
import { referralProgramGuideTr } from './posts/tr/referral-program-guide';
import { developersApiGettingStartedTr } from './posts/tr/developers-api-getting-started';
import { totpTwoFactorGuideTr } from './posts/tr/totp-two-factor-guide';
import { aiLandingCopyGuideTr } from './posts/tr/ai-landing-copy-guide';
import { universityWayfindingQrTr } from './posts/tr/university-wayfinding-qr';
import { tradeShowBoothQrTr } from './posts/tr/trade-show-booth-qr';

/** Turkish content overrides keyed by slug (same URL, locale from cookie/header). */
const TR_POSTS: Record<string, BlogPost> = {
  [whatsappOrderingQrTr.slug]: whatsappOrderingQrTr,
  [googleReviewQrTr.slug]: googleReviewQrTr,
  [dynamicQrCodesGuideTr.slug]: dynamicQrCodesGuideTr,
  [restaurantMenuQrTr.slug]: restaurantMenuQrTr,
  [wifiQrGuideTr.slug]: wifiQrGuideTr,
  [qrAnalyticsGuideTr.slug]: qrAnalyticsGuideTr,
  [bulkQrGuideTr.slug]: bulkQrGuideTr,
  [dynamicVsStaticQrTr.slug]: dynamicVsStaticQrTr,
  [coffeeShopLoyaltyQrTr.slug]: coffeeShopLoyaltyQrTr,
  [foodTrucksQrTr.slug]: foodTrucksQrTr,
  [hotelQrCodesTr.slug]: hotelQrCodesTr,
  [retailQrCodesTr.slug]: retailQrCodesTr,
  [stadiumQrCodesTr.slug]: stadiumQrCodesTr,
  [realEstateOpenHouseQrTr.slug]: realEstateOpenHouseQrTr,
  [healthcareQrCodesTr.slug]: healthcareQrCodesTr,
  [salonSpaQrCodesTr.slug]: salonSpaQrCodesTr,
  [dentalPracticeQrTr.slug]: dentalPracticeQrTr,
  [lawFirmQrCodesTr.slug]: lawFirmQrCodesTr,
  [fitnessGymQrTr.slug]: fitnessGymQrTr,
  [universityQrCodesTr.slug]: universityQrCodesTr,
  [agencyQrCodesTr.slug]: agencyQrCodesTr,
  [governmentQrCodesTr.slug]: governmentQrCodesTr,
  [museumQrCodesTr.slug]: museumQrCodesTr,
  [cinemaQrCodesTr.slug]: cinemaQrCodesTr,
  [pharmacyQrCodesTr.slug]: pharmacyQrCodesTr,
  [civicEngagementQrTr.slug]: civicEngagementQrTr,
  [supermarketLoyaltyQrTr.slug]: supermarketLoyaltyQrTr,
  [logisticsQrCodesTr.slug]: logisticsQrCodesTr,
  [manufacturingQrCodesTr.slug]: manufacturingQrCodesTr,
  [automotiveDealershipQrTr.slug]: automotiveDealershipQrTr,
  [nonprofitFundraisingQrTr.slug]: nonprofitFundraisingQrTr,
  [nonprofitGalaQrTr.slug]: nonprofitGalaQrTr,
  [affiliateQrMarketingTr.slug]: affiliateQrMarketingTr,
  [breweryTaproomQrTr.slug]: breweryTaproomQrTr,
  [printShopBannerQrTr.slug]: printShopBannerQrTr,
  [customScanDomainGuideTr.slug]: customScanDomainGuideTr,
  [webhookAutomationGuideTr.slug]: webhookAutomationGuideTr,
  [qrSecurityGuideTr.slug]: qrSecurityGuideTr,
  [landingCtaAnalyticsGuideTr.slug]: landingCtaAnalyticsGuideTr,
  [referralProgramGuideTr.slug]: referralProgramGuideTr,
  [developersApiGettingStartedTr.slug]: developersApiGettingStartedTr,
  [totpTwoFactorGuideTr.slug]: totpTwoFactorGuideTr,
  [aiLandingCopyGuideTr.slug]: aiLandingCopyGuideTr,
  [universityWayfindingQrTr.slug]: universityWayfindingQrTr,
  [tradeShowBoothQrTr.slug]: tradeShowBoothQrTr,
};

export function localizeBlogPost(post: BlogPost, locale: Locale): BlogPost {
  if (locale !== 'tr') return post;
  const tr = TR_POSTS[post.slug];
  if (!tr) return post;
  return {
    ...post,
    title: tr.title,
    description: tr.description,
    keywords: tr.keywords,
    category: tr.category,
    sections: tr.sections,
    readingMinutes: tr.readingMinutes,
  };
}

export function hasTurkishBlogPost(slug: string): boolean {
  return slug in TR_POSTS;
}
