import type { QrFeatureFields } from '@/hooks/use-qr-feature-fields';

export function extractQrCreateFeatureSlice(featureFields: QrFeatureFields) {
  return {
    advanced: featureFields.advanced,
    setAdvanced: featureFields.setAdvanced,
    landingEnabled: featureFields.landingEnabled,
    setLandingEnabled: featureFields.setLandingEnabled,
    landingPage: featureFields.landingPage,
    setLandingPage: featureFields.setLandingPage,
    scheduleEnabled: featureFields.scheduleEnabled,
    setScheduleEnabled: featureFields.setScheduleEnabled,
    scheduleData: featureFields.scheduleData,
    setScheduleData: featureFields.setScheduleData,
    geofenceEnabled: featureFields.geofenceEnabled,
    setGeofenceEnabled: featureFields.setGeofenceEnabled,
    geofenceData: featureFields.geofenceData,
    setGeofenceData: featureFields.setGeofenceData,
    languageRedirectEnabled: featureFields.languageRedirectEnabled,
    setLanguageRedirectEnabled: featureFields.setLanguageRedirectEnabled,
    languageRedirectData: featureFields.languageRedirectData,
    setLanguageRedirectData: featureFields.setLanguageRedirectData,
    abTestEnabled: featureFields.abTestEnabled,
    setAbTestEnabled: featureFields.setAbTestEnabled,
    abTestData: featureFields.abTestData,
    setAbTestData: featureFields.setAbTestData,
    gpsHeatmapEnabled: featureFields.gpsHeatmapEnabled,
    setGpsHeatmapEnabled: featureFields.setGpsHeatmapEnabled,
    nfcEnabled: featureFields.nfcEnabled,
    setNfcEnabled: featureFields.setNfcEnabled,
    scanNotify: featureFields.scanNotify,
    setScanNotify: featureFields.setScanNotify,
    pixels: featureFields.pixels,
    setPixels: featureFields.setPixels,
  };
}

export type QrCreateFeatureSlice = ReturnType<typeof extractQrCreateFeatureSlice>;
