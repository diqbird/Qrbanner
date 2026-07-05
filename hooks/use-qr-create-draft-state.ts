'use client';

import { useMemo } from 'react';
import type { QrCreateDraftSetters, QrCreateDraftValues } from '@/lib/qr-create-draft-state-types';

export function useQrCreateDraftState(values: QrCreateDraftValues, setters: QrCreateDraftSetters) {
  const draftState = useMemo(
    () => ({ ...values }),
    [
      values.step,
      values.category,
      values.name,
      values.qrData,
      values.style,
      values.logoPreview,
      values.activeTemplate,
      values.advanced,
      values.landingEnabled,
      values.landingPage,
      values.scheduleEnabled,
      values.scheduleData,
      values.geofenceEnabled,
      values.geofenceData,
      values.abTestEnabled,
      values.abTestData,
      values.gpsHeatmapEnabled,
      values.nfcEnabled,
      values.scanNotify,
      values.pixels,
    ],
  );

  const draftSetters = useMemo(
    () => ({ ...setters }),
    [
      setters.setStep,
      setters.setCategory,
      setters.setName,
      setters.setQrData,
      setters.resetStyleHistory,
      setters.setLogoPreview,
      setters.setActiveTemplate,
      setters.setAdvanced,
      setters.setLandingEnabled,
      setters.setLandingPage,
      setters.setScheduleEnabled,
      setters.setScheduleData,
      setters.setGeofenceEnabled,
      setters.setGeofenceData,
      setters.setAbTestEnabled,
      setters.setAbTestData,
      setters.setGpsHeatmapEnabled,
      setters.setNfcEnabled,
      setters.setScanNotify,
      setters.setPixels,
    ],
  );

  return { draftState, draftSetters };
}
