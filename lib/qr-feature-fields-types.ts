import type { AdvancedValues } from '@/components/qr/advanced-settings';
import type { LandingPageData } from '@/components/qr/landing-page-editor';
import type { ScheduleData } from '@/components/qr/schedule-settings';
import type { GeofenceData } from '@/components/qr/geofence-settings';
import type { LanguageRedirectData } from '@/lib/language-redirect';
import type { AbTestData } from '@/lib/ab-routing';
import type { ScanNotifyValues } from '@/components/qr/scan-notify-settings';
import type { PixelAnalyticsConfig } from '@/components/qr/analytics-pixel-settings';

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
  languageRedirectEnabled?: boolean;
  languageRedirectData?: LanguageRedirectData | null;
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

export type QrFeatureFieldState = {
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
  pixels: PixelAnalyticsConfig;
};

export type QrFeaturePayloadInput = {
  name: string;
  mode: 'create' | 'update';
  fields: QrFeatureFieldState;
};
