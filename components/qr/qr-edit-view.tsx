'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/i18n/language-provider';
import { QRPreviewSkeleton } from './qr-preview-skeleton';
import { normalizeQRStyle } from './qr-style-editor';
import { QrEditHeader } from './qr-edit-header';
import { QrEditFormColumn } from './qr-edit-form-column';
import { EditQrTips } from './edit-qr-tips';
import { OnboardingSuccessCard } from '@/components/onboarding/onboarding-success-card';
import { useQrEditForm } from '@/hooks/use-qr-edit-form';

const QRPreview = dynamic(
  () => import('./qr-preview').then((m) => ({ default: m.QRPreview })),
  { loading: () => <QRPreviewSkeleton /> },
);

export function QREditView({ qrId }: { qrId: string }) {
  const { t } = useLanguage();
  const form = useQrEditForm(qrId);
  const { qr, loading, saving, qrData, style, setStyle, logoPreview, name, handleSave } = form;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!qr) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">{t('editQr.notFound')}</p>
        <Link href="/dashboard" className="mt-4">
          <Button variant="outline">{t('editQr.backToDashboard')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <QrEditHeader
        qrId={qrId}
        category={qr.category}
        isActive={form.isActive}
        saving={saving}
        onSave={handleSave}
      />

      <OnboardingSuccessCard qrId={qrId} qrName={qr.name} shortCode={qr.shortCode} />

      <EditQrTips />

      <div className="grid gap-6 lg:grid-cols-2">
        <QrEditFormColumn form={form} />

        <QRPreview
          category={qr.category ?? 'url'}
          qrData={qrData}
          style={style}
          logoPreview={logoPreview}
          shortCode={qr.shortCode}
          qrName={name}
          showScanTest
          showExtras
          showPrintBanner
          onStyleChange={(next) => setStyle(normalizeQRStyle(next))}
        />
      </div>
    </div>
  );
}
