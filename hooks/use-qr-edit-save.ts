'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { stripMetaFields } from '@/lib/industry-templates';
import { buildQrFeaturePayload } from '@/hooks/use-qr-feature-fields';
import type { QrFeatureFields } from '@/hooks/use-qr-feature-fields';
import type { AdvancedValues } from '@/lib/advanced-settings-types';
import type { QRStyleConfig } from '@/lib/qr-style';
import type { QrEditRecord } from '@/lib/qr-edit-form-types';
import { uploadQrLogoFile } from '@/lib/qr-save-logo-upload';

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
      let logoPath = storedLogoPath ?? qr?.logoPath ?? null;
      if (logoFile) {
        logoPath = (await uploadQrLogoFile(logoFile, t)) ?? logoPath;
      }

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

      if (res.ok) {
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
    qr?.logoPath,
    logoFile,
    qrId,
    name,
    qrData,
    style,
    isActive,
    advanced.password,
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
