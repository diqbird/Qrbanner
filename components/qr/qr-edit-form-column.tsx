'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { normalizeQRStyle } from '@/components/qr/qr-style-editor';
import { CategoryFields } from '@/components/qr/category-fields';
import { LinkHubEditor, firstHubUrl } from '@/components/qr/link-hub-editor';
import { isDynamicCategory } from '@/lib/qr-utils';
import { AdvancedSettings } from '@/components/qr/advanced-settings';
import { LandingPageEditor } from '@/components/qr/landing-page-editor';
import { ScheduleSettings } from '@/components/qr/schedule-settings';
import { GeofenceSettings } from '@/components/qr/geofence-settings';
import { AbTestSettings } from '@/components/qr/ab-test-settings';
import { GpsHeatmapSettings } from '@/components/qr/gps-heatmap';
import { NfcExportPanel } from '@/components/qr/nfc-export-panel';
import { ScanNotifySettings } from '@/components/qr/scan-notify-settings';
import { AnalyticsPixelSettings } from '@/components/qr/analytics-pixel-settings';
import { QROrganizeSettings } from '@/components/qr/qr-organize-settings';
import { AiDesignAssistant } from '@/components/qr/ai-design-assistant';
import { StyleHistoryToolbar } from '@/components/qr/style-history-toolbar';
import { QRStyleEditor } from '@/components/qr/qr-style-editor';
import { buildScanLink } from '@/lib/use-scan-base-url';
import type { useQrEditForm } from '@/hooks/use-qr-edit-form';

type QrEditFormState = ReturnType<typeof useQrEditForm>;

type QrEditFormColumnProps = {
  form: QrEditFormState;
};

export function QrEditFormColumn({ form }: QrEditFormColumnProps) {
  const { t } = useLanguage();
  const {
    qr,
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
    handleLogoChange,
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
    applyTemplateLogo,
  } = form;

  if (!qr) return null;

  const category = qr.category ?? 'url';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">{t('editQr.details')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t('common.name')}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t('editQr.shortLink')}</Label>
            <div className="flex items-center gap-2">
              <Input value={`/s/${qr.shortCode}`} disabled className="font-mono text-xs" />
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => {
                  navigator.clipboard?.writeText?.(buildScanLink(qr.shortCode, scanBaseUrl));
                  toast.success(t('editQr.linkCopied'));
                }}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => window.open(`/s/${qr.shortCode}`, '_blank')}
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
          {category === 'link_hub' ? (
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
            <CategoryFields category={category} data={qrData} onChange={setQrData} />
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
        category={category}
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
        onTemplateLogoApply={applyTemplateLogo}
      />

      <AdvancedSettings
        category={category}
        values={advanced}
        onChange={setAdvanced}
        hasExistingPassword={hasExistingPassword}
      />

      {isDynamicCategory(category) && (
        <>
          <LandingPageEditor
            enabled={landingEnabled}
            onEnabledChange={setLandingEnabled}
            data={landingPage}
            onChange={setLandingPage}
            qrName={name}
            category={category}
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

      {qr.shortCode && (
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
  );
}
