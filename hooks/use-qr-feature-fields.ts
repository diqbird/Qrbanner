'use client';

import { useCallback, useState } from 'react';
import type { AdvancedValues } from '@/components/qr/advanced-settings';
import type { LandingPageData } from '@/components/qr/landing-page-editor';
import type { ScheduleData } from '@/components/qr/schedule-settings';
import type { GeofenceData } from '@/components/qr/geofence-settings';
import type { AbTestData } from '@/lib/ab-routing';
import type { ScanNotifyValues } from '@/components/qr/scan-notify-settings';
import type { PixelAnalyticsConfig } from '@/components/qr/analytics-pixel-settings';
import { emptyAdvanced } from '@/components/qr/advanced-settings';
import { emptyLandingPage } from '@/components/qr/landing-page-editor';
import { emptyScheduleData } from '@/components/qr/schedule-settings';
import { emptyGeofenceData } from '@/components/qr/geofence-settings';
import { emptyAbTestData } from '@/lib/ab-routing';
import { emptyScanNotify } from '@/components/qr/scan-notify-settings';
import { emptyPixelAnalytics } from '@/components/qr/analytics-pixel-settings';
import type { QrFeatureRecord } from '@/lib/qr-feature-fields-types';
import {
  emptyQrFeatureFieldState,
  qrFeatureFieldStateFromRecord,
} from '@/lib/qr-feature-fields-utils';

export type { QrFeatureRecord } from '@/lib/qr-feature-fields-types';
export { buildQrFeaturePayload } from '@/lib/qr-feature-fields-utils';
export type { QrFeaturePayloadInput } from '@/lib/qr-feature-fields-types';

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
    const empty = emptyQrFeatureFieldState();
    setAdvanced(empty.advanced);
    setLandingEnabled(empty.landingEnabled);
    setLandingPage(empty.landingPage);
    setScheduleEnabled(empty.scheduleEnabled);
    setScheduleData(empty.scheduleData);
    setGeofenceEnabled(empty.geofenceEnabled);
    setGeofenceData(empty.geofenceData);
    setAbTestEnabled(empty.abTestEnabled);
    setAbTestData(empty.abTestData);
    setGpsHeatmapEnabled(empty.gpsHeatmapEnabled);
    setNfcEnabled(empty.nfcEnabled);
    setScanNotify(empty.scanNotify);
    setPixels(empty.pixels);
  }, []);

  const applyFeatureFieldsFromRecord = useCallback((record: QrFeatureRecord) => {
    const next = qrFeatureFieldStateFromRecord(record);
    setAdvanced(next.advanced);
    setLandingEnabled(next.landingEnabled);
    setLandingPage(next.landingPage);
    setScheduleEnabled(next.scheduleEnabled);
    setScheduleData(next.scheduleData);
    setGeofenceEnabled(next.geofenceEnabled);
    setGeofenceData(next.geofenceData);
    setAbTestEnabled(next.abTestEnabled);
    setAbTestData(next.abTestData);
    setGpsHeatmapEnabled(next.gpsHeatmapEnabled);
    setNfcEnabled(next.nfcEnabled);
    setScanNotify(next.scanNotify);
    setPixels(next.pixels);
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
