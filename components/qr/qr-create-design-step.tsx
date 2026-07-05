'use client';

import dynamic from 'next/dynamic';
import { useScanBaseUrl } from '@/lib/use-scan-base-url';
import type { QrCreateFormState } from '@/hooks/use-qr-create-form';
import { mapQrCreateDesignStepProps } from '@/lib/qr-create-design-step-props';
import { QRPreviewSkeleton } from './qr-preview-skeleton';

const QrCreateStepDesign = dynamic(
  () => import('./qr-create-step-design').then((m) => ({ default: m.QrCreateStepDesign })),
  { loading: () => <QRPreviewSkeleton /> },
);

export function QrCreateDesignStep({ form }: { form: QrCreateFormState }) {
  const scanBaseUrl = useScanBaseUrl();
  return <QrCreateStepDesign {...mapQrCreateDesignStepProps(form, scanBaseUrl)} />;
}
