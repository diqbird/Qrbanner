'use client';

import { useQrEditSave } from '@/hooks/use-qr-edit-save';
import { useQrEditFormFetchDirty } from '@/hooks/use-qr-edit-form-fetch-dirty';
import type { useQrEditHydrateSetters } from '@/hooks/use-qr-edit-hydrate-setters';
import type { QrFeatureFields } from '@/hooks/use-qr-feature-fields';
import type { QrEditPersistenceSnapshotInput } from '@/lib/qr-edit-persistence-snapshot';
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
  const snapshotFields: QrEditPersistenceSnapshotInput = {
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
  };

  const { qr, loading, fetchQR, markSaved } = useQrEditFormFetchDirty({
    qrId,
    hydrateSetters,
    snapshotFields,
    logoFile,
  });

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
