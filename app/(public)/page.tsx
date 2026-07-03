import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { LandingHeroStatic } from '@/components/landing/hero-static';
import { LandingCustomerLogos } from '@/components/landing/customer-logos';
import { LandingLogoWall } from '@/components/landing/logo-wall';
import { LandingReviewsStrip } from '@/components/landing/reviews-strip';
import { LandingSocialProof } from '@/components/landing/social-proof';
import { LandingCaseStudiesTeaser } from '@/components/landing/case-studies-teaser';
import { LandingIndustriesSection } from '@/components/landing/industries-section';
import { LandingUseCasesSection } from '@/components/landing/use-cases-teaser';
import { LandingIntegrationsTeaser } from '@/components/landing/integrations-teaser';
import { SectionSkeleton } from '@/components/landing/section-skeleton';
import { DeferredSection } from '@/components/landing/deferred-section';
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
    locale,
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
      <DeferredSection intrinsicHeight="140px">
        <LandingCustomerLogos />
      </DeferredSection>
      <DeferredSection intrinsicHeight="200px">
        <LandingLogoWall />
      </DeferredSection>
      <DeferredSection intrinsicHeight="120px">
        <LandingReviewsStrip />
      </DeferredSection>
      <DeferredSection intrinsicHeight="280px">
        <LandingSocialProof />
      </DeferredSection>
      <DeferredSection intrinsicHeight="320px">
        <LandingCaseStudiesTeaser />
      </DeferredSection>
      <DeferredSection intrinsicHeight="360px">
        <LandingIndustriesSection />
      </DeferredSection>
      <DeferredSection intrinsicHeight="360px">
        <LandingUseCasesSection />
      </DeferredSection>
      <DeferredSection intrinsicHeight="280px">
        <LandingIntegrationsTeaser />
      </DeferredSection>
      <DeferredSection intrinsicHeight="920px">
        <LandingFeatures />
      </DeferredSection>
      <DeferredSection intrinsicHeight="640px">
        <LandingHowItWorks />
      </DeferredSection>
      <DeferredSection intrinsicHeight="720px">
        <LandingPricing />
      </DeferredSection>
      <DeferredSection intrinsicHeight="560px">
        <LandingFAQ />
      </DeferredSection>
      <DeferredSection intrinsicHeight="200px">
        <LandingCTA />
      </DeferredSection>
    </>
  );
}
