import { emptyAdvanced, type AdvancedValues } from '@/components/qr/advanced-settings';
import { emptyLandingPage, type LandingPageData } from '@/components/qr/landing-page-editor';
import { emptyScheduleData, type ScheduleData } from '@/components/qr/schedule-settings';
import { emptyGeofenceData, type GeofenceData } from '@/components/qr/geofence-settings';
import { emptyLanguageRedirectData, type LanguageRedirectData } from '@/lib/language-redirect';
import { emptyAbTestData, parseAbTestData } from '@/lib/ab-routing';
import { emptyScanNotify, type ScanNotifyValues } from '@/components/qr/scan-notify-settings';
import { emptyPixelAnalytics } from '@/components/qr/analytics-pixel-settings';
import { getPixelConfig } from '@/lib/pixel-analytics';
import type { QrFeaturePayloadInput, QrFeatureRecord } from '@/lib/qr-feature-fields-types';

export function toLocalInput(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
}

export function emptyQrFeatureFieldState() {
  return {
    advanced: emptyAdvanced,
    landingEnabled: false,
    landingPage: emptyLandingPage,
    scheduleEnabled: false,
    scheduleData: emptyScheduleData,
    geofenceEnabled: false,
    geofenceData: emptyGeofenceData,
    languageRedirectEnabled: false,
    languageRedirectData: emptyLanguageRedirectData,
    abTestEnabled: false,
    abTestData: emptyAbTestData,
    gpsHeatmapEnabled: false,
    nfcEnabled: false,
    scanNotify: emptyScanNotify,
    pixels: emptyPixelAnalytics,
  };
}

export function qrFeatureFieldStateFromRecord(record: QrFeatureRecord) {
  return {
    advanced: {
      password: '',
      expiresAt: toLocalInput(record.expiresAt),
      scanLimit: record.scanLimit != null ? String(record.scanLimit) : '',
      iosUrl: record.iosUrl ?? '',
      androidUrl: record.androidUrl ?? '',
      utmEnabled: Boolean(record.utmEnabled),
      utmSource: record.utmSource ?? 'qrbanner',
      utmMedium: record.utmMedium ?? 'qr',
      utmCampaign: record.utmCampaign ?? '',
    } satisfies AdvancedValues,
    landingEnabled: Boolean(record.landingPageEnabled),
    landingPage: {
      ...emptyLandingPage,
      ...(record.landingPageData && typeof record.landingPageData === 'object'
        ? record.landingPageData
        : {}),
    } satisfies LandingPageData,
    scheduleEnabled: Boolean(record.scheduleEnabled),
    scheduleData: {
      ...emptyScheduleData,
      ...(record.scheduleData && typeof record.scheduleData === 'object' ? record.scheduleData : {}),
    } satisfies ScheduleData,
    geofenceEnabled: Boolean(record.geofenceEnabled),
    geofenceData: {
      ...emptyGeofenceData,
      ...(record.geofenceData && typeof record.geofenceData === 'object' ? record.geofenceData : {}),
    } satisfies GeofenceData,
    languageRedirectEnabled: Boolean(record.languageRedirectEnabled),
    languageRedirectData: {
      ...emptyLanguageRedirectData,
      ...(record.languageRedirectData && typeof record.languageRedirectData === 'object'
        ? record.languageRedirectData
        : {}),
    } satisfies LanguageRedirectData,
    abTestEnabled: Boolean(record.abTestEnabled),
    abTestData: parseAbTestData(record.abTestData),
    gpsHeatmapEnabled: Boolean(record.gpsHeatmapEnabled),
    nfcEnabled: Boolean(record.nfcEnabled),
    scanNotify: {
      enabled: Boolean(record.scanNotifyEnabled),
      firstScan: record.scanNotifyFirst !== false,
      milestones: record.scanNotifyMilestones !== false,
      everyScan: Boolean(record.scanNotifyEvery),
    } satisfies ScanNotifyValues,
    pixels: getPixelConfig(record),
  };
}

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
    languageRedirectEnabled,
    languageRedirectData,
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
    languageRedirectEnabled: languageRedirectEnabled,
    languageRedirectData: languageRedirectEnabled ? languageRedirectData : empty,
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
