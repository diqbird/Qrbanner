'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/components/i18n/language-provider';
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
import { buildScanLink } from '@/lib/use-scan-base-url';
import type { QrEditFormColumnProps } from '@/lib/qr-edit-form-column-types';

export function QrEditFeaturesSection({ form }: QrEditFormColumnProps) {
  const { t } = useLanguage();
  const {
    qr,
    name,
    targetUrl,
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
  } = form;

  if (!qr) return null;

  const category = qr.category ?? 'url';

  return (
    <>
      <QROrganizeSettings
        folderId={folderId}
        labels={labels}
        onFolderChange={setFolderId}
        onLabelsChange={setLabels}
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
    </>
  );
}
