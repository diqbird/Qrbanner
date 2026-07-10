'use client';

import { useLanguage } from '@/components/i18n/language-provider';
import { useScanBaseUrl } from '@/lib/use-scan-base-url';
export type { QrEditRecord } from '@/lib/qr-edit-form-types';
import { useQrEditLogo } from '@/hooks/use-qr-edit-logo';
import { useQrEditFormCore } from '@/hooks/use-qr-edit-form-core';
import { useQrEditFormPersistence } from '@/hooks/use-qr-edit-form-persistence';

export function useQrEditForm(qrId: string) {
  const { t } = useLanguage();
  const scanBaseUrl = useScanBaseUrl();
  const { core, coreRest, featureFields, featureSlice, hydrateSetters } = useQrEditFormCore();

  const { qr, loading, handleSave } = useQrEditFormPersistence({
    qrId,
    hydrateSetters,
    name: coreRest.name,
    qrData: coreRest.qrData,
    style: coreRest.style,
    isActive: coreRest.isActive,
    storedLogoPath: coreRest.storedLogoPath,
    advanced: featureSlice.advanced,
    landingEnabled: featureSlice.landingEnabled,
    landingPage: featureSlice.landingPage,
    scheduleEnabled: featureSlice.scheduleEnabled,
    scheduleData: featureSlice.scheduleData,
    geofenceEnabled: featureSlice.geofenceEnabled,
    geofenceData: featureSlice.geofenceData,
    languageRedirectEnabled: featureSlice.languageRedirectEnabled,
    languageRedirectData: featureSlice.languageRedirectData,
    abTestEnabled: featureSlice.abTestEnabled,
    abTestData: featureSlice.abTestData,
    gpsHeatmapEnabled: featureSlice.gpsHeatmapEnabled,
    nfcEnabled: featureSlice.nfcEnabled,
    scanNotify: featureSlice.scanNotify,
    folderId: coreRest.folderId,
    labels: coreRest.labels,
    pixels: featureSlice.pixels,
    removePassword: coreRest.removePassword,
    logoFile: coreRest.logoFile,
    featureFields,
    setLogoFile: coreRest.setLogoFile,
    setSaving: coreRest.setSaving,
    t,
  });

  const { handleLogoChange, applyTemplateLogo } = useQrEditLogo({
    setLogoFile: coreRest.setLogoFile,
    setLogoPreview: core.setLogoPreview,
    setStoredLogoPath: coreRest.setStoredLogoPath,
  });

  return {
    qr,
    loading,
    saving: coreRest.saving,
    name: coreRest.name,
    setName: coreRest.setName,
    targetUrl: coreRest.targetUrl,
    qrData: coreRest.qrData,
    setQrData: coreRest.setQrData,
    style: coreRest.style,
    setStyle: coreRest.setStyle,
    undoStyle: coreRest.undo,
    redoStyle: coreRest.redo,
    canUndoStyle: coreRest.canUndo,
    canRedoStyle: coreRest.canRedo,
    isActive: coreRest.isActive,
    setIsActive: coreRest.setIsActive,
    logoPreview: coreRest.logoPreview,
    storedLogoPath: coreRest.storedLogoPath,
    setStoredLogoPath: coreRest.setStoredLogoPath,
    handleLogoChange,
    featureFields,
    ...featureSlice,
    hasExistingPassword: coreRest.hasExistingPassword,
    removePassword: coreRest.removePassword,
    setRemovePassword: coreRest.setRemovePassword,
    folderId: coreRest.folderId,
    setFolderId: coreRest.setFolderId,
    labels: coreRest.labels,
    setLabels: coreRest.setLabels,
    scanBaseUrl,
    handleSave,
    applyTemplateLogo,
  };
}
