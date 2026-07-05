'use client';

import { LandingPageEditor } from './landing-page-editor';
import { ScheduleSettings } from './schedule-settings';
import { GeofenceSettings } from './geofence-settings';
import { AbTestSettings } from './ab-test-settings';
import { GpsHeatmapSettings } from './gps-heatmap';
import type { QrCreateStepDesignProps } from '@/lib/qr-create-step-design-types';

type QrCreateAdvancedDynamicPanelProps = Pick<
  QrCreateStepDesignProps,
  | 'category'
  | 'name'
  | 'qrData'
  | 'landingEnabled'
  | 'landingPage'
  | 'scheduleEnabled'
  | 'scheduleData'
  | 'geofenceEnabled'
  | 'geofenceData'
  | 'abTestEnabled'
  | 'abTestData'
  | 'gpsHeatmapEnabled'
  | 'onLandingEnabledChange'
  | 'onLandingPageChange'
  | 'onScheduleEnabledChange'
  | 'onScheduleDataChange'
  | 'onGeofenceEnabledChange'
  | 'onGeofenceDataChange'
  | 'onAbTestEnabledChange'
  | 'onAbTestDataChange'
  | 'onGpsHeatmapEnabledChange'
>;

export function QrCreateAdvancedDynamicPanel(props: QrCreateAdvancedDynamicPanelProps) {
  const {
    category,
    name,
    qrData,
    landingEnabled,
    landingPage,
    scheduleEnabled,
    scheduleData,
    geofenceEnabled,
    geofenceData,
    abTestEnabled,
    abTestData,
    gpsHeatmapEnabled,
    onLandingEnabledChange,
    onLandingPageChange,
    onScheduleEnabledChange,
    onScheduleDataChange,
    onGeofenceEnabledChange,
    onGeofenceDataChange,
    onAbTestEnabledChange,
    onAbTestDataChange,
    onGpsHeatmapEnabledChange,
  } = props;

  return (
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
  );
}
