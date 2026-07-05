'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Trash2, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { QRPreviewSkeleton } from './qr-preview-skeleton';
import { QRStyleEditor, DEFAULT_QR_STYLE, normalizeQRStyle } from './qr-style-editor';
import { StyleHistoryToolbar } from './style-history-toolbar';
import { useQRStyleHistory } from '@/hooks/use-qr-style-history';
import { AiDesignAssistant } from './ai-design-assistant';
import type { QRStyleConfig } from '@/lib/qr-style';
import { downscaleLogo } from '@/lib/image-downscale';
import { CategoryFields } from './category-fields';
import { LinkHubEditor, firstHubUrl } from './link-hub-editor';
import { stripMetaFields } from '@/lib/industry-templates';
import { buildQRPayload, isDynamicCategory } from '@/lib/qr-utils';
import { AdvancedSettings, AdvancedValues } from './advanced-settings';
import { LandingPageEditor, type LandingPageData } from './landing-page-editor';
import { ScheduleSettings, type ScheduleData } from './schedule-settings';
import { GeofenceSettings, type GeofenceData } from './geofence-settings';
import { AbTestSettings } from './ab-test-settings';
import type { AbTestData } from '@/lib/ab-routing';
import { GpsHeatmapSettings } from './gps-heatmap';
import { NfcExportPanel } from './nfc-export-panel';
import { ScanNotifySettings, type ScanNotifyValues } from './scan-notify-settings';
import { AnalyticsPixelSettings, type PixelAnalyticsConfig } from './analytics-pixel-settings';
import { buildQrFeaturePayload, useQrFeatureFields } from '@/hooks/use-qr-feature-fields';
import { QROrganizeSettings } from './qr-organize-settings';
import { QrEditHeader } from './qr-edit-header';
import { EditQrTips } from './edit-qr-tips';
import { normalizeLabels } from '@/lib/organize-utils';
import { useScanBaseUrl, buildScanLink } from '@/lib/use-scan-base-url';
import { OnboardingSuccessCard } from '@/components/onboarding/onboarding-success-card';
import { useUnsavedChangesGuard } from '@/hooks/use-unsaved-changes-guard';

const QRPreview = dynamic(
  () => import('./qr-preview').then((m) => ({ default: m.QRPreview })),
  { loading: () => <QRPreviewSkeleton /> },
);

