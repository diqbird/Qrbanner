import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { LandingHeroStatic } from '@/components/landing/hero-static';
import { LandingCustomerLogos } from '@/components/landing/customer-logos';
import { LandingLogoWall } from '@/components/landing/logo-wall';
import { LandingReviewsStrip } from '@/components/landing/reviews-strip';
import { LandingSocialProof } from '@/components/landing/social-proof';
import { LandingCaseStudiesTeaser } from '@/components/landing/case-studies-teaser';
import { LandingIndustriesSection } from '@/components/landing/industries-section';
import { LandingIntegrationsTeaser } from '@/components/landing/integrations-teaser';
import { SectionSkeleton } from '@/components/landing/section-skeleton';
import { JsonLd } from '@/components/seo/json-ld';
import { faqJsonLd, getHomepageFaqItems, pageMetadata } from '@/lib/seo';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

const LandingFeatures = dynamic(
  () => import('@/components/landing/features').then((m) => ({ default: m.LandingFeatures })),
  { loading: () => <SectionSkeleton rows={6} minHeight="920px" /> }
);
const LandingHowItWorks = dynamic(
  () => import('@/components/landing/how-it-works').then((m) => ({ default: m.LandingHowItWorks })),
  { loading: () => <SectionSkeleton rows={4} minHeight="640px" /> }
);
const LandingPricing = dynamic(
  () => import('@/components/landing/pricing-section').then((m) => ({ default: m.LandingPricing })),
  { loading: () => <SectionSkeleton rows={3} minHeight="720px" /> }
);
const LandingFAQ = dynamic(
  () => import('@/components/landing/faq-section').then((m) => ({ default: m.LandingFAQ })),
  { loading: () => <SectionSkeleton rows={3} minHeight="560px" /> }
);
const LandingCTA = dynamic(
  () => import('@/components/landing/cta').then((m) => ({ default: m.LandingCTA })),
  { loading: () => <SectionSkeleton rows={1} minHeight="200px" /> }
);

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    title: t('homePage.metaTitle'),
    description: t('homePage.metaDescription'),
    path: '/',
  });
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(getHomepageFaqItems())} />
      <LandingHeroStatic />
      <div className="min-h-[140px]">
        <LandingCustomerLogos />
      </div>
      <div className="min-h-[200px]">
        <LandingLogoWall />
      </div>
      <div className="min-h-[120px]">
        <LandingReviewsStrip />
      </div>
      <div className="min-h-[280px]">
        <LandingSocialProof />
      </div>
      <div className="min-h-[320px]">
        <LandingCaseStudiesTeaser />
      </div>
      <div className="min-h-[360px]">
        <LandingIndustriesSection />
      </div>
      <div className="min-h-[280px]">
        <LandingIntegrationsTeaser />
      </div>
      <div className="cv-auto min-h-[920px]">
        <LandingFeatures />
      </div>
      <div className="cv-auto min-h-[640px]">
        <LandingHowItWorks />
      </div>
      <div className="cv-auto min-h-[720px]">
        <LandingPricing />
      </div>
      <div className="cv-auto min-h-[560px]">
        <LandingFAQ />
      </div>
      <div className="min-h-[200px]">
        <LandingCTA />
      </div>
    </>
  );
}
