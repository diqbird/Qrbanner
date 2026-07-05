'use client';

import { useMemo } from 'react';
import type { QrFeatureFields } from '@/hooks/use-qr-feature-fields';
import type { QRStyleConfig } from '@/lib/qr-style';

export function useQrEditHydrateSetters({
  setName,
  setTargetUrl,
  setQrData,
  setIsActive,
  setHasExistingPassword,
  applyFeatureFieldsFromRecord,
  resetStyleHistory,
  setFolderId,
  setLabels,
  setStoredLogoPath,
  setLogoPreview,
}: {
  setName: (name: string) => void;
  setTargetUrl: (url: string) => void;
  setQrData: (data: Record<string, string>) => void;
  setIsActive: (active: boolean) => void;
  setHasExistingPassword: (v: boolean) => void;
  applyFeatureFieldsFromRecord: QrFeatureFields['applyFeatureFieldsFromRecord'];
  resetStyleHistory: (style: QRStyleConfig) => void;
  setFolderId: (id: string | null) => void;
  setLabels: (labels: string[]) => void;
  setStoredLogoPath: (path: string | null) => void;
  setLogoPreview: (preview: string | null) => void;
}) {
  return useMemo(
    () => ({
      setName,
      setTargetUrl,
      setQrData,
      setIsActive,
      setHasExistingPassword,
      applyFeatureFieldsFromRecord,
      resetStyleHistory,
      setFolderId,
      setLabels,
      setStoredLogoPath,
      setLogoPreview,
    }),
    [
      applyFeatureFieldsFromRecord,
      resetStyleHistory,
      setName,
      setTargetUrl,
      setQrData,
      setIsActive,
      setHasExistingPassword,
      setFolderId,
      setLabels,
      setStoredLogoPath,
      setLogoPreview,
    ],
  );
}
