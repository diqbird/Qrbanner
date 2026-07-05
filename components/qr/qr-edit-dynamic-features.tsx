'use client';

import { LandingPageEditor } from '@/components/qr/landing-page-editor';
import { ScheduleSettings } from '@/components/qr/schedule-settings';
import { GeofenceSettings } from '@/components/qr/geofence-settings';
import { AbTestSettings } from '@/components/qr/ab-test-settings';
import { GpsHeatmapSettings } from '@/components/qr/gps-heatmap';
import type { QrEditFormColumnProps } from '@/lib/qr-edit-form-column-types';

export function QrEditDynamicFeatures({ form }: QrEditFormColumnProps) {
  const {
    name,
    targetUrl,
    landingEnabled,
    setLandingEnabled,
    landingPage,
    setLandingPage,
    scheduleEnabled,
    setScheduleEnabled,
    scheduleData,
    setScheduleData,
    geofenceEnabled,
    setGeofenceEnabled,
    geofenceData,
    setGeofenceData,
    abTestEnabled,
    setAbTestEnabled,
    abTestData,
    setAbTestData,
    gpsHeatmapEnabled,
    setGpsHeatmapEnabled,
    qr,
  } = form;

  if (!qr) return null;

  const category = qr.category ?? 'url';

  return (
    <>
      <LandingPageEditor
        enabled={landingEnabled}
        onEnabledChange={setLandingEnabled}
        data={landingPage}
        onChange={setLandingPage}
        qrName={name}
        category={category}
        targetUrl={targetUrl}
      />
      <ScheduleSettings
        enabled={scheduleEnabled}
        onEnabledChange={setScheduleEnabled}
        data={scheduleData}
        onChange={setScheduleData}
      />
      <GeofenceSettings
        enabled={geofenceEnabled}
        onEnabledChange={setGeofenceEnabled}
        data={geofenceData}
        onChange={setGeofenceData}
      />
      <AbTestSettings
        enabled={abTestEnabled}
        onEnabledChange={setAbTestEnabled}
        data={abTestData}
        onChange={setAbTestData}
        defaultUrl={targetUrl}
      />
      <GpsHeatmapSettings
        enabled={gpsHeatmapEnabled}
        onEnabledChange={setGpsHeatmapEnabled}
      />
    </>
  );
}
