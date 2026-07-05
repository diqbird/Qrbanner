'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { stripMetaFields } from '@/lib/industry-templates';
import { useLanguage } from '@/components/i18n/language-provider';
import { useQrCreateWizardGuard } from '@/hooks/use-qr-create-wizard-guard';
import { useQrCreateCoreState } from '@/hooks/use-qr-create-core-state';
import { useQrCreateFormDraft } from '@/hooks/use-qr-create-form-draft';
import { useQrCreateFormActions } from '@/hooks/use-qr-create-form-actions';
import { buildQrCreateDraftSetters, buildQrCreateDraftValues } from '@/lib/qr-create-draft-input';

export function useQrCreateForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status: authStatus } = useSession() || {};
  const isGuest = authStatus === 'unauthenticated';

  const core = useQrCreateCoreState();
  const { featureFields, ...coreRest } = core;
  const {
    step,
    category,
    name,
    setName,
    qrData,
    setQrData,
    style,
    setStyle,
    undo: undoStyle,
    redo: redoStyle,
    canUndo: canUndoStyle,
    canRedo: canRedoStyle,
    logoFile,
    logoPreview,
    storedLogoPath,
    activeTemplate,
    templateGuideDismissed,
    setTemplateGuideDismissed,
    saving,
    mode,
    setMode,
  } = coreRest;

  const featureSlice = {
    advanced: featureFields.advanced,
    setAdvanced: featureFields.setAdvanced,
    landingEnabled: featureFields.landingEnabled,
    setLandingEnabled: featureFields.setLandingEnabled,
    landingPage: featureFields.landingPage,
    setLandingPage: featureFields.setLandingPage,
    scheduleEnabled: featureFields.scheduleEnabled,
    setScheduleEnabled: featureFields.setScheduleEnabled,
    scheduleData: featureFields.scheduleData,
    setScheduleData: featureFields.setScheduleData,
    geofenceEnabled: featureFields.geofenceEnabled,
    setGeofenceEnabled: featureFields.setGeofenceEnabled,
    geofenceData: featureFields.geofenceData,
    setGeofenceData: featureFields.setGeofenceData,
    abTestEnabled: featureFields.abTestEnabled,
    setAbTestEnabled: featureFields.setAbTestEnabled,
    abTestData: featureFields.abTestData,
    setAbTestData: featureFields.setAbTestData,
    gpsHeatmapEnabled: featureFields.gpsHeatmapEnabled,
    setGpsHeatmapEnabled: featureFields.setGpsHeatmapEnabled,
    nfcEnabled: featureFields.nfcEnabled,
    setNfcEnabled: featureFields.setNfcEnabled,
    scanNotify: featureFields.scanNotify,
    setScanNotify: featureFields.setScanNotify,
    pixels: featureFields.pixels,
    setPixels: featureFields.setPixels,
  };

  useQrCreateWizardGuard({ mode, saving, step, category, name, qrData, logoFile, logoPreview });

  const payloadData = useCallback(() => stripMetaFields(qrData), [qrData]);

  const { redirectGuestToSignup, saveGuestDraft } = useQrCreateFormDraft({
    draftValues: buildQrCreateDraftValues(coreRest, featureSlice),
    draftSettersInput: buildQrCreateDraftSetters(core, featureFields),
    isGuest,
    category,
    authStatus,
    restoreParam: searchParams.get('restore'),
    router,
    t,
  });

  const actions = useQrCreateFormActions({
    core,
    featureFields,
    advanced: featureSlice.advanced,
    payloadData,
    session,
    redirectGuestToSignup,
    router,
    searchParams,
    t,
  });

  return {
    session,
    isGuest,
    mode,
    setMode,
    step,
    goToStep: actions.goToStep,
    category,
    name,
    setName,
    qrData,
    setQrData,
    style,
    setStyle,
    undoStyle,
    redoStyle,
    canUndoStyle,
    canRedoStyle,
    logoFile,
    logoPreview,
    storedLogoPath,
    featureFields,
    ...featureSlice,
    activeTemplate,
    templateGuideDismissed,
    setTemplateGuideDismissed,
    saving,
    payloadData,
    applyTemplate: actions.applyTemplate,
    selectCategory: actions.selectCategory,
    handleLogoChange: actions.handleLogoChange,
    applyTemplateLogo: actions.applyTemplateLogo,
    handleSave: actions.handleSave,
    canProceed: actions.canProceed,
    redirectGuestToSignup,
    saveGuestDraft,
    enterWizardFromQuick: actions.enterWizardFromQuick,
  };
}

export type QrCreateFormState = ReturnType<typeof useQrCreateForm>;
