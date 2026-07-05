'use client';

import { useLanguage } from '@/components/i18n/language-provider';
import { useScanBaseUrl } from '@/lib/use-scan-base-url';
export type { QrEditRecord } from '@/lib/qr-edit-form-types';
import { useQrEditDirty } from '@/hooks/use-qr-edit-dirty';
import { useQrEditLogo } from '@/hooks/use-qr-edit-logo';
import { useQrEditSave } from '@/hooks/use-qr-edit-save';
import { useQrEditFetch } from '@/hooks/use-qr-edit-fetch';
import { useQrEditFormSnapshot } from '@/hooks/use-qr-edit-form-snapshot';
import { useQrEditCoreState } from '@/hooks/use-qr-edit-core-state';
import { useQrEditHydrateSetters } from '@/hooks/use-qr-edit-hydrate-setters';

export function useQrEditForm(qrId: string) {
  const { t } = useLanguage();
  const scanBaseUrl = useScanBaseUrl();

  const core = useQrEditCoreState();
  const {
    saving,
    setSaving,
    name,
    setName,
    targetUrl,
    setTargetUrl,
    qrData,
    setQrData,
    style,
    setStyle,
    undo: undoStyle,
    redo: redoStyle,
    resetHistory: resetStyleHistory,
    canUndo: canUndoStyle,
    canRedo: canRedoStyle,
    isActive,
    setIsActive,
    logoPreview,
    logoFile,
    setLogoFile,
    storedLogoPath,
    setStoredLogoPath,
    featureFields,
    hasExistingPassword,
    setHasExistingPassword,
    removePassword,
    setRemovePassword,
    folderId,
    setFolderId,
    labels,
    setLabels,
  } = core;

  const {
    advanced,
    setAdvanced,
    landingEnabled,
    setLandingEnabled,
    landingPage,
    setLandingPage,
    scheduleEnabled,
    setScheduleEnabled,
    scheduleData,
    setScheduleData,
    geofenceEnabled,
    setGeofenceEnabled,
    geofenceData,
    setGeofenceData,
    abTestEnabled,
    setAbTestEnabled,
    abTestData,
    setAbTestData,
    gpsHeatmapEnabled,
    setGpsHeatmapEnabled,
    nfcEnabled,
    setNfcEnabled,
    scanNotify,
    setScanNotify,
    pixels,
    setPixels,
    applyFeatureFieldsFromRecord,
  } = featureFields;

  const hydrateSetters = useQrEditHydrateSetters({
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
    setLogoPreview: core.setLogoPreview,
  });

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

  const { handleLogoChange, applyTemplateLogo } = useQrEditLogo({
    setLogoFile,
    setLogoPreview: core.setLogoPreview,
    setStoredLogoPath,
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

  return {
    qr,
    loading,
    saving,
    name,
    setName,
    targetUrl,
    qrData,
    setQrData,
    style,
    setStyle,
    undoStyle,
    redoStyle,
    canUndoStyle,
    canRedoStyle,
    isActive,
    setIsActive,
    logoPreview,
    storedLogoPath,
    setStoredLogoPath,
    handleLogoChange,
    featureFields,
    advanced,
    setAdvanced,
    landingEnabled,
    setLandingEnabled,
    landingPage,
    setLandingPage,
    scheduleEnabled,
    setScheduleEnabled,
    scheduleData,
    setScheduleData,
    geofenceEnabled,
    setGeofenceEnabled,
    geofenceData,
    setGeofenceData,
    abTestEnabled,
    setAbTestEnabled,
    abTestData,
    setAbTestData,
    gpsHeatmapEnabled,
    setGpsHeatmapEnabled,
    nfcEnabled,
    setNfcEnabled,
    scanNotify,
    setScanNotify,
    pixels,
    setPixels,
    hasExistingPassword,
    removePassword,
    setRemovePassword,
    folderId,
    setFolderId,
    labels,
    setLabels,
    scanBaseUrl,
    handleSave,
    applyTemplateLogo,
  };
}
