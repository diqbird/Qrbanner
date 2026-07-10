'use client';

import { useMemo } from 'react';
import type { AdvancedValues } from '@/components/qr/advanced-settings';
import type { LandingPageData } from '@/components/qr/landing-page-editor';
import type { ScheduleData } from '@/components/qr/schedule-settings';
import type { GeofenceData } from '@/components/qr/geofence-settings';
import type { LanguageRedirectData } from '@/lib/language-redirect';
import type { AbTestData } from '@/lib/ab-routing';
import type { ScanNotifyValues } from '@/components/qr/scan-notify-settings';
import type { PixelAnalyticsConfig } from '@/components/qr/analytics-pixel-settings';
import type { QRStyleConfig } from '@/lib/qr-style';

export function useQrEditFormSnapshot(input: {
  name: string;
  qrData: Record<string, string>;
  style: QRStyleConfig;
  isActive: boolean;
  storedLogoPath: string | null;
  advanced: AdvancedValues;
  landingEnabled: boolean;
  landingPage: LandingPageData;
  scheduleEnabled: boolean;
  scheduleData: ScheduleData;
  geofenceEnabled: boolean;
  geofenceData: GeofenceData;
  languageRedirectEnabled: boolean;
  languageRedirectData: LanguageRedirectData;
  abTestEnabled: boolean;
  abTestData: AbTestData;
  gpsHeatmapEnabled: boolean;
  nfcEnabled: boolean;
  scanNotify: ScanNotifyValues;
  folderId: string | null;
  labels: string[];
  pixels: PixelAnalyticsConfig;
  removePassword: boolean;
}) {
  return useMemo(
    () => ({
      name: input.name,
      qrData: input.qrData,
      style: input.style,
      isActive: input.isActive,
      storedLogoPath: input.storedLogoPath,
      advanced: input.advanced,
      landingEnabled: input.landingEnabled,
      landingPage: input.landingPage,
      scheduleEnabled: input.scheduleEnabled,
      scheduleData: input.scheduleData,
      geofenceEnabled: input.geofenceEnabled,
      geofenceData: input.geofenceData,
      languageRedirectEnabled: input.languageRedirectEnabled,
      languageRedirectData: input.languageRedirectData,
      abTestEnabled: input.abTestEnabled,
      abTestData: input.abTestData,
      gpsHeatmapEnabled: input.gpsHeatmapEnabled,
      nfcEnabled: input.nfcEnabled,
      scanNotify: input.scanNotify,
      folderId: input.folderId,
      labels: input.labels,
      pixels: input.pixels,
      removePassword: input.removePassword,
    }),
    [
      input.name,
      input.qrData,
      input.style,
      input.isActive,
      input.storedLogoPath,
      input.advanced,
      input.landingEnabled,
      input.landingPage,
      input.scheduleEnabled,
      input.scheduleData,
      input.geofenceEnabled,
      input.geofenceData,
      input.languageRedirectEnabled,
      input.languageRedirectData,
      input.abTestEnabled,
      input.abTestData,
      input.gpsHeatmapEnabled,
      input.nfcEnabled,
      input.scanNotify,
      input.folderId,
      input.labels,
      input.pixels,
      input.removePassword,
    ],
  );
}
