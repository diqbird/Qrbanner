import type { QRStyleConfig } from '@/lib/qr-style';
import type { AdvancedValues } from '@/components/qr/advanced-settings';
import type { LandingPageData } from '@/components/qr/landing-page-editor';
import type { ScheduleData } from '@/components/qr/schedule-settings';
import type { GeofenceData } from '@/components/qr/geofence-settings';
import type { AbTestData } from '@/lib/ab-routing';
import type { ScanNotifyValues } from '@/components/qr/scan-notify-settings';
import type { PixelAnalyticsConfig } from '@/components/qr/analytics-pixel-settings';

export const QR_CREATE_DRAFT_KEY = 'qrb_create_draft';

export interface QrCreateDraft {
  version: 1;
  savedAt: string;
  step: number;
  category: string;
  name: string;
  qrData: Record<string, string>;
  style: QRStyleConfig;
  logoPreview: string | null;
  templateId: string | null;
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
}

export function saveQrCreateDraft(draft: QrCreateDraft): void {
  try {
    sessionStorage.setItem(QR_CREATE_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* quota or private mode */
  }
}

export function loadQrCreateDraft(): QrCreateDraft | null {
  try {
    const raw = sessionStorage.getItem(QR_CREATE_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as QrCreateDraft;
    if (parsed?.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearQrCreateDraft(): void {
  try {
    sessionStorage.removeItem(QR_CREATE_DRAFT_KEY);
  } catch {}
}
