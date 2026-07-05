'use client';

import { useMemo } from 'react';
import type { AdvancedValues } from '@/components/qr/advanced-settings';
import type { LandingPageData } from '@/components/qr/landing-page-editor';
import type { ScheduleData } from '@/components/qr/schedule-settings';
import type { GeofenceData } from '@/components/qr/geofence-settings';
import type { AbTestData } from '@/lib/ab-routing';
import type { ScanNotifyValues } from '@/components/qr/scan-notify-settings';
import type { PixelAnalyticsConfig } from '@/components/qr/analytics-pixel-settings';
import type { QRStyleConfig } from '@/lib/qr-style';
import type { IndustryTemplate } from '@/lib/industry-templates';

type QrCreateDraftValues = {
  step: number;
  category: string;
  name: string;
  qrData: Record<string, string>;
  style: QRStyleConfig;
  logoPreview: string | null;
  activeTemplate: IndustryTemplate | null;
  advanced: AdvancedValues;
  landingEnabled: boolean;
  landingPage: LandingPageData;
  scheduleEnabled: boolean;
  scheduleData: ScheduleData;
  geofenceEnabled: boolean;
  geofenceData: GeofenceData;
  abTestEnabled: boolean;
  abTestData: AbTestData;
  gpsHeatmapEnabled: boolean;
  nfcEnabled: boolean;
  scanNotify: ScanNotifyValues;
  pixels: PixelAnalyticsConfig;
};

type QrCreateDraftSetters = {
  setStep: (step: number | ((s: number) => number)) => void;
  setCategory: (category: string) => void;
  setName: (name: string) => void;
  setQrData: (data: Record<string, string>) => void;
  resetStyleHistory: (style: QRStyleConfig) => void;
  setLogoPreview: (preview: string | null) => void;
  setActiveTemplate: (template: IndustryTemplate | null) => void;
  setAdvanced: (values: AdvancedValues) => void;
  setLandingEnabled: (enabled: boolean) => void;
  setLandingPage: (page: LandingPageData) => void;
  setScheduleEnabled: (enabled: boolean) => void;
  setScheduleData: (data: ScheduleData) => void;
  setGeofenceEnabled: (enabled: boolean) => void;
  setGeofenceData: (data: GeofenceData) => void;
  setAbTestEnabled: (enabled: boolean) => void;
  setAbTestData: (data: AbTestData) => void;
  setGpsHeatmapEnabled: (enabled: boolean) => void;
  setNfcEnabled: (enabled: boolean) => void;
  setScanNotify: (values: ScanNotifyValues) => void;
  setPixels: (config: PixelAnalyticsConfig) => void;
};

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
