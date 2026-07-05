'use client';

import type { QrCreateFormState } from '@/hooks/use-qr-create-form';
import { QrCreateStepFormCard } from './qr-create-step-form-card';
import { QrCreateStepPreview } from './qr-create-step-preview';

type QrCreateStepContentProps = {
  form: QrCreateFormState;
};

export function QrCreateStepContent({ form }: QrCreateStepContentProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <QrCreateStepFormCard form={form} />
      <QrCreateStepPreview form={form} />
    </div>
  );
}
