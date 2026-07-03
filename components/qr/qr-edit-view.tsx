'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, BarChart3, Trash2, Copy, ExternalLink } from 'lucide-react';
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
import { categoryDisplayName } from '@/lib/qr-utils';
import { stripMetaFields } from '@/lib/industry-templates';
import { buildQRPayload, isDynamicCategory } from '@/lib/qr-utils';
import { AdvancedSettings, AdvancedValues, emptyAdvanced } from './advanced-settings';
import { LandingPageEditor, emptyLandingPage, LandingPageData } from './landing-page-editor';
import { ScheduleSettings, emptyScheduleData, ScheduleData } from './schedule-settings';
import { GeofenceSettings, emptyGeofenceData, GeofenceData } from './geofence-settings';
import { AbTestSettings, emptyAbTestData } from './ab-test-settings';
import { parseAbTestData, type AbTestData } from '@/lib/ab-routing';
import { GpsHeatmapSettings } from './gps-heatmap';
import { NfcExportPanel } from './nfc-export-panel';
import { ScanNotifySettings, emptyScanNotify, ScanNotifyValues } from './scan-notify-settings';
import {
  AnalyticsPixelSettings,
  emptyPixelAnalytics,
  type PixelAnalyticsConfig,
} from './analytics-pixel-settings';
import { QROrganizeSettings } from './qr-organize-settings';
import { EditQrTips } from './edit-qr-tips';
import { getPixelConfig } from '@/lib/pixel-analytics';
import { normalizeLabels } from '@/lib/organize-utils';
import { useScanBaseUrl, buildScanLink } from '@/lib/use-scan-base-url';

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

