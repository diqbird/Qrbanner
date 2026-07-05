'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_QR_STYLE } from '@/components/qr/qr-style-editor';
import { useQRStyleHistory } from '@/hooks/use-qr-style-history';
import { useQrFeatureFields } from '@/hooks/use-qr-feature-fields';
import { useScanBaseUrl } from '@/lib/use-scan-base-url';
import { useLanguage } from '@/components/i18n/language-provider';
export type { QrEditRecord } from '@/lib/qr-edit-form-types';
import { useQrEditDirty } from '@/hooks/use-qr-edit-dirty';
import { useQrEditLogo } from '@/hooks/use-qr-edit-logo';
import { useQrEditSave } from '@/hooks/use-qr-edit-save';
import { useQrEditFetch } from '@/hooks/use-qr-edit-fetch';

export function useQrEditForm(qrId: string) {
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [qrData, setQrData] = useState<Record<string, string>>({});
  const {
    style,
    setStyle,
    undo: undoStyle,
    redo: redoStyle,
    resetHistory: resetStyleHistory,
    canUndo: canUndoStyle,
    canRedo: canRedoStyle,
  } = useQRStyleHistory(DEFAULT_QR_STYLE);
  const [isActive, setIsActive] = useState(true);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [storedLogoPath, setStoredLogoPath] = useState<string | null>(null);
  const featureFields = useQrFeatureFields();
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
  const [hasExistingPassword, setHasExistingPassword] = useState(false);
  const [removePassword, setRemovePassword] = useState(false);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const scanBaseUrl = useScanBaseUrl();

  const hydrateSetters = useMemo(
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
    [applyFeatureFieldsFromRecord, resetStyleHistory],
  );

  const { qr, loading, fetchQR } = useQrEditFetch(qrId, hydrateSetters);

  const snapshotInput = useMemo(
    () => ({
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
    }),
    [
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
    ],
  );

  const { markSaved } = useQrEditDirty(loading, qr?.id, snapshotInput, logoFile);

  const { handleLogoChange, applyTemplateLogo } = useQrEditLogo({
    setLogoFile,
    setLogoPreview,
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
