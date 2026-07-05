'use client';

import { useMemo, useState } from 'react';
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
import { useQrFeatureFieldsSync } from '@/hooks/use-qr-feature-fields-sync';

export function useQrFeatureFieldsState() {
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

  const setters = useMemo(
    () => ({
      setAdvanced,
      setLandingEnabled,
      setLandingPage,
      setScheduleEnabled,
      setScheduleData,
      setGeofenceEnabled,
      setGeofenceData,
      setAbTestEnabled,
      setAbTestData,
      setGpsHeatmapEnabled,
      setNfcEnabled,
      setScanNotify,
      setPixels,
    }),
    [],
  );

  const { resetFeatureFields, applyFeatureFieldsFromRecord } = useQrFeatureFieldsSync(setters);

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
