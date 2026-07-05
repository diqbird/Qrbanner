import { stripMetaFields } from '@/lib/industry-templates';
import { buildQrFeaturePayload } from '@/hooks/use-qr-feature-fields';
import type { QrFeatureFields } from '@/hooks/use-qr-feature-fields';
import type { AdvancedValues } from '@/lib/advanced-settings-types';
import type { QRStyleConfig } from '@/lib/qr-style';

export async function putUpdateQr({
  qrId,
  name,
  qrData,
  style,
  isActive,
  logoPath,
  advanced,
  removePassword,
  folderId,
  labels,
  featureFields,
}: {
  qrId: string;
  name: string;
  qrData: Record<string, string>;
  style: QRStyleConfig;
  isActive: boolean;
  logoPath: string | null;
  advanced: AdvancedValues;
  removePassword: boolean;
  folderId: string | null;
  labels: string[];
  featureFields: QrFeatureFields;
}): Promise<boolean> {
  const res = await fetch(`/api/qr/${qrId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      qrData: stripMetaFields(qrData),
      style,
      isActive,
      logoPath,
      logoIsPublic: true,
      password: advanced.password ? advanced.password : removePassword ? '' : undefined,
      folderId,
      labels,
      ...buildQrFeaturePayload({ name, mode: 'update', fields: featureFields }),
    }),
  });

  return res.ok;
}
