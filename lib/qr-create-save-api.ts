import { toast } from 'sonner';
import { clearQrCreateDraft } from '@/lib/qr-create-draft';
import { buildQrFeaturePayload } from '@/hooks/use-qr-feature-fields';
import type { QrFeatureFields } from '@/hooks/use-qr-feature-fields';
import type { AdvancedValues } from '@/lib/advanced-settings-types';
import type { QRStyleConfig } from '@/lib/qr-style';

type CreateQrApiResult = { qrCode?: { id?: string }; firstQr?: boolean; error?: string };

export async function postCreateQr({
  name,
  category,
  payloadData,
  style,
  logoPath,
  advanced,
  featureFields,
  isActive = true,
  studioEntitlementId,
}: {
  name: string;
  category: string;
  payloadData: Record<string, string>;
  style: QRStyleConfig;
  logoPath: string | null | undefined;
  advanced: AdvancedValues;
  featureFields: QrFeatureFields;
  isActive?: boolean;
  studioEntitlementId?: string;
}): Promise<
  { ok: true; id: string; firstQr: boolean } | { ok: false; status: number; error?: string }
> {
  const res = await fetch('/api/qr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      category,
      qrData: payloadData,
      style,
      logoPath,
      logoIsPublic: true,
      password: advanced.password || undefined,
      isActive,
      studioEntitlementId,
      ...buildQrFeaturePayload({ name, mode: 'create', fields: featureFields }),
    }),
  });

  if (res.ok) {
    const data = (await res.json()) as CreateQrApiResult;
    clearQrCreateDraft();
    return { ok: true, id: data?.qrCode?.id ?? '', firstQr: Boolean(data?.firstQr) };
  }

  if (res.status === 401) {
    return { ok: false, status: 401 };
  }

  const err = (await res.json()) as CreateQrApiResult;
  return { ok: false, status: res.status, error: err?.error };
}

export function toastCreateQrError(t: (key: string) => string, error?: string) {
  toast.error(error ?? t('create.createFailed'));
}

export function toastCreateQrUnexpected(t: (key: string) => string) {
  toast.error(t('bulk.somethingWrong'));
}
