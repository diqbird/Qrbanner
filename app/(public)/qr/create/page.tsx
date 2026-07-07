import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { pageMetadata } from '@/lib/seo';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { formatIndustryTemplateCount, formatQrTypeCount } from '@/lib/i18n/qr-type-count';

function CreateWizardFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

const QRCreateWizard = dynamic(
  () => import('@/components/qr/qr-create-wizard').then((m) => ({ default: m.QRCreateWizard })),
  { loading: () => <CreateWizardFallback /> },
);

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);
  return pageMetadata({
    locale,
    title: t('qrCreatePage.metaTitle'),
    description: t('qrCreatePage.metaDescription', {
      types: formatQrTypeCount(locale),
      templates: formatIndustryTemplateCount(locale),
    }),
    path: '/qr/create',
    noIndex: true,
  });
}

export default function CreateQRPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10">
      <Suspense fallback={<CreateWizardFallback />}>
        <QRCreateWizard />
      </Suspense>
    </div>
  );
}
