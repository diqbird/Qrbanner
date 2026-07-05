import type { AdvancedValues } from '@/components/qr/advanced-settings';
import type { QRStyleConfig } from '@/lib/qr-style';
import type { QrCreateDraft } from '@/lib/qr-create-draft';
import type { IndustryTemplate } from '@/lib/industry-templates';
import type { LandingPageData } from '@/lib/landing-page';
import type { ScheduleData } from '@/components/qr/schedule-settings';
import type { GeofenceData } from '@/components/qr/geofence-settings';
import type { AbTestData } from '@/lib/ab-routing';
import type { ScanNotifyValues } from '@/components/qr/scan-notify-settings';
import type { PixelAnalyticsConfig } from '@/components/qr/analytics-pixel-settings';
import { getTemplateById } from '@/lib/industry-templates';
import { normalizeQRStyle } from '@/components/qr/qr-style-editor';

export type QrCreateDraftState = {
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

export function buildQrCreateDraft(state: QrCreateDraftState): QrCreateDraft {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    step: state.step,
    category: state.category,
    name: state.name,
    qrData: state.qrData,
    style: state.style,
    logoPreview: state.logoPreview,
    templateId: state.activeTemplate?.id ?? null,
    advanced: state.advanced,
    landingEnabled: state.landingEnabled,
    landingPage: state.landingPage,
    scheduleEnabled: state.scheduleEnabled,
    scheduleData: state.scheduleData,
    geofenceEnabled: state.geofenceEnabled,
    geofenceData: state.geofenceData,
    abTestEnabled: state.abTestEnabled,
    abTestData: state.abTestData,
    gpsHeatmapEnabled: state.gpsHeatmapEnabled,
    nfcEnabled: state.nfcEnabled,
    scanNotify: state.scanNotify,
    pixels: state.pixels,
  };
}

export type QrCreateDraftSetters = {
  setStep: (step: number) => void;
  setCategory: (category: string) => void;
  setName: (name: string) => void;
  setQrData: (data: Record<string, string>) => void;
  resetStyleHistory: (style: QRStyleConfig) => void;
  setLogoPreview: (preview: string | null) => void;
  setActiveTemplate: (template: IndustryTemplate | null) => void;
  setAdvanced: (advanced: AdvancedValues) => void;
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
  setPixels: (pixels: PixelAnalyticsConfig) => void;
};

export function applyQrCreateDraft(draft: QrCreateDraft, setters: QrCreateDraftSetters) {
  setters.setStep(draft.step);
  setters.setCategory(draft.category);
  setters.setName(draft.name);
  setters.setQrData(draft.qrData);
  setters.resetStyleHistory(normalizeQRStyle(draft.style));
  setters.setLogoPreview(draft.logoPreview);
  setters.setAdvanced(draft.advanced);
  setters.setLandingEnabled(draft.landingEnabled);
  setters.setLandingPage(draft.landingPage);
  setters.setScheduleEnabled(draft.scheduleEnabled);
  setters.setScheduleData(draft.scheduleData);
  setters.setGeofenceEnabled(draft.geofenceEnabled);
  setters.setGeofenceData(draft.geofenceData);
  setters.setAbTestEnabled(draft.abTestEnabled);
  setters.setAbTestData(draft.abTestData);
  setters.setGpsHeatmapEnabled(draft.gpsHeatmapEnabled);
  setters.setNfcEnabled(draft.nfcEnabled);
  setters.setScanNotify(draft.scanNotify);
  setters.setPixels(draft.pixels);
  if (draft.templateId) {
    const tmpl = getTemplateById(draft.templateId);
    if (tmpl) setters.setActiveTemplate(tmpl);
  }
}
