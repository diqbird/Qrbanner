import type { QRStyleConfig } from '@/lib/qr-style';
import type { AdvancedValues } from '@/components/qr/advanced-settings';
import type { LandingPageData } from '@/components/qr/landing-page-editor';
import type { ScheduleData } from '@/components/qr/schedule-settings';
import type { GeofenceData } from '@/components/qr/geofence-settings';
import type { LanguageRedirectData } from '@/lib/language-redirect';
import type { AbTestData } from '@/lib/ab-routing';
import type { ScanNotifyValues } from '@/components/qr/scan-notify-settings';
import type { PixelAnalyticsConfig } from '@/components/qr/analytics-pixel-settings';

export const QR_CREATE_DRAFT_KEY = 'qrb_create_draft';
/** Set when a guest is sent to signup from the final save CTA — triggers auto-save after restore. */
export const QR_CREATE_AUTOSAVE_KEY = 'qrb_create_autosave';

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
  languageRedirectEnabled: boolean;
  languageRedirectData: LanguageRedirectData;
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

export function markQrCreateAutosave(): void {
  try {
    sessionStorage.setItem(QR_CREATE_AUTOSAVE_KEY, '1');
  } catch {}
}

export function consumeQrCreateAutosave(): boolean {
  try {
    const v = sessionStorage.getItem(QR_CREATE_AUTOSAVE_KEY);
    if (v !== '1') return false;
    sessionStorage.removeItem(QR_CREATE_AUTOSAVE_KEY);
    return true;
  } catch {
    return false;
  }
}
