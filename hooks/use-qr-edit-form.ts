'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_QR_STYLE } from '@/components/qr/qr-style-editor';
import { useQRStyleHistory } from '@/hooks/use-qr-style-history';
import { useQrFeatureFields } from '@/hooks/use-qr-feature-fields';
import { useScanBaseUrl } from '@/lib/use-scan-base-url';
import { useLanguage } from '@/components/i18n/language-provider';
import type { QrEditRecord } from '@/lib/qr-edit-form-types';
export type { QrEditRecord } from '@/lib/qr-edit-form-types';
import { mapQrEditRecordToForm } from '@/lib/qr-edit-hydrate';
import { useQrEditDirty } from '@/hooks/use-qr-edit-dirty';
import { useQrEditLogo } from '@/hooks/use-qr-edit-logo';
import { useQrEditSave } from '@/hooks/use-qr-edit-save';

export function useQrEditForm(qrId: string) {
  const { t } = useLanguage();
  const [qr, setQr] = useState<QrEditRecord | null>(null);
  const [loading, setLoading] = useState(true);
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

  const fetchQR = useCallback(async () => {
    try {
      const res = await fetch(`/api/qr/${qrId}`);
      if (res.ok) {
        const data = await res.json();
        const qrCode = data?.qrCode as QrEditRecord | undefined;
        setQr(qrCode ?? null);
        if (qrCode) {
          const mapped = mapQrEditRecordToForm(qrCode);
          setName(mapped.name);
          setTargetUrl(mapped.targetUrl);
          setQrData(mapped.qrData);
          setIsActive(mapped.isActive);
          setHasExistingPassword(mapped.hasExistingPassword);
          applyFeatureFieldsFromRecord(mapped.featureRecord);
          if (mapped.style) resetStyleHistory(mapped.style);
          setFolderId(mapped.folderId);
          setLabels(mapped.labels);
          setStoredLogoPath(mapped.storedLogoPath);
          if (mapped.logoPreview) setLogoPreview(mapped.logoPreview);
        }
      }
    } catch (e: unknown) {
      console.error('Failed to fetch QR code:', e);
    } finally {
      setLoading(false);
    }
  }, [qrId, applyFeatureFieldsFromRecord, resetStyleHistory]);

  useEffect(() => {
    fetchQR();
  }, [fetchQR]);

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
