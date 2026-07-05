'use client';

import { QrEditDetailsCard } from './qr-edit-details-card';
import { QrEditContentCard } from './qr-edit-content-card';
import { QrEditDesignSection } from './qr-edit-design-section';
import { QrEditFeaturesSection } from './qr-edit-features-section';
import type { QrEditFormColumnProps } from '@/lib/qr-edit-form-column-types';

export function QrEditFormColumn({ form }: QrEditFormColumnProps) {
  if (!form.qr) return null;

  return (
    <div className="space-y-6">
      <QrEditDetailsCard form={form} />
      <QrEditContentCard form={form} />
      <QrEditDesignSection form={form} />
      <QrEditFeaturesSection form={form} />
    </div>
  );
}
