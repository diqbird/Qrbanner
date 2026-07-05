'use client';

import { ChevronDown } from 'lucide-react';
import { QRStyleEditor } from './qr-style-editor';
import { AiDesignAssistant } from './ai-design-assistant';
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
import { normalizeQRStyle } from '@/lib/qr-style';
import { StyleHistoryToolbar } from './style-history-toolbar';
import { isDynamicCategory } from '@/lib/qr-utils';
import type { QrCreateStepDesignProps } from '@/lib/qr-create-step-design-types';

export function QrCreateDesignEditorPanel(props: QrCreateStepDesignProps) {
  const { t } = useLanguage();
  const {
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
    onStyleChange,
    canUndoStyle,
    canRedoStyle,
    onUndoStyle,
    onRedoStyle,
    onLogoChange,
    logoPath,
    onTemplateLogoApply,
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
    <div className="order-2 space-y-6 lg:order-1">
      <AiDesignAssistant
        category={category}
        qrName={name}
        style={style}
        onApplyStyle={(patch) => onStyleChange(normalizeQRStyle({ ...style, ...patch }))}
        onLogoSize={(size) => onStyleChange(normalizeQRStyle({ ...style, logoSize: size }))}
      />
      {(onUndoStyle || onRedoStyle) && (
        <StyleHistoryToolbar
          canUndo={!!canUndoStyle}
          canRedo={!!canRedoStyle}
          onUndo={onUndoStyle ?? (() => {})}
          onRedo={onRedoStyle ?? (() => {})}
        />
      )}
      <QRStyleEditor
        style={style}
        highlightVisualPresetId={activeTemplate?.visualPresetId}
        onStyleChange={(next) => onStyleChange(normalizeQRStyle(next))}
        onLogoChange={onLogoChange}
        logoPreview={logoPreview}
        logoPath={logoPath ?? null}
        onTemplateLogoApply={onTemplateLogoApply}
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
    </div>
  );
}
