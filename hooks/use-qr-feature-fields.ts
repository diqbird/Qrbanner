'use client';

import { useCallback, useState } from 'react';
import { AdvancedValues, emptyAdvanced } from '@/components/qr/advanced-settings';
import { emptyLandingPage, type LandingPageData } from '@/components/qr/landing-page-editor';
import { emptyScheduleData, type ScheduleData } from '@/components/qr/schedule-settings';
import { emptyGeofenceData, type GeofenceData } from '@/components/qr/geofence-settings';
import { emptyAbTestData } from '@/components/qr/ab-test-settings';
import { parseAbTestData, type AbTestData } from '@/lib/ab-routing';
import { emptyScanNotify, type ScanNotifyValues } from '@/components/qr/scan-notify-settings';
import {
  emptyPixelAnalytics,
  type PixelAnalyticsConfig,
} from '@/components/qr/analytics-pixel-settings';
import { getPixelConfig } from '@/lib/pixel-analytics';

export type QrFeatureRecord = {
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
  hasPassword?: boolean;
};

function toLocalInput(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
}

/** Shared advanced + feature toggles used by create wizard and edit view. */
export function useQrFeatureFields() {
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
  const [pixels, setPixels] = useState<PixelAnalyticsConfig>(emptyPixelAnalytics);

  const resetFeatureFields = useCallback(() => {
    setAdvanced(emptyAdvanced);
    setLandingEnabled(false);
    setLandingPage(emptyLandingPage);
    setScheduleEnabled(false);
    setScheduleData(emptyScheduleData);
    setGeofenceEnabled(false);
    setGeofenceData(emptyGeofenceData);
    setAbTestEnabled(false);
    setAbTestData(emptyAbTestData);
    setGpsHeatmapEnabled(false);
    setNfcEnabled(false);
    setScanNotify(emptyScanNotify);
    setPixels(emptyPixelAnalytics);
  }, []);

  const applyFeatureFieldsFromRecord = useCallback((record: QrFeatureRecord) => {
    setAdvanced({
      password: '',
      expiresAt: toLocalInput(record.expiresAt),
      scanLimit: record.scanLimit != null ? String(record.scanLimit) : '',
      iosUrl: record.iosUrl ?? '',
      androidUrl: record.androidUrl ?? '',
      utmEnabled: Boolean(record.utmEnabled),
      utmSource: record.utmSource ?? 'qrbanner',
      utmMedium: record.utmMedium ?? 'qr',
      utmCampaign: record.utmCampaign ?? '',
    });
    setLandingEnabled(Boolean(record.landingPageEnabled));
    setLandingPage({
      ...emptyLandingPage,
      ...(record.landingPageData && typeof record.landingPageData === 'object'
        ? record.landingPageData
        : {}),
    });
    setScheduleEnabled(Boolean(record.scheduleEnabled));
    setScheduleData({
      ...emptyScheduleData,
      ...(record.scheduleData && typeof record.scheduleData === 'object'
        ? record.scheduleData
        : {}),
    });
    setGeofenceEnabled(Boolean(record.geofenceEnabled));
    setGeofenceData({
      ...emptyGeofenceData,
      ...(record.geofenceData && typeof record.geofenceData === 'object'
        ? record.geofenceData
        : {}),
    });
    setAbTestEnabled(Boolean(record.abTestEnabled));
    setAbTestData(parseAbTestData(record.abTestData));
    setGpsHeatmapEnabled(Boolean(record.gpsHeatmapEnabled));
    setNfcEnabled(Boolean(record.nfcEnabled));
    setScanNotify({
      enabled: Boolean(record.scanNotifyEnabled),
      firstScan: record.scanNotifyFirst !== false,
      milestones: record.scanNotifyMilestones !== false,
      everyScan: Boolean(record.scanNotifyEvery),
    });
    setPixels(getPixelConfig(record));
  }, []);

  return {
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
    resetFeatureFields,
    applyFeatureFieldsFromRecord,
  };
}

export type QrFeatureFields = ReturnType<typeof useQrFeatureFields>;

export type QrFeaturePayloadInput = {
  name: string;
  mode: 'create' | 'update';
  fields: Pick<
    QrFeatureFields,
    | 'advanced'
    | 'landingEnabled'
    | 'landingPage'
    | 'scheduleEnabled'
    | 'scheduleData'
    | 'geofenceEnabled'
    | 'geofenceData'
    | 'abTestEnabled'
    | 'abTestData'
    | 'gpsHeatmapEnabled'
    | 'nfcEnabled'
    | 'scanNotify'
    | 'pixels'
  >;
};

/** Build the shared advanced/feature slice of create/update API payloads. */
export function buildQrFeaturePayload({ name, mode, fields }: QrFeaturePayloadInput) {
  const {
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
    pixels,
  } = fields;

  const empty = mode === 'create' ? undefined : null;

  return {
    expiresAt: advanced.expiresAt || empty,
    scanLimit: advanced.scanLimit !== '' ? advanced.scanLimit : empty,
    iosUrl: advanced.iosUrl || (mode === 'create' ? undefined : advanced.iosUrl),
    androidUrl: advanced.androidUrl || (mode === 'create' ? undefined : advanced.androidUrl),
    utmEnabled: advanced.utmEnabled,
    utmSource: advanced.utmSource || (mode === 'create' ? undefined : advanced.utmSource),
    utmMedium: advanced.utmMedium || (mode === 'create' ? undefined : advanced.utmMedium),
    utmCampaign: advanced.utmCampaign || name || (mode === 'create' ? undefined : name),
    landingPageEnabled: landingEnabled,
    landingPageData: landingEnabled
      ? mode === 'create'
        ? { ...landingPage, title: landingPage.title || name }
        : landingPage
      : empty,
    scheduleEnabled: scheduleEnabled,
    scheduleData: scheduleEnabled ? scheduleData : empty,
    geofenceEnabled: geofenceEnabled,
    geofenceData: geofenceEnabled ? geofenceData : empty,
    abTestEnabled,
    abTestData: abTestEnabled ? abTestData : empty,
    gpsHeatmapEnabled,
    nfcEnabled,
    scanNotifyEnabled: scanNotify.enabled,
    scanNotifyFirst: scanNotify.firstScan,
    scanNotifyMilestones: scanNotify.milestones,
    scanNotifyEvery: scanNotify.everyScan,
    ga4Enabled: pixels.ga4Enabled,
    ga4MeasurementId: pixels.ga4MeasurementId,
    metaPixelEnabled: pixels.metaPixelEnabled,
    metaPixelId: pixels.metaPixelId,
  };
}
