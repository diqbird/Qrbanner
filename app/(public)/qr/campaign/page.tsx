import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { pageMetadata } from '@/lib/seo';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

function CampaignFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

const CampaignWizard = dynamic(
  () => import('@/components/qr/campaign-wizard').then((m) => ({ default: m.CampaignWizard })),
  { loading: () => <CampaignFallback /> }
);

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('campaign.metaTitle'),
    description: t('campaign.metaDescription'),
    path: '/qr/campaign',
    noIndex: true,
  });
}

export default function CampaignPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10">
      <CampaignWizard />
    </div>
  );
}
