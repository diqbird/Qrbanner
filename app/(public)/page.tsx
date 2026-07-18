import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { JsonLd } from '@/components/seo/json-ld';
import { faqJsonLd, getHomepageFaqItems, pageMetadata } from '@/lib/seo';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { DeferredSection } from '@/components/landing/deferred-section';
import { SectionSkeleton } from '@/components/landing/section-skeleton';
import {
  PremiumShell,
  PremiumHero,
  PremiumTrust,
} from '@/components/landing/premium';
import { LandingReviewsStrip } from '@/components/landing/reviews-strip';

const PremiumProducts = dynamic(
  () => import('@/components/landing/premium/products').then((m) => ({ default: m.PremiumProducts })),
  { loading: () => <SectionSkeleton rows={3} minHeight="420px" /> }
);
const PremiumFeatures = dynamic(
  () => import('@/components/landing/premium/features').then((m) => ({ default: m.PremiumFeatures })),
  { loading: () => <SectionSkeleton rows={3} minHeight="480px" /> }
);
const PremiumShowcase = dynamic(
  () => import('@/components/landing/premium/showcase').then((m) => ({ default: m.PremiumShowcase })),
  { loading: () => <SectionSkeleton rows={2} minHeight="420px" /> }
);
const PremiumWhy = dynamic(
  () => import('@/components/landing/premium/why').then((m) => ({ default: m.PremiumWhy })),
  { loading: () => <SectionSkeleton rows={2} minHeight="360px" /> }
);
const PremiumProcess = dynamic(
  () => import('@/components/landing/premium/process').then((m) => ({ default: m.PremiumProcess })),
  { loading: () => <SectionSkeleton rows={2} minHeight="360px" /> }
);
const PremiumStats = dynamic(
  () => import('@/components/landing/premium/stats').then((m) => ({ default: m.PremiumStats })),
  { loading: () => <SectionSkeleton rows={1} minHeight="240px" /> }
);
const PremiumPricingTeaser = dynamic(
  () =>
    import('@/components/landing/premium/pricing-teaser').then((m) => ({
      default: m.PremiumPricingTeaser,
    })),
  { loading: () => <SectionSkeleton rows={1} minHeight="160px" /> }
);
const PremiumFaq = dynamic(
  () => import('@/components/landing/premium/faq').then((m) => ({ default: m.PremiumFaq })),
  { loading: () => <SectionSkeleton rows={3} minHeight="420px" /> }
);
const PremiumFinalCta = dynamic(
  () => import('@/components/landing/premium/final-cta').then((m) => ({ default: m.PremiumFinalCta })),
  { loading: () => <SectionSkeleton rows={1} minHeight="220px" /> }
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

export default async function HomePage() {
  const locale = await getServerLocale();
  return (
    <PremiumShell>
      <JsonLd data={faqJsonLd(getHomepageFaqItems(locale))} />
      <PremiumHero />
      <PremiumTrust />
      <LandingReviewsStrip />
      <DeferredSection intrinsicHeight="420px">
        <PremiumProducts />
      </DeferredSection>
      <DeferredSection intrinsicHeight="480px">
        <PremiumFeatures />
      </DeferredSection>
      <DeferredSection intrinsicHeight="420px">
        <PremiumShowcase />
      </DeferredSection>
      <DeferredSection intrinsicHeight="360px">
        <PremiumWhy />
      </DeferredSection>
      <DeferredSection intrinsicHeight="360px">
        <PremiumProcess />
      </DeferredSection>
      <DeferredSection intrinsicHeight="240px">
        <PremiumStats />
      </DeferredSection>
      <DeferredSection intrinsicHeight="160px">
        <PremiumPricingTeaser />
      </DeferredSection>
      <DeferredSection intrinsicHeight="420px">
        <PremiumFaq />
      </DeferredSection>
      <DeferredSection intrinsicHeight="220px">
        <PremiumFinalCta />
      </DeferredSection>
    </PremiumShell>
  );
}
