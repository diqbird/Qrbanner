'use client';

import { useQrEditCoreState } from '@/hooks/use-qr-edit-core-state';
import { useQrEditHydrateSetters } from '@/hooks/use-qr-edit-hydrate-setters';

export function useQrEditFormCore() {
  const core = useQrEditCoreState();
  const { featureFields, ...coreRest } = core;

  const featureSlice = {
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
    applyFeatureFieldsFromRecord: featureFields.applyFeatureFieldsFromRecord,
  };

  const hydrateSetters = useQrEditHydrateSetters({
    setName: coreRest.setName,
    setTargetUrl: coreRest.setTargetUrl,
    setQrData: coreRest.setQrData,
    setIsActive: coreRest.setIsActive,
    setHasExistingPassword: coreRest.setHasExistingPassword,
    applyFeatureFieldsFromRecord: featureSlice.applyFeatureFieldsFromRecord,
    resetStyleHistory: core.resetHistory,
    setFolderId: coreRest.setFolderId,
    setLabels: coreRest.setLabels,
    setStoredLogoPath: coreRest.setStoredLogoPath,
    setLogoPreview: core.setLogoPreview,
  });

  return { core, coreRest, featureFields, featureSlice, hydrateSetters };
}
