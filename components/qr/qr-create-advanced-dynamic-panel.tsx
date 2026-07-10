'use client';

import type { QrCreateStepDesignProps } from '@/lib/qr-create-step-design-types';
import { QrCreateAdvancedLandingSchedulePanel } from './qr-create-advanced-landing-schedule-panel';
import { QrCreateAdvancedGeofencePanel } from './qr-create-advanced-geofence-panel';

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
  | 'languageRedirectEnabled'
  | 'languageRedirectData'
  | 'abTestEnabled'
  | 'abTestData'
  | 'gpsHeatmapEnabled'
  | 'onLandingEnabledChange'
  | 'onLandingPageChange'
  | 'onScheduleEnabledChange'
  | 'onScheduleDataChange'
  | 'onGeofenceEnabledChange'
  | 'onGeofenceDataChange'
  | 'onLanguageRedirectEnabledChange'
  | 'onLanguageRedirectDataChange'
  | 'onAbTestEnabledChange'
  | 'onAbTestDataChange'
  | 'onGpsHeatmapEnabledChange'
>;

export function QrCreateAdvancedDynamicPanel(props: QrCreateAdvancedDynamicPanelProps) {
  return (
    <>
      <QrCreateAdvancedLandingSchedulePanel {...props} />
      <QrCreateAdvancedGeofencePanel {...props} />
    </>
  );
}
