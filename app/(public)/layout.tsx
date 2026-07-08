import dynamic from 'next/dynamic';
import { PublicHeader } from '@/components/public-header';
import { PublicFooter } from '@/components/public-footer';
import { SkipToMain } from '@/components/skip-to-main';
import { AnnouncementBanner } from '@/components/marketing/announcement-banner';
import { JsonLd } from '@/components/seo/json-ld';
import {
  organizationJsonLd,
  websiteJsonLd,
  softwareApplicationJsonLd,
} from '@/lib/seo';

const LandingStickyCta = dynamic(
  () => import('@/components/landing/sticky-cta').then((m) => ({ default: m.LandingStickyCta })),
  { ssr: false }
);
const LiveChat = dynamic(
  () => import('@/components/marketing/live-chat').then((m) => ({ default: m.LiveChat })),
  { ssr: false }
);

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipToMain />
      <JsonLd
        data={[organizationJsonLd(), websiteJsonLd(), softwareApplicationJsonLd()]}
      />
      <div className="relative min-h-screen bg-background">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.06),transparent_55%)]"
        />
        <AnnouncementBanner />
        <PublicHeader />
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <PublicFooter />
        <LandingStickyCta />
        <LiveChat />
      </div>
    </>
  );
}
