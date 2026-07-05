'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { DEFAULT_QR_STYLE, normalizeQRStyle } from '@/components/qr/qr-style-editor';
import { useQRStyleHistory } from '@/hooks/use-qr-style-history';
import type { QRStyleConfig } from '@/lib/qr-style';
import { stripMetaFields } from '@/lib/industry-templates';
import { buildQrFeaturePayload, useQrFeatureFields } from '@/hooks/use-qr-feature-fields';
import { normalizeLabels } from '@/lib/organize-utils';
import { useScanBaseUrl } from '@/lib/use-scan-base-url';
import { useLanguage } from '@/components/i18n/language-provider';
import type { QrEditRecord } from '@/lib/qr-edit-form-types';
export type { QrEditRecord } from '@/lib/qr-edit-form-types';
import { useQrEditDirty } from '@/hooks/use-qr-edit-dirty';
import { useQrEditLogo } from '@/hooks/use-qr-edit-logo';

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
        setName(qrCode?.name ?? '');
        setTargetUrl(qrCode?.targetUrl ?? '');
        setQrData(qrCode?.qrData ?? {});
        setIsActive(qrCode?.isActive ?? true);
        setHasExistingPassword(Boolean(qrCode?.hasPassword));
        applyFeatureFieldsFromRecord(qrCode ?? {});
        if (qrCode?.style && typeof qrCode.style === 'object') {
          resetStyleHistory(normalizeQRStyle(qrCode.style as Partial<QRStyleConfig>));
        }
        setFolderId(qrCode?.folderId ?? null);
        setLabels(normalizeLabels(qrCode?.labels ?? []));
        setStoredLogoPath(qrCode?.logoPath ?? null);
        if (qrCode?.logoPath) setLogoPreview(qrCode.logoPath);
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

  const handleSave = async () => {
    setSaving(true);
    try {
      let logoPath = storedLogoPath ?? qr?.logoPath ?? null;
      if (logoFile) {
        const formData = new FormData();
        formData.append('file', logoFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        if (uploadRes.ok) {
          const { path } = await uploadRes.json();
          logoPath = path;
        } else {
          toast.error(t('editQr.logoUploadPartialFail'));
        }
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
          password: advanced.password ? advanced.password : (removePassword ? '' : undefined),
          folderId,
          labels,
          ...buildQrFeaturePayload({ name, mode: 'update', fields: featureFields }),
        }),
      });

      if (res.ok) {
        toast.success(t('editQr.updated'));
        setLogoFile(null);
        markSaved();
        fetchQR();
      } else {
        toast.error(t('editQr.updateFailed'));
      }
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setSaving(false);
    }
  };

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
