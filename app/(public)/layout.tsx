import dynamic from 'next/dynamic';
import { PublicHeader } from '@/components/public-header';
import { PublicFooter } from '@/components/public-footer';
import { SkipToMain } from '@/components/skip-to-main';
import { AnnouncementBanner } from '@/components/marketing/announcement-banner';
import { Site3DStage } from '@/components/site/site-3d-stage';
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
      <div className="jt-public relative min-h-screen bg-transparent">
        <Site3DStage />
        <AnnouncementBanner />
        <PublicHeader />
        <main id="main-content" className="relative z-10 min-h-screen">
          {children}
        </main>
        <PublicFooter />
        <LandingStickyCta />
        <LiveChat />
      </div>
    </>
  );
}