function toLocalInput(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
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
  const [advanced, setAdvanced] = useState<AdvancedValues>(emptyAdvanced);
  const [landingEnabled, setLandingEnabled] = useState(false);
  const [landingPage, setLandingPage] = useState<LandingPageData>(emptyLandingPage);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleData, setScheduleData] = useState<ScheduleData>(emptyScheduleData);
  const [geofenceEnabled, setGeofenceEnabled] = useState(false);
  const [geofenceData, setGeofenceData] = useState<GeofenceData>(emptyGeofenceData);
  const [abTestEnabled, setAbTestEnabled] = useState(false);
  const [abTestData, setAbTestData] = useState<AbTestData>(emptyAbTestData);
  const [gpsHeatmapEnabled, setGpsHeatmapEnabled] = useState(false);
  const [nfcEnabled, setNfcEnabled] = useState(false);
  const [scanNotify, setScanNotify] = useState<ScanNotifyValues>(emptyScanNotify);
  const [hasExistingPassword, setHasExistingPassword] = useState(false);
  const [removePassword, setRemovePassword] = useState(false);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [pixels, setPixels] = useState<PixelAnalyticsConfig>(emptyPixelAnalytics);
  const scanBaseUrl = useScanBaseUrl();

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
        setAdvanced({
          password: '',
          expiresAt: toLocalInput(qrCode?.expiresAt),
          scanLimit: qrCode?.scanLimit != null ? String(qrCode.scanLimit) : '',
          iosUrl: qrCode?.iosUrl ?? '',
          androidUrl: qrCode?.androidUrl ?? '',
          utmEnabled: Boolean(qrCode?.utmEnabled),
          utmSource: qrCode?.utmSource ?? 'qrbanner',
          utmMedium: qrCode?.utmMedium ?? 'qr',
          utmCampaign: qrCode?.utmCampaign ?? '',
        });
        setLandingEnabled(Boolean(qrCode?.landingPageEnabled));
        setLandingPage({
          ...emptyLandingPage,
          ...(qrCode?.landingPageData && typeof qrCode.landingPageData === 'object'
            ? qrCode.landingPageData
            : {}),
        });
        setScheduleEnabled(Boolean(qrCode?.scheduleEnabled));
        setScheduleData({
          ...emptyScheduleData,
          ...(qrCode?.scheduleData && typeof qrCode.scheduleData === 'object'
            ? qrCode.scheduleData
            : {}),
        });
        setGeofenceEnabled(Boolean(qrCode?.geofenceEnabled));
        setGeofenceData({
          ...emptyGeofenceData,
          ...(qrCode?.geofenceData && typeof qrCode.geofenceData === 'object'
            ? qrCode.geofenceData
            : {}),
        });
        setAbTestEnabled(Boolean(qrCode?.abTestEnabled));
        setAbTestData(parseAbTestData(qrCode?.abTestData));
        setGpsHeatmapEnabled(Boolean(qrCode?.gpsHeatmapEnabled));
        setNfcEnabled(Boolean(qrCode?.nfcEnabled));
        setScanNotify({
          enabled: Boolean(qrCode?.scanNotifyEnabled),
          firstScan: qrCode?.scanNotifyFirst !== false,
          milestones: qrCode?.scanNotifyMilestones !== false,
          everyScan: Boolean(qrCode?.scanNotifyEvery),
        });
        if (qrCode?.style && typeof qrCode.style === 'object') {
          resetStyleHistory(normalizeQRStyle(qrCode.style as Partial<QRStyleConfig>));
        }
        setFolderId(qrCode?.folderId ?? null);
        setLabels(normalizeLabels(qrCode?.labels ?? []));
        setPixels(getPixelConfig(qrCode ?? {}));
        setStoredLogoPath(qrCode?.logoPath ?? null);
        if (qrCode?.logoPath) setLogoPreview(qrCode.logoPath);
      }
    } catch (e: any) {
      console.error('Failed to fetch QR code:', e);
    } finally {
      setLoading(false);
    }
  }, [qrId]);

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
          name, qrData: stripMetaFields(qrData), style, isActive, logoPath, logoIsPublic: true,
          password: advanced.password ? advanced.password : (removePassword ? '' : undefined),
          expiresAt: advanced.expiresAt || null,
          scanLimit: advanced.scanLimit !== '' ? advanced.scanLimit : null,
          iosUrl: advanced.iosUrl,
          androidUrl: advanced.androidUrl,
          utmEnabled: advanced.utmEnabled,
          utmSource: advanced.utmSource,
          utmMedium: advanced.utmMedium,
          utmCampaign: advanced.utmCampaign || name,
          landingPageEnabled: landingEnabled,
          landingPageData: landingEnabled ? landingPage : null,
          scheduleEnabled: scheduleEnabled,
          scheduleData: scheduleEnabled ? scheduleData : null,
          geofenceEnabled: geofenceEnabled,
          geofenceData: geofenceEnabled ? geofenceData : null,
          abTestEnabled,
          abTestData: abTestEnabled ? abTestData : null,
          gpsHeatmapEnabled,
          nfcEnabled,
          scanNotifyEnabled: scanNotify.enabled,
          scanNotifyFirst: scanNotify.firstScan,
          scanNotifyMilestones: scanNotify.milestones,
          scanNotifyEvery: scanNotify.everyScan,
          folderId,
          labels,
          ga4Enabled: pixels.ga4Enabled,
          ga4MeasurementId: pixels.ga4MeasurementId,
          metaPixelId: pixels.metaPixelId,
          metaPixelEnabled: pixels.metaPixelEnabled,
        }),
      });

      if (res.ok) {
        toast.success(t('editQr.updated'));
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon-sm"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">{t('editQr.title')}</h1>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{categoryDisplayName(qr?.category ?? 'url')}</Badge>
              <Badge variant={isActive ? 'default' : 'secondary'}>{isActive ? t('editQr.active') : t('editQr.inactive')}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/qr/${qrId}/analytics`}>
            <Button variant="outline" size="sm" className="gap-2">
              <BarChart3 className="h-4 w-4" /> {t('editQr.analytics')}
            </Button>
          </Link>
          <Button onClick={handleSave} loading={saving} size="sm" className="gap-2">
            <Save className="h-4 w-4" /> {t('common.save')}
          </Button>
        </div>
      </div>

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
                  <p className="text-xs text-muted-foreground">Disabled QR codes will show an error page.</p>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-base">QR Content</CardTitle>
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
                <p className="text-xs text-muted-foreground">Turn off the password requirement for this QR code.</p>
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
