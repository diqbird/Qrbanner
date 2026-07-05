'use client';

import dynamic from 'next/dynamic';
import { QRPreviewSkeleton } from '@/components/qr/qr-preview-skeleton';
import type { QrCreateFormState } from '@/hooks/use-qr-create-form';

const QRPreview = dynamic(
  () => import('./qr-preview').then((m) => ({ default: m.QRPreview })),
  { loading: () => <QRPreviewSkeleton /> },
);

export function QrCreateStepPreview({ form }: { form: QrCreateFormState }) {
  const { category, qrData, style, logoPreview, activeTemplate, landingPage } = form;

  return (
    <div className="order-1 h-fit lg:order-2 lg:sticky lg:top-24">
      <QRPreview
        category={category}
        qrData={qrData}
        style={style}
        logoPreview={logoPreview}
        printLayout={activeTemplate?.printLayout}
        industryTemplateId={activeTemplate?.id}
        accentColor={landingPage.accentColor}
      />
    </div>
  );
}
