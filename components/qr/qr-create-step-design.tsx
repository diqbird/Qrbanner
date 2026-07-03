'use client';

import { ChevronDown } from 'lucide-react';
import { QRPreview } from './qr-preview';
import { QRStyleEditor } from './qr-style-editor';
import { AiDesignAssistant } from './ai-design-assistant';
import { ScannabilityPanel } from './scannability-panel';
import { AdvancedSettings, type AdvancedValues } from './advanced-settings';
import { LandingPageEditor, type LandingPageData } from './landing-page-editor';
import { ScheduleSettings, type ScheduleData } from './schedule-settings';
import { GeofenceSettings, type GeofenceData } from './geofence-settings';
import { AbTestSettings } from './ab-test-settings';
import type { AbTestData } from '@/lib/ab-routing';
import { GpsHeatmapSettings } from './gps-heatmap';
import { ScanNotifySettings, type ScanNotifyValues } from './scan-notify-settings';
import {
  AnalyticsPixelSettings,
  type PixelAnalyticsConfig,
} from './analytics-pixel-settings';
import { useLanguage } from '@/components/i18n/language-provider';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { normalizeQRStyle, type QRStyleConfig } from '@/lib/qr-style';
import { isDynamicCategory } from '@/lib/qr-utils';
import type { IndustryTemplate } from '@/lib/industry-templates';

export type QrCreateStepDesignProps = {
  category: string;
  name: string;
  qrData: Record<string, string>;
  style: QRStyleConfig;
  logoPreview: string | null;
  activeTemplate: IndustryTemplate | null;
  landingPage: LandingPageData;
  advanced: AdvancedValues;
  landingEnabled: boolean;
  scheduleEnabled: boolean;
  scheduleData: ScheduleData;
  geofenceEnabled: boolean;
  geofenceData: GeofenceData;
  abTestEnabled: boolean;
  abTestData: AbTestData;
  gpsHeatmapEnabled: boolean;
  scanNotify: ScanNotifyValues;
  pixels: PixelAnalyticsConfig;
  contentLength: number;
  onStyleChange: (style: QRStyleConfig) => void;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdvancedChange: (values: AdvancedValues) => void;
  onLandingEnabledChange: (enabled: boolean) => void;
  onLandingPageChange: (data: LandingPageData) => void;
  onScheduleEnabledChange: (enabled: boolean) => void;
  onScheduleDataChange: (data: ScheduleData) => void;
  onGeofenceEnabledChange: (enabled: boolean) => void;
  onGeofenceDataChange: (data: GeofenceData) => void;
  onAbTestEnabledChange: (enabled: boolean) => void;
  onAbTestDataChange: (data: AbTestData) => void;
  onGpsHeatmapEnabledChange: (enabled: boolean) => void;
  onScanNotifyChange: (values: ScanNotifyValues) => void;
  onPixelsChange: (values: PixelAnalyticsConfig) => void;
};

export function QrCreateStepDesign({
  category,
  name,
  qrData,
  style,
  logoPreview,
  activeTemplate,
  landingPage,
  advanced,
  landingEnabled,
  scheduleEnabled,
  scheduleData,
  geofenceEnabled,
  geofenceData,
  abTestEnabled,
  abTestData,
  gpsHeatmapEnabled,
  scanNotify,
  pixels,
  contentLength,
  onStyleChange,
  onLogoChange,
  onAdvancedChange,
  onLandingEnabledChange,
  onLandingPageChange,
  onScheduleEnabledChange,
  onScheduleDataChange,
  onGeofenceEnabledChange,
  onGeofenceDataChange,
  onAbTestEnabledChange,
  onAbTestDataChange,
  onGpsHeatmapEnabledChange,
  onScanNotifyChange,
  onPixelsChange,
}: QrCreateStepDesignProps) {
  const { t } = useLanguage();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="order-2 space-y-6 lg:order-1">
        <AiDesignAssistant
          category={category}
          qrName={name}
          style={style}
          onApplyStyle={(patch) => onStyleChange(normalizeQRStyle({ ...style, ...patch }))}
          onLogoSize={(size) => onStyleChange(normalizeQRStyle({ ...style, logoSize: size }))}
        />
        <QRStyleEditor
          style={style}
          highlightVisualPresetId={activeTemplate?.visualPresetId}
          onStyleChange={(next) => onStyleChange(normalizeQRStyle(next))}
          onLogoChange={onLogoChange}
          logoPreview={logoPreview}
        />
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-left text-sm font-medium hover:bg-muted/50 [&[data-state=open]>svg]:rotate-180">
            <span>
              {t('create.advancedOptions')}
              <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                {t('create.advancedOptionsDesc')}
              </span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-6">
            <AdvancedSettings
              category={category}
              values={advanced}
              onChange={onAdvancedChange}
            />
            {isDynamicCategory(category) && (
              <>
                <LandingPageEditor
                  enabled={landingEnabled}
                  onEnabledChange={onLandingEnabledChange}
                  data={landingPage}
                  onChange={onLandingPageChange}
                  qrName={name}
                  category={category}
                  targetUrl={typeof qrData.url === 'string' ? qrData.url : ''}
                />
                <ScheduleSettings
                  enabled={scheduleEnabled}
                  onEnabledChange={onScheduleEnabledChange}
                  data={scheduleData}
                  onChange={onScheduleDataChange}
                />
                <GeofenceSettings
                  enabled={geofenceEnabled}
                  onEnabledChange={onGeofenceEnabledChange}
                  data={geofenceData}
                  onChange={onGeofenceDataChange}
                />
                <AbTestSettings
                  enabled={abTestEnabled}
                  onEnabledChange={onAbTestEnabledChange}
                  data={abTestData}
                  onChange={onAbTestDataChange}
                  defaultUrl={qrData.url || ''}
                />
                <GpsHeatmapSettings
                  enabled={gpsHeatmapEnabled}
                  onEnabledChange={onGpsHeatmapEnabledChange}
                />
              </>
            )}
            <ScanNotifySettings values={scanNotify} onChange={onScanNotifyChange} />
            <AnalyticsPixelSettings values={pixels} onChange={onPixelsChange} />
          </CollapsibleContent>
        </Collapsible>
      </div>
      <div className="order-1 h-fit space-y-4 lg:order-2 lg:sticky lg:top-24">
        <QRPreview
          category={category}
          qrData={qrData}
          style={style}
          logoPreview={logoPreview}
          showScanTest
          printLayout={activeTemplate?.printLayout}
          industryTemplateId={activeTemplate?.id}
          accentColor={landingPage.accentColor}
          onStyleChange={(next) => onStyleChange(normalizeQRStyle(next))}
        />
        <ScannabilityPanel style={style} hasLogo={!!logoPreview} contentLength={contentLength} />
      </div>
    </div>
  );
}
