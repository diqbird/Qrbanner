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
