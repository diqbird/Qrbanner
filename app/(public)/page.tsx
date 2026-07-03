import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { LandingHeroStatic } from '@/components/landing/hero-static';
import { SectionSkeleton } from '@/components/landing/section-skeleton';
import { DeferredSection } from '@/components/landing/deferred-section';
import { JsonLd } from '@/components/seo/json-ld';
import { faqJsonLd, getHomepageFaqItems, pageMetadata } from '@/lib/seo';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

const LandingCustomerLogos = dynamic(
  () => import('@/components/landing/customer-logos').then((m) => ({ default: m.LandingCustomerLogos })),
  { loading: () => <SectionSkeleton rows={1} minHeight="140px" /> }
);
const LandingLogoWall = dynamic(
  () => import('@/components/landing/logo-wall').then((m) => ({ default: m.LandingLogoWall })),
  { loading: () => <SectionSkeleton rows={2} minHeight="200px" /> }
);
const LandingReviewsStrip = dynamic(
  () => import('@/components/landing/reviews-strip').then((m) => ({ default: m.LandingReviewsStrip })),
  { loading: () => <SectionSkeleton rows={1} minHeight="120px" /> }
);
const LandingSocialProof = dynamic(
  () => import('@/components/landing/social-proof').then((m) => ({ default: m.LandingSocialProof })),
  { loading: () => <SectionSkeleton rows={3} minHeight="280px" /> }
);
const LandingCaseStudiesTeaser = dynamic(
  () => import('@/components/landing/case-studies-teaser').then((m) => ({ default: m.LandingCaseStudiesTeaser })),
  { loading: () => <SectionSkeleton rows={2} minHeight="320px" /> }
);
const LandingIndustriesSection = dynamic(
  () => import('@/components/landing/industries-section').then((m) => ({ default: m.LandingIndustriesSection })),
  { loading: () => <SectionSkeleton rows={3} minHeight="360px" /> }
);
const LandingUseCasesSection = dynamic(
  () => import('@/components/landing/use-cases-teaser').then((m) => ({ default: m.LandingUseCasesSection })),
  { loading: () => <SectionSkeleton rows={3} minHeight="360px" /> }
);
const LandingIntegrationsTeaser = dynamic(
  () => import('@/components/landing/integrations-teaser').then((m) => ({ default: m.LandingIntegrationsTeaser })),
  { loading: () => <SectionSkeleton rows={2} minHeight="280px" /> }
);
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
