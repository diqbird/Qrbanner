import { uploadQrLogoFile } from '@/lib/qr-save-logo-upload';
import type { QrEditRecord } from '@/lib/qr-edit-form-types';

type Translate = (key: string) => string;

export async function resolveQrEditLogoPath({
  logoFile,
  storedLogoPath,
  qr,
  t,
}: {
  logoFile: File | null;
  storedLogoPath: string | null;
  qr: QrEditRecord | null;
  t: Translate;
}): Promise<string | null> {
  let logoPath = storedLogoPath ?? qr?.logoPath ?? null;
  if (logoFile) {
    logoPath = (await uploadQrLogoFile(logoFile, t)) ?? logoPath;
  }
  return logoPath;
}
