'use client';

import { LandingPageEditor } from './landing-page-editor';
import { ScheduleSettings } from './schedule-settings';
import type { QrCreateStepDesignProps } from '@/lib/qr-create-step-design-types';

type QrCreateAdvancedLandingSchedulePanelProps = Pick<
  QrCreateStepDesignProps,
  | 'category'
  | 'name'
  | 'qrData'
  | 'landingEnabled'
  | 'landingPage'
  | 'scheduleEnabled'
  | 'scheduleData'
  | 'onLandingEnabledChange'
  | 'onLandingPageChange'
  | 'onScheduleEnabledChange'
  | 'onScheduleDataChange'
>;

export function QrCreateAdvancedLandingSchedulePanel(props: QrCreateAdvancedLandingSchedulePanelProps) {
  const {
    category,
    name,
    qrData,
    landingEnabled,
    landingPage,
    scheduleEnabled,
    scheduleData,
    onLandingEnabledChange,
    onLandingPageChange,
    onScheduleEnabledChange,
    onScheduleDataChange,
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
    </>
  );
}
