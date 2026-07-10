'use client';

import { GeofenceSettings } from './geofence-settings';
import { LanguageRedirectSettings } from './language-redirect-settings';
import { AbTestSettings } from './ab-test-settings';
import { GpsHeatmapSettings } from './gps-heatmap';
import type { QrCreateStepDesignProps } from '@/lib/qr-create-step-design-types';

type QrCreateAdvancedGeofencePanelProps = Pick<
  QrCreateStepDesignProps,
  | 'qrData'
  | 'geofenceEnabled'
  | 'geofenceData'
  | 'languageRedirectEnabled'
  | 'languageRedirectData'
  | 'abTestEnabled'
  | 'abTestData'
  | 'gpsHeatmapEnabled'
  | 'onGeofenceEnabledChange'
  | 'onGeofenceDataChange'
  | 'onLanguageRedirectEnabledChange'
  | 'onLanguageRedirectDataChange'
  | 'onAbTestEnabledChange'
  | 'onAbTestDataChange'
  | 'onGpsHeatmapEnabledChange'
>;

export function QrCreateAdvancedGeofencePanel(props: QrCreateAdvancedGeofencePanelProps) {
  const {
    qrData,
    geofenceEnabled,
    geofenceData,
    languageRedirectEnabled,
    languageRedirectData,
    abTestEnabled,
    abTestData,
    gpsHeatmapEnabled,
    onGeofenceEnabledChange,
    onGeofenceDataChange,
    onLanguageRedirectEnabledChange,
    onLanguageRedirectDataChange,
    onAbTestEnabledChange,
    onAbTestDataChange,
    onGpsHeatmapEnabledChange,
  } = props;

  return (
    <>
      <GeofenceSettings
        enabled={geofenceEnabled}
        onEnabledChange={onGeofenceEnabledChange}
        data={geofenceData}
        onChange={onGeofenceDataChange}
      />
      <LanguageRedirectSettings
        enabled={languageRedirectEnabled}
        onEnabledChange={onLanguageRedirectEnabledChange}
        data={languageRedirectData}
        onChange={onLanguageRedirectDataChange}
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
