'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { DEFAULT_QR_STYLE, normalizeQRStyle } from '@/components/qr/qr-style-editor';
import { useQRStyleHistory } from '@/hooks/use-qr-style-history';
import type { QRStyleConfig } from '@/lib/qr-style';
import { downscaleLogo } from '@/lib/image-downscale';
import { stripMetaFields } from '@/lib/industry-templates';
import { AdvancedValues } from '@/components/qr/advanced-settings';
import { type LandingPageData } from '@/components/qr/landing-page-editor';
import { type ScheduleData } from '@/components/qr/schedule-settings';
import { type GeofenceData } from '@/components/qr/geofence-settings';
import type { AbTestData } from '@/lib/ab-routing';
import { type ScanNotifyValues } from '@/components/qr/scan-notify-settings';
import { type PixelAnalyticsConfig } from '@/components/qr/analytics-pixel-settings';
import { buildQrFeaturePayload, useQrFeatureFields } from '@/hooks/use-qr-feature-fields';
import { normalizeLabels } from '@/lib/organize-utils';
import { useScanBaseUrl } from '@/lib/use-scan-base-url';
import { useUnsavedChangesGuard } from '@/hooks/use-unsaved-changes-guard';
import { useLanguage } from '@/components/i18n/language-provider';

export interface QrEditRecord {
  id: string;
  name: string;
  shortCode: string;
  category: string;
  targetUrl: string;
  qrData: Record<string, string>;
  style: unknown;
  logoPath: string | null;
  logoIsPublic: boolean;
  isActive: boolean;
  totalScans: number;
  createdAt: string;
  hasPassword?: boolean;
  folderId?: string | null;
  labels?: string[];
}

function editFormSnapshot(input: {
  name: string;
  qrData: Record<string, string>;
  style: QRStyleConfig;
  isActive: boolean;
  storedLogoPath: string | null;
  advanced: AdvancedValues;
  landingEnabled: boolean;
  landingPage: LandingPageData;
  scheduleEnabled: boolean;
  scheduleData: ScheduleData;
  geofenceEnabled: boolean;
  geofenceData: GeofenceData;
  abTestEnabled: boolean;
  abTestData: AbTestData;
  gpsHeatmapEnabled: boolean;
  nfcEnabled: boolean;
  scanNotify: ScanNotifyValues;
  folderId: string | null;
  labels: string[];
  pixels: PixelAnalyticsConfig;
  removePassword: boolean;
}) {
  return JSON.stringify(input);
}

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
  const [baseline, setBaseline] = useState<string | null>(null);
  const [baselineTick, setBaselineTick] = useState(0);

  const formSnapshot = useMemo(
    () =>
      editFormSnapshot({
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

  const isDirty = Boolean(logoFile) || (baseline !== null && formSnapshot !== baseline);
  useUnsavedChangesGuard(isDirty);

  const formSnapshotRef = useRef(formSnapshot);
  formSnapshotRef.current = formSnapshot;

  useEffect(() => {
    if (loading || !qr) {
      setBaseline(null);
      return;
    }
    setBaseline(formSnapshotRef.current);
  }, [loading, qr?.id, baselineTick]);

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
        setBaselineTick((n) => n + 1);
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

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    try {
      const { dataUrl, file: optimized } = await downscaleLogo(file);
      setLogoFile(optimized);
      setLogoPreview(dataUrl);
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
      setLogoFile(file);
    }
  };

  const applyTemplateLogo = useCallback((path: string | null) => {
    setStoredLogoPath(path);
    if (path) setLogoPreview(path);
  }, []);

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
