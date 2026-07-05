import type { QrCreateDraftSetters, QrCreateDraftValues } from '@/lib/qr-create-draft-state-types';
import type { useQrCreateCoreState } from '@/hooks/use-qr-create-core-state';
import type { QrFeatureFields } from '@/hooks/use-qr-feature-fields';

type Core = ReturnType<typeof useQrCreateCoreState>;
type FeatureSlice = Pick<
  QrFeatureFields,
  | 'advanced'
  | 'landingEnabled'
  | 'landingPage'
  | 'scheduleEnabled'
  | 'scheduleData'
  | 'geofenceEnabled'
  | 'geofenceData'
  | 'abTestEnabled'
  | 'abTestData'
  | 'gpsHeatmapEnabled'
  | 'nfcEnabled'
  | 'scanNotify'
  | 'pixels'
>;

export function buildQrCreateDraftValues(
  core: Pick<
    Core,
    'step' | 'category' | 'name' | 'qrData' | 'style' | 'logoPreview' | 'activeTemplate'
  >,
  features: FeatureSlice,
): QrCreateDraftValues {
  return {
    step: core.step,
    category: core.category,
    name: core.name,
    qrData: core.qrData,
    style: core.style,
    logoPreview: core.logoPreview,
    activeTemplate: core.activeTemplate,
    ...features,
  };
}

export function buildQrCreateDraftSetters(
  core: Pick<
    Core,
    | 'setStep'
    | 'setCategory'
    | 'setName'
    | 'setQrData'
    | 'resetHistory'
    | 'setLogoPreview'
    | 'setActiveTemplate'
  >,
  features: Pick<
    QrFeatureFields,
    | 'setAdvanced'
    | 'setLandingEnabled'
    | 'setLandingPage'
    | 'setScheduleEnabled'
    | 'setScheduleData'
    | 'setGeofenceEnabled'
    | 'setGeofenceData'
    | 'setAbTestEnabled'
    | 'setAbTestData'
    | 'setGpsHeatmapEnabled'
    | 'setNfcEnabled'
    | 'setScanNotify'
    | 'setPixels'
  >,
): QrCreateDraftSetters {
  return {
    setStep: core.setStep,
    setCategory: core.setCategory,
    setName: core.setName,
    setQrData: core.setQrData,
    resetStyleHistory: core.resetHistory,
    setLogoPreview: core.setLogoPreview,
    setActiveTemplate: core.setActiveTemplate,
    ...features,
  };
}
