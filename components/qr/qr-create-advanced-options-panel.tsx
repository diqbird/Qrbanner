'use client';

import { ChevronDown } from 'lucide-react';
import { AdvancedSettings } from './advanced-settings';
import { LandingPageEditor } from './landing-page-editor';
import { ScheduleSettings } from './schedule-settings';
import { GeofenceSettings } from './geofence-settings';
import { AbTestSettings } from './ab-test-settings';
import { GpsHeatmapSettings } from './gps-heatmap';
import { ScanNotifySettings } from './scan-notify-settings';
import { AnalyticsPixelSettings } from './analytics-pixel-settings';
import { useLanguage } from '@/components/i18n/language-provider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { isDynamicCategory } from '@/lib/qr-utils';
import type { QrCreateStepDesignProps } from '@/lib/qr-create-step-design-types';

export function QrCreateAdvancedOptionsPanel(props: QrCreateStepDesignProps) {
  const { t } = useLanguage();
  const {
    category,
    name,
    qrData,
    advanced,
    landingPage,
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
  } = props;

  return (
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
        <AdvancedSettings category={category} values={advanced} onChange={onAdvancedChange} />
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
  );
}
