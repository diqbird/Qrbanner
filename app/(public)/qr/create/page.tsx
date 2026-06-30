import type { Metadata } from 'next';
import { Suspense } from 'react';
import { QRCreateWizard } from '@/components/qr/qr-create-wizard';
import { pageMetadata } from '@/lib/seo';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    title: t('qrCreatePage.metaTitle'),
    description: t('qrCreatePage.metaDescription'),
    path: '/qr/create',
    noIndex: true,
  });
}

function CreateWizardFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
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
