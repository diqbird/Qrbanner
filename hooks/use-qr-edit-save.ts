'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { putUpdateQr } from '@/lib/qr-edit-save-api';
import { resolveQrEditLogoPath } from '@/lib/qr-edit-save-logo';
import type { QrFeatureFields } from '@/hooks/use-qr-feature-fields';
import type { AdvancedValues } from '@/lib/advanced-settings-types';
import type { QRStyleConfig } from '@/lib/qr-style';
import type { QrEditRecord } from '@/lib/qr-edit-form-types';

type Translate = (key: string) => string;

export function useQrEditSave({
  qrId,
  qr,
  name,
  qrData,
  style,
  isActive,
  logoFile,
  storedLogoPath,
  advanced,
  removePassword,
  folderId,
  labels,
  featureFields,
  setLogoFile,
  markSaved,
  fetchQR,
  t,
  setSaving,
}: {
  qrId: string;
  qr: QrEditRecord | null;
  name: string;
  qrData: Record<string, string>;
  style: QRStyleConfig;
  isActive: boolean;
  logoFile: File | null;
  storedLogoPath: string | null;
  advanced: AdvancedValues;
  removePassword: boolean;
  folderId: string | null;
  labels: string[];
  featureFields: QrFeatureFields;
  setLogoFile: (f: File | null) => void;
  markSaved: () => void;
  fetchQR: () => Promise<void>;
  t: Translate;
  setSaving: (v: boolean) => void;
}) {
  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const logoPath = await resolveQrEditLogoPath({ logoFile, storedLogoPath, qr, t });

      const ok = await putUpdateQr({
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
      });

      if (ok) {
        toast.success(t('editQr.updated'));
        setLogoFile(null);
        markSaved();
        await fetchQR();
      } else {
        toast.error(t('editQr.updateFailed'));
      }
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setSaving(false);
    }
  }, [
    setSaving,
    storedLogoPath,
    qr,
    logoFile,
    qrId,
    name,
    qrData,
    style,
    isActive,
    advanced,
    removePassword,
    folderId,
    labels,
    featureFields,
    setLogoFile,
    markSaved,
    fetchQR,
    t,
  ]);

  return { handleSave };
}
