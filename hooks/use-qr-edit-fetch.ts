'use client';

import { useCallback, useEffect, useState } from 'react';
import type { QrEditRecord } from '@/lib/qr-edit-form-types';
import { mapQrEditRecordToForm } from '@/lib/qr-edit-hydrate';
import type { QRStyleConfig } from '@/lib/qr-style';
import type { QrFeatureRecord } from '@/lib/qr-feature-fields-types';

type QrEditHydrateSetters = {
  setName: (name: string) => void;
  setTargetUrl: (url: string) => void;
  setQrData: (data: Record<string, string>) => void;
  setIsActive: (active: boolean) => void;
  setHasExistingPassword: (has: boolean) => void;
  applyFeatureFieldsFromRecord: (record: QrFeatureRecord) => void;
  resetStyleHistory: (style: QRStyleConfig) => void;
  setFolderId: (id: string | null) => void;
  setLabels: (labels: string[]) => void;
  setStoredLogoPath: (path: string | null) => void;
  setLogoPreview: (preview: string | null) => void;
};

export function useQrEditFetch(qrId: string, setters: QrEditHydrateSetters) {
  const [qr, setQr] = useState<QrEditRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQR = useCallback(async () => {
    try {
      const res = await fetch(`/api/qr/${qrId}`);
      if (res.ok) {
        const data = await res.json();
        const qrCode = data?.qrCode as QrEditRecord | undefined;
        setQr(qrCode ?? null);
        if (qrCode) {
          const mapped = mapQrEditRecordToForm(qrCode);
          setters.setName(mapped.name);
          setters.setTargetUrl(mapped.targetUrl);
          setters.setQrData(mapped.qrData);
          setters.setIsActive(mapped.isActive);
          setters.setHasExistingPassword(mapped.hasExistingPassword);
          setters.applyFeatureFieldsFromRecord(mapped.featureRecord);
          if (mapped.style) setters.resetStyleHistory(mapped.style);
          setters.setFolderId(mapped.folderId);
          setters.setLabels(mapped.labels);
          setters.setStoredLogoPath(mapped.storedLogoPath);
          if (mapped.logoPreview) setters.setLogoPreview(mapped.logoPreview);
        }
      }
    } catch (e: unknown) {
      console.error('Failed to fetch QR code:', e);
    } finally {
      setLoading(false);
    }
  }, [qrId, setters]);

  useEffect(() => {
    fetchQR();
  }, [fetchQR]);

  return { qr, setQr, loading, fetchQR };
}
