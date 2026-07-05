'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DEFAULT_QR_STYLE } from '@/components/qr/qr-style-editor';
import type { QRStyleConfig } from '@/lib/qr-style';
import { useQRStyleHistory } from '@/hooks/use-qr-style-history';
import { stripMetaFields } from '@/lib/industry-templates';
import type { IndustryTemplate } from '@/lib/industry-templates';
import { useLanguage } from '@/components/i18n/language-provider';
import { useQrFeatureFields } from '@/hooks/use-qr-feature-fields';
import { useQrCreateDraftBridge } from '@/hooks/use-qr-create-draft-bridge';
import { useQrCreateTemplateActions } from '@/hooks/use-qr-create-template-actions';
import { useQrCreateLogo } from '@/hooks/use-qr-create-logo';
import { useQrCreateUrlParams } from '@/hooks/use-qr-create-url-params';
import { useQrCreateSave } from '@/hooks/use-qr-create-save';
import {
  createCanProceedCreateStep,
  useQrCreateWizardEffects,
} from '@/hooks/use-qr-create-wizard-effects';
import { useQrCreateDraftState } from '@/hooks/use-qr-create-draft-state';
import { useQrCreateWizardGuard } from '@/hooks/use-qr-create-wizard-guard';

export function useQrCreateForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status: authStatus } = useSession() || {};
  const isGuest = authStatus === 'unauthenticated';

  const [step, setStep] = useState(0);
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [qrData, setQrData] = useState<Record<string, string>>({});
  const {
    style,
    setStyle,
    undo: undoStyle,
    redo: redoStyle,
    resetHistory: resetStyleHistory,
    canUndo: canUndoStyle,
    canRedo: canRedoStyle,
  } = useQRStyleHistory(DEFAULT_QR_STYLE);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [storedLogoPath, setStoredLogoPath] = useState<string | null>(null);
  const featureFields = useQrFeatureFields();
  const {
    advanced,
    setAdvanced,
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
    nfcEnabled,
    setNfcEnabled,
    scanNotify,
    setScanNotify,
    pixels,
    setPixels,
  } = featureFields;
  const [activeTemplate, setActiveTemplate] = useState<IndustryTemplate | null>(null);
  const [templateGuideDismissed, setTemplateGuideDismissed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<'quick' | 'wizard'>(() =>
    searchParams?.get('quick') === '1' ? 'quick' : 'wizard',
  );

  useQrCreateWizardGuard({ mode, saving, step, category, name, qrData, logoFile, logoPreview });

  const payloadData = useCallback(() => stripMetaFields(qrData), [qrData]);

  const { draftState, draftSetters } = useQrCreateDraftState(
    {
      step,
      category,
      name,
      qrData,
      style,
      logoPreview,
      activeTemplate,
      advanced,
      landingEnabled,
      landingPage,
      scheduleEnabled,
      scheduleData,
      geofenceEnabled,
      geofenceData,
      abTestEnabled,
      abTestData,
      gpsHeatmapEnabled,
      nfcEnabled,
      scanNotify,
      pixels,
    },
    {
      setStep,
      setCategory,
      setName,
      setQrData,
      resetStyleHistory,
      setLogoPreview,
      setActiveTemplate,
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
      setNfcEnabled,
      setScanNotify,
      setPixels,
    },
  );

  const { redirectGuestToSignup, saveGuestDraft } = useQrCreateDraftBridge({
    draftState,
    draftSetters,
    isGuest,
    category,
    authStatus,
    restoreParam: searchParams.get('restore'),
    router,
    t,
  });

  const {
    applyTemplate,
    selectCategory,
    enterWizardFromQuick: enterWizardFromQuickInner,
    applyStyleTemplateFromApi,
  } = useQrCreateTemplateActions({
    category,
    resetStyleHistory,
    setCategory,
    setQrData,
    setName,
    setStep,
    setActiveTemplate,
    setTemplateGuideDismissed,
    setStoredLogoPath,
    setLogoPreview,
    setLogoFile,
    setLandingEnabled,
    setLandingPage,
    t,
  });

  const { handleLogoChange, applyTemplateLogo, uploadLogo } = useQrCreateLogo({
    logoFile,
    setLogoFile,
    setLogoPreview,
    setStoredLogoPath,
  });

  useQrCreateUrlParams({
    searchParams,
    applyTemplate,
    applyStyleTemplateFromApi,
    setActiveTemplate,
    setCategory,
    setStep,
  });

  useQrCreateWizardEffects(step);

  const goToStep = useCallback((next: number) => setStep(next), []);

  const { handleSave } = useQrCreateSave({
    name,
    category,
    session,
    featureFields,
    advanced,
    payloadData,
    style,
    logoFile,
    logoPreview,
    storedLogoPath,
    uploadLogo,
    redirectGuestToSignup,
    router,
    t,
    setSaving,
  });

  const canProceed = createCanProceedCreateStep({
    step,
    category,
    name,
    qrData,
    payloadData,
    activeTemplate,
    landingPage,
  });

  const enterWizardFromQuick = useCallback(
    (data: { url?: string; name?: string; style?: Partial<QRStyleConfig> }) => {
      enterWizardFromQuickInner(data);
      setMode('wizard');
    },
    [enterWizardFromQuickInner],
  );

  return {
    session,
    isGuest,
    mode,
    setMode,
    step,
    goToStep,
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
    advanced,
    setAdvanced,
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
    nfcEnabled,
    setNfcEnabled,
    scanNotify,
    setScanNotify,
    pixels,
    setPixels,
    activeTemplate,
    templateGuideDismissed,
    setTemplateGuideDismissed,
    saving,
    payloadData,
    applyTemplate,
    selectCategory,
    handleLogoChange,
    applyTemplateLogo,
    handleSave,
    canProceed,
    redirectGuestToSignup,
    saveGuestDraft,
    enterWizardFromQuick,
  };
}

export type QrCreateFormState = ReturnType<typeof useQrCreateForm>;
