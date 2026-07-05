'use client';

import { useQrEditFetch } from '@/hooks/use-qr-edit-fetch';
import { useQrEditFormSnapshot } from '@/hooks/use-qr-edit-form-snapshot';
import { useQrEditDirty } from '@/hooks/use-qr-edit-dirty';
import { useQrEditSave } from '@/hooks/use-qr-edit-save';
import type { useQrEditHydrateSetters } from '@/hooks/use-qr-edit-hydrate-setters';
import type { QrFeatureFields } from '@/hooks/use-qr-feature-fields';
import type { QRStyleConfig } from '@/lib/qr-style';

type HydrateSetters = ReturnType<typeof useQrEditHydrateSetters>;

export function useQrEditFormPersistence({
  qrId,
  hydrateSetters,
  name,
  qrData,
  style,
  isActive,
  storedLogoPath,
  advanced,
  landingEnabled,
  landingPage,
  scheduleEnabled,
  scheduleData,
  geofenceEnabled,
  geofenceData,
  abTestEnabled,
  abTestData,
  gpsHeatmapEnabled,
  nfcEnabled,
  scanNotify,
  folderId,
  labels,
  pixels,
  removePassword,
  logoFile,
  featureFields,
  setLogoFile,
  setSaving,
  t,
}: {
  qrId: string;
  hydrateSetters: HydrateSetters;
  name: string;
  qrData: Record<string, string>;
  style: QRStyleConfig;
  isActive: boolean;
  storedLogoPath: string | null;
  advanced: QrFeatureFields['advanced'];
  landingEnabled: boolean;
  landingPage: QrFeatureFields['landingPage'];
  scheduleEnabled: boolean;
  scheduleData: QrFeatureFields['scheduleData'];
  geofenceEnabled: boolean;
  geofenceData: QrFeatureFields['geofenceData'];
  abTestEnabled: boolean;
  abTestData: QrFeatureFields['abTestData'];
  gpsHeatmapEnabled: boolean;
  nfcEnabled: boolean;
  scanNotify: QrFeatureFields['scanNotify'];
  folderId: string | null;
  labels: string[];
  pixels: QrFeatureFields['pixels'];
  removePassword: boolean;
  logoFile: File | null;
  featureFields: QrFeatureFields;
  setLogoFile: (f: File | null) => void;
  setSaving: (v: boolean) => void;
  t: (key: string) => string;
}) {
  const { qr, loading, fetchQR } = useQrEditFetch(qrId, hydrateSetters);

  const snapshotInput = useQrEditFormSnapshot({
    name,
    qrData,
    style,
    isActive,
    storedLogoPath,
    advanced,
    landingEnabled,
    landingPage,
    scheduleEnabled,
    scheduleData,
    geofenceEnabled,
    geofenceData,
    abTestEnabled,
    abTestData,
    gpsHeatmapEnabled,
    nfcEnabled,
    scanNotify,
    folderId,
    labels,
    pixels,
    removePassword,
  });

  const { markSaved } = useQrEditDirty(loading, qr?.id, snapshotInput, logoFile);

  const { handleSave } = useQrEditSave({
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
  });

  return { qr, loading, handleSave };
}
