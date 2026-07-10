import type { QRStyleConfig } from '@/lib/qr-style';
import { AdvancedValues } from '@/components/qr/advanced-settings';
import type { LandingPageData } from '@/lib/landing-page';
import type { ScheduleData } from '@/components/qr/schedule-settings';
import type { GeofenceData } from '@/components/qr/geofence-settings';
import type { LanguageRedirectData } from '@/lib/language-redirect';
import type { AbTestData } from '@/lib/ab-routing';
import type { ScanNotifyValues } from '@/components/qr/scan-notify-settings';
import type { PixelAnalyticsConfig } from '@/components/qr/analytics-pixel-settings';

export type { QrEditRecord } from '@/lib/qr-edit-form-types';

export function editFormSnapshot(input: {
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
  return JSON.stringify(input);
}

export type QrEditFormSnapshotInput = Parameters<typeof editFormSnapshot>[0];
