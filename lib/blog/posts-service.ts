import { prisma } from '@/lib/db';
import { dynamicQrCodesGuide } from './posts/dynamic-qr-codes-guide';
import { restaurantMenuQr } from './posts/restaurant-menu-qr';
import { wifiQrGuide } from './posts/wifi-qr-guide';
import { qrAnalyticsGuide } from './posts/qr-analytics-guide';
import { qrSecurityGuide } from './posts/qr-security-guide';
import { bulkQrGuide } from './posts/bulk-qr-guide';
import { retailQrCodes } from './posts/retail-qr-codes';
import { hotelQrCodes } from './posts/hotel-qr-codes';
import { healthcareQrCodes } from './posts/healthcare-qr-codes';
import { agencyQrCodes } from './posts/agency-qr-codes';
import { governmentQrCodes } from './posts/government-qr-codes';
import { museumQrCodes } from './posts/museum-qr-codes';
import { universityQrCodes } from './posts/university-qr-codes';
import { stadiumQrCodes } from './posts/stadium-qr-codes';
import { cinemaQrCodes } from './posts/cinema-qr-codes';
import { pharmacyQrCodes } from './posts/pharmacy-qr-codes';
import { civicEngagementQr } from './posts/civic-engagement-qr';
import { supermarketLoyaltyQr } from './posts/supermarket-loyalty-qr';
import { logisticsQrCodes } from './posts/logistics-qr-codes';
import { realEstateOpenHouseQr } from './posts/real-estate-open-house-qr';
import { manufacturingQrCodes } from './posts/manufacturing-qr-codes';
import { nonprofitFundraisingQr } from './posts/nonprofit-fundraising-qr';
import { salonSpaQrCodes } from './posts/salon-spa-qr-codes';
import { affiliateQrMarketing } from './posts/affiliate-qr-marketing';
import { referralProgramGuide } from './posts/referral-program-guide';
import { dynamicVsStaticQr } from './posts/dynamic-vs-static-qr';
import { universityWayfindingQr } from './posts/university-wayfinding-qr';
import { logisticsWarehouseQr } from './posts/logistics-warehouse-qr';
import { automotiveDealershipQr } from './posts/automotive-dealership-qr';
import { webhookAutomationGuide } from './posts/webhook-automation-guide';
import { fitnessGymQr } from './posts/fitness-gym-qr';
import { printShopBannerQr } from './posts/print-shop-banner-qr';
import { customScanDomainGuide } from './posts/custom-scan-domain-guide';
import { nonprofitGalaQr } from './posts/nonprofit-gala-qr';
import { breweryTaproomQr } from './posts/brewery-taproom-qr';
import { insuranceAgencyQr } from './posts/insurance-agency-qr';
import { developersApiGettingStarted } from './posts/developers-api-getting-started';
import { propertyManagementTenantQr } from './posts/property-management-tenant-qr';
import { dentalPracticeQr } from './posts/dental-practice-qr-codes';
import { veterinaryClinicQr } from './posts/veterinary-clinic-qr';
import { lawFirmQrCodes } from './posts/law-firm-qr-codes';
import { accountingFirmQr } from './posts/accounting-firm-qr';
import { optometryPracticeQr } from './posts/optometry-practice-qr';
import { childcareEnrollmentQr } from './posts/childcare-enrollment-qr';
import { homeServicesContractorQr } from './posts/home-services-contractor-qr';
import { seniorLivingFacilityQr } from './posts/senior-living-facility-qr';
import { coworkingSpaceQr } from './posts/coworking-space-qr';
import { petGroomingSalonQr } from './posts/pet-grooming-salon-qr';
import { farmersMarketQr } from './posts/farmers-market-qr';
import { wineTastingRoomQr } from './posts/wine-tasting-room-qr';
import { marinaHarborQr } from './posts/marina-harbor-qr';
import { recruitmentHiringQr } from './posts/recruitment-hiring-qr';
import { tradeShowBoothQr } from './posts/trade-show-booth-qr';
import { coffeeShopLoyaltyQr } from './posts/coffee-shop-loyalty-qr';
import { touristAttractionQr } from './posts/tourist-attraction-qr';
import { floristGiftShopQr } from './posts/florist-gift-shop-qr';
import { bakeryPastryQr } from './posts/bakery-pastry-qr';
import { carWashDetailingQr } from './posts/car-wash-detailing-qr';
import { foodTrucksQr } from './posts/food-trucks-qr';
import { landscapingLawnCareQr } from './posts/landscaping-lawn-care-qr';
import type { BlogPost, BlogSection } from './types';

