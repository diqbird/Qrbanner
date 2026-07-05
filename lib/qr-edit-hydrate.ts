import { normalizeQRStyle } from '@/components/qr/qr-style-editor';
import type { QRStyleConfig } from '@/lib/qr-style';
import { normalizeLabels } from '@/lib/organize-utils';
import type { QrEditRecord } from '@/lib/qr-edit-form-types';
import type { QrFeatureRecord } from '@/lib/qr-feature-fields-types';

export function mapQrEditRecordToForm(qrCode: QrEditRecord) {
  return {
    name: qrCode.name ?? '',
    targetUrl: qrCode.targetUrl ?? '',
    qrData: qrCode.qrData ?? {},
    isActive: qrCode.isActive ?? true,
    hasExistingPassword: Boolean(qrCode.hasPassword),
    featureRecord: qrCode as QrFeatureRecord,
    style:
      qrCode.style && typeof qrCode.style === 'object'
        ? normalizeQRStyle(qrCode.style as Partial<QRStyleConfig>)
        : null,
    folderId: qrCode.folderId ?? null,
    labels: normalizeLabels(qrCode.labels ?? []),
    storedLogoPath: qrCode.logoPath ?? null,
    logoPreview: qrCode.logoPath ?? null,
  };
}
