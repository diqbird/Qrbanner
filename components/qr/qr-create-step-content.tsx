'use client';

import type { QrCreateFormState } from '@/hooks/use-qr-create-form';
import { useStudioCreateConfig } from '@/components/studio/studio-create-context';
import { QrCreateStepFormCard } from './qr-create-step-form-card';
import { QrCreateStepPreview } from './qr-create-step-preview';
import { QrCreateQuotaBanner } from './qr-create-quota-banner';

type QrCreateStepContentProps = {
  form: QrCreateFormState;
};

export function QrCreateStepContent({ form }: QrCreateStepContentProps) {
  const studio = useStudioCreateConfig();

  return (
    <div className="space-y-4">
      {!studio ? <QrCreateQuotaBanner /> : null}
      <div className="grid gap-6 lg:grid-cols-2">
        <QrCreateStepFormCard form={form} />
        <QrCreateStepPreview form={form} />
      </div>
    </div>
  );
}