const STATIC_POSTS: BlogPost[] = [
  dynamicQrCodesGuide,
  restaurantMenuQr,
  wifiQrGuide,
  qrAnalyticsGuide,
  qrSecurityGuide,
  bulkQrGuide,
  retailQrCodes,
  hotelQrCodes,
  healthcareQrCodes,
  agencyQrCodes,
  governmentQrCodes,
  museumQrCodes,
  universityQrCodes,
  stadiumQrCodes,
  cinemaQrCodes,
  pharmacyQrCodes,
  civicEngagementQr,
  supermarketLoyaltyQr,
  logisticsQrCodes,
  realEstateOpenHouseQr,
  manufacturingQrCodes,
  nonprofitFundraisingQr,
  salonSpaQrCodes,
  affiliateQrMarketing,
  referralProgramGuide,
  dynamicVsStaticQr,
  universityWayfindingQr,
  logisticsWarehouseQr,
  automotiveDealershipQr,
  webhookAutomationGuide,
  fitnessGymQr,
  printShopBannerQr,
  customScanDomainGuide,
  nonprofitGalaQr,
  breweryTaproomQr,
  insuranceAgencyQr,
  developersApiGettingStarted,
  propertyManagementTenantQr,
  dentalPracticeQr,
  veterinaryClinicQr,
  lawFirmQrCodes,
  accountingFirmQr,
  optometryPracticeQr,
  childcareEnrollmentQr,
  homeServicesContractorQr,
  seniorLivingFacilityQr,
  coworkingSpaceQr,
  petGroomingSalonQr,
  farmersMarketQr,
  wineTastingRoomQr,
  marinaHarborQr,
  recruitmentHiringQr,
  tradeShowBoothQr,
  coffeeShopLoyaltyQr,
  touristAttractionQr,
  floristGiftShopQr,
  bakeryPastryQr,
  carWashDetailingQr,
  foodTrucksQr,
  landscapingLawnCareQr,
];

function dbRowToPost(row: {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  author: string;
  sections: unknown;
  readingMinutes: number;
  publishedAt: Date | null;
  updatedAt: Date;
}): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    keywords: row.keywords,
    category: row.category,
    author: row.author,
    sections: (row.sections as BlogSection[]) ?? [],
    readingMinutes: row.readingMinutes,
    publishedAt: (row.publishedAt ?? row.updatedAt).toISOString().slice(0, 10),
    updatedAt: row.updatedAt.toISOString().slice(0, 10),
  };
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  let dbPosts: BlogPost[] = [];
  try {
    const rows = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
    });
    dbPosts = rows.map(dbRowToPost);
  } catch {
    /* table may not exist before migration */
  }

  const bySlug = new Map<string, BlogPost>();
  for (const p of STATIC_POSTS) bySlug.set(p.slug, p);
  for (const p of dbPosts) bySlug.set(p.slug, p);

  return Array.from(bySlug.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const staticPost = STATIC_POSTS.find((p) => p.slug === slug);
  if (staticPost) return staticPost;

  try {
    const row = await prisma.blogPost.findFirst({
      where: { slug, published: true },
    });
    if (row) return dbRowToPost(row);
  } catch {
    /* ignore */
  }
  return undefined;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getPublishedPosts();
  return posts.map((p) => p.slug);
}

export { STATIC_POSTS };
