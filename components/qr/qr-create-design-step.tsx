'use client';

import dynamic from 'next/dynamic';
import { useScanBaseUrl } from '@/lib/use-scan-base-url';
import { resolveQrContentLength } from '@/lib/qr-preview-content';
import type { QrCreateFormState } from '@/hooks/use-qr-create-form';
import { QRPreviewSkeleton } from './qr-preview-skeleton';

const QrCreateStepDesign = dynamic(
  () => import('./qr-create-step-design').then((m) => ({ default: m.QrCreateStepDesign })),
  { loading: () => <QRPreviewSkeleton /> },
);

export function QrCreateDesignStep({ form }: { form: QrCreateFormState }) {
  const scanBaseUrl = useScanBaseUrl();
  const {
    category,
    name,
    qrData,
    style,
    logoPreview,
    storedLogoPath,
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
    payloadData,
    setStyle,
    canUndoStyle,
    canRedoStyle,
    undoStyle,
    redoStyle,
    handleLogoChange,
    applyTemplateLogo,
    setAdvanced,
    setLandingEnabled,
    setLandingPage,
    setScheduleEnabled,
    setScheduleData,
    setGeofenceEnabled,
    setGeofenceData,
    setAbTestEnabled,
    setAbTestData,
    setGpsHeatmapEnabled,
    setScanNotify,
    setPixels,
  } = form;

  return (
    <QrCreateStepDesign
      category={category}
      name={name}
      qrData={qrData}
      style={style}
      logoPreview={logoPreview}
      activeTemplate={activeTemplate}
      landingPage={landingPage}
      advanced={advanced}
      landingEnabled={landingEnabled}
      scheduleEnabled={scheduleEnabled}
      scheduleData={scheduleData}
      geofenceEnabled={geofenceEnabled}
      geofenceData={geofenceData}
      abTestEnabled={abTestEnabled}
      abTestData={abTestData}
      gpsHeatmapEnabled={gpsHeatmapEnabled}
      scanNotify={scanNotify}
      pixels={pixels}
      contentLength={resolveQrContentLength(category, payloadData(), undefined, scanBaseUrl)}
      onStyleChange={setStyle}
      canUndoStyle={canUndoStyle}
      canRedoStyle={canRedoStyle}
      onUndoStyle={undoStyle}
      onRedoStyle={redoStyle}
      onLogoChange={handleLogoChange}
      logoPath={storedLogoPath}
      onTemplateLogoApply={applyTemplateLogo}
      onAdvancedChange={setAdvanced}
      onLandingEnabledChange={setLandingEnabled}
      onLandingPageChange={setLandingPage}
      onScheduleEnabledChange={setScheduleEnabled}
      onScheduleDataChange={setScheduleData}
      onGeofenceEnabledChange={setGeofenceEnabled}
      onGeofenceDataChange={setGeofenceData}
      onAbTestEnabledChange={setAbTestEnabled}
      onAbTestDataChange={setAbTestData}
      onGpsHeatmapEnabledChange={setGpsHeatmapEnabled}
      onScanNotifyChange={setScanNotify}
      onPixelsChange={setPixels}
    />
  );
}
