'use client';

import { useCallback } from 'react';
import type { AdvancedValues } from '@/components/qr/advanced-settings';
import type { LandingPageData } from '@/components/qr/landing-page-editor';
import type { ScheduleData } from '@/components/qr/schedule-settings';
import type { GeofenceData } from '@/components/qr/geofence-settings';
import type { LanguageRedirectData } from '@/lib/language-redirect';
import type { AbTestData } from '@/lib/ab-routing';
import type { ScanNotifyValues } from '@/components/qr/scan-notify-settings';
import type { PixelAnalyticsConfig } from '@/components/qr/analytics-pixel-settings';
import type { QrFeatureRecord } from '@/lib/qr-feature-fields-types';
import {
  emptyQrFeatureFieldState,
  qrFeatureFieldStateFromRecord,
} from '@/lib/qr-feature-fields-utils';

type FeatureFieldSetters = {
  setAdvanced: (values: AdvancedValues) => void;
  setLandingEnabled: (enabled: boolean) => void;
  setLandingPage: (page: LandingPageData) => void;
  setScheduleEnabled: (enabled: boolean) => void;
  setScheduleData: (data: ScheduleData) => void;
  setGeofenceEnabled: (enabled: boolean) => void;
  setGeofenceData: (data: GeofenceData) => void;
  setLanguageRedirectEnabled: (enabled: boolean) => void;
  setLanguageRedirectData: (data: LanguageRedirectData) => void;
  setAbTestEnabled: (enabled: boolean) => void;
  setAbTestData: (data: AbTestData) => void;
  setGpsHeatmapEnabled: (enabled: boolean) => void;
  setNfcEnabled: (enabled: boolean) => void;
  setScanNotify: (values: ScanNotifyValues) => void;
  setPixels: (config: PixelAnalyticsConfig) => void;
};

function applyFeatureFieldState(setters: FeatureFieldSetters, state: ReturnType<typeof emptyQrFeatureFieldState>) {
  setters.setAdvanced(state.advanced);
  setters.setLandingEnabled(state.landingEnabled);
  setters.setLandingPage(state.landingPage);
  setters.setScheduleEnabled(state.scheduleEnabled);
  setters.setScheduleData(state.scheduleData);
  setters.setGeofenceEnabled(state.geofenceEnabled);
  setters.setGeofenceData(state.geofenceData);
  setters.setLanguageRedirectEnabled(state.languageRedirectEnabled);
  setters.setLanguageRedirectData(state.languageRedirectData);
  setters.setAbTestEnabled(state.abTestEnabled);
  setters.setAbTestData(state.abTestData);
  setters.setGpsHeatmapEnabled(state.gpsHeatmapEnabled);
  setters.setNfcEnabled(state.nfcEnabled);
  setters.setScanNotify(state.scanNotify);
  setters.setPixels(state.pixels);
}

export function useQrFeatureFieldsSync(setters: FeatureFieldSetters) {
  const resetFeatureFields = useCallback(() => {
    applyFeatureFieldState(setters, emptyQrFeatureFieldState());
  }, [setters]);

  const applyFeatureFieldsFromRecord = useCallback(
    (record: QrFeatureRecord) => {
      applyFeatureFieldState(setters, qrFeatureFieldStateFromRecord(record));
    },
    [setters],
  );

  return { resetFeatureFields, applyFeatureFieldsFromRecord };
}