interface QRCodeData {
  id: string;
  name: string;
  shortCode: string;
  category: string;
  targetUrl: string;
  qrData: Record<string, string>;
  style: any;
  logoPath: string | null;
  logoIsPublic: boolean;
  isActive: boolean;
  totalScans: number;
  createdAt: string;
  hasPassword?: boolean;
  expiresAt?: string | null;
  scanLimit?: number | null;
  iosUrl?: string | null;
  androidUrl?: string | null;
  utmEnabled?: boolean;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  landingPageEnabled?: boolean;
  landingPageData?: LandingPageData | null;
  scheduleEnabled?: boolean;
  scheduleData?: ScheduleData | null;
  geofenceEnabled?: boolean;
  geofenceData?: GeofenceData | null;
  abTestEnabled?: boolean;
  abTestData?: AbTestData | null;
  gpsHeatmapEnabled?: boolean;
  nfcEnabled?: boolean;
  scanNotifyEnabled?: boolean;
  scanNotifyFirst?: boolean;
  scanNotifyMilestones?: boolean;
  scanNotifyEvery?: boolean;
  ga4Enabled?: boolean;
  ga4MeasurementId?: string | null;
  metaPixelEnabled?: boolean;
  metaPixelId?: string | null;
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

export function QREditView({ qrId }: { qrId: string }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [qr, setQr] = useState<QRCodeData | null>(null);
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
        const qrCode = data?.qrCode;
        setQr(qrCode);
        setName(qrCode?.name ?? '');
        setTargetUrl(qrCode?.targetUrl ?? '');
        setQrData(qrCode?.qrData ?? {});
        setIsActive(qrCode?.isActive ?? true);
        setHasExistingPassword(Boolean(qrCode?.hasPassword));
        applyFeatureFieldsFromRecord(qrCode);
        if (qrCode?.style && typeof qrCode.style === 'object') {
          resetStyleHistory(normalizeQRStyle(qrCode.style as Partial<QRStyleConfig>));
        }
        setFolderId(qrCode?.folderId ?? null);
        setLabels(normalizeLabels(qrCode?.labels ?? []));
        setStoredLogoPath(qrCode?.logoPath ?? null);
        if (qrCode?.logoPath) setLogoPreview(qrCode.logoPath);
      }
    } catch (e: any) {
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
    } catch (e: any) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!qr) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">{t('editQr.notFound')}</p>
        <Link href="/dashboard" className="mt-4">
          <Button variant="outline">{t('editQr.backToDashboard')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <QrEditHeader
        qrId={qrId}
        category={qr.category}
        isActive={isActive}
        saving={saving}
        onSave={handleSave}
      />

      <OnboardingSuccessCard qrId={qrId} qrName={qr.name} />

      <EditQrTips />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-base">{t('editQr.details')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('common.name')}</Label>
                <Input value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t('editQr.shortLink')}</Label>
                <div className="flex items-center gap-2">
                  <Input value={`/s/${qr?.shortCode ?? ''}`} disabled className="font-mono text-xs" />
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => {
                      navigator.clipboard?.writeText?.(buildScanLink(qr?.shortCode ?? '', scanBaseUrl));
                      toast.success(t('editQr.linkCopied'));
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => window.open(`/s/${qr?.shortCode ?? ''}`, '_blank')}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('editQr.activeStatus')}</Label>
                  <p className="text-xs text-muted-foreground">{t('editQr.inactiveHint')}</p>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-base">{t('editQr.qrContent')}</CardTitle>
            </CardHeader>
            <CardContent>
              {qr?.category === 'link_hub' ? (
                <LinkHubEditor
                  landing={landingPage}
                  qrName={name}
                  onChange={(next) => {
                    setLandingPage(next);
                    const url = firstHubUrl(next.hubLinks);
                    if (url) setQrData({ url });
                  }}
                />
              ) : (
                <CategoryFields
                  category={qr?.category ?? 'url'}
                  data={qrData}
                  onChange={setQrData}
                />
              )}
            </CardContent>
          </Card>

          <QROrganizeSettings
            folderId={folderId}
            labels={labels}
            onFolderChange={setFolderId}
            onLabelsChange={setLabels}
          />

          <AiDesignAssistant
            category={qr?.category ?? 'url'}
            qrName={name}
            style={style}
            onApplyStyle={(patch) => setStyle(normalizeQRStyle({ ...style, ...patch }))}
            onLogoSize={(size) => setStyle(normalizeQRStyle({ ...style, logoSize: size }))}
          />

          <StyleHistoryToolbar
            canUndo={canUndoStyle}
            canRedo={canRedoStyle}
            onUndo={undoStyle}
            onRedo={redoStyle}
          />

          <QRStyleEditor
            style={style}
            onStyleChange={(next) => setStyle(normalizeQRStyle(next))}
            onLogoChange={handleLogoChange}
            logoPreview={logoPreview}
            logoPath={storedLogoPath}
            onTemplateLogoApply={(path) => {
              setStoredLogoPath(path);
              if (path) setLogoPreview(path);
            }}
          />

          <AdvancedSettings
            category={qr?.category ?? 'url'}
            values={advanced}
            onChange={setAdvanced}
            hasExistingPassword={hasExistingPassword}
          />

          {isDynamicCategory(qr?.category ?? '') && (
            <>
              <LandingPageEditor
                enabled={landingEnabled}
                onEnabledChange={setLandingEnabled}
                data={landingPage}
                onChange={setLandingPage}
                qrName={name}
                category={qr?.category ?? 'url'}
                targetUrl={targetUrl}
              />
              <ScheduleSettings
                enabled={scheduleEnabled}
                onEnabledChange={setScheduleEnabled}
                data={scheduleData}
                onChange={setScheduleData}
              />
              <GeofenceSettings
                enabled={geofenceEnabled}
                onEnabledChange={setGeofenceEnabled}
                data={geofenceData}
                onChange={setGeofenceData}
              />
              <AbTestSettings
                enabled={abTestEnabled}
                onEnabledChange={setAbTestEnabled}
                data={abTestData}
                onChange={setAbTestData}
                defaultUrl={targetUrl}
              />
              <GpsHeatmapSettings
                enabled={gpsHeatmapEnabled}
                onEnabledChange={setGpsHeatmapEnabled}
              />
            </>
          )}

          {qr?.shortCode && (
            <NfcExportPanel
              enabled={nfcEnabled}
              onEnabledChange={setNfcEnabled}
              scanUrl={buildScanLink(qr.shortCode, scanBaseUrl)}
              shortCode={qr.shortCode}
            />
          )}

          <ScanNotifySettings values={scanNotify} onChange={setScanNotify} />

          <AnalyticsPixelSettings values={pixels} onChange={setPixels} />

          {hasExistingPassword && (
            <div className="flex items-center justify-between rounded-lg border border-dashed p-4">
              <div>
                <Label>{t('editQr.removePassword')}</Label>
                <p className="text-xs text-muted-foreground">{t('editQr.removePasswordHint')}</p>
              </div>
              <Switch checked={removePassword} onCheckedChange={setRemovePassword} />
            </div>
          )}
        </div>

        <QRPreview
          category={qr?.category ?? 'url'}
          qrData={qrData}
          style={style}
          logoPreview={logoPreview}
          shortCode={qr?.shortCode ?? ''}
          qrName={name}
          showScanTest
          showExtras
          showPrintBanner
          onStyleChange={(next) => setStyle(normalizeQRStyle(next))}
        />
      </div>
    </div>
  );
}
