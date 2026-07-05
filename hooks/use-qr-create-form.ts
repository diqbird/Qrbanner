'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DEFAULT_QR_STYLE } from '@/components/qr/qr-style-editor';
import type { QRStyleConfig } from '@/lib/qr-style';
import { useQRStyleHistory } from '@/hooks/use-qr-style-history';
import { stripMetaFields } from '@/lib/industry-templates';
import type { IndustryTemplate } from '@/lib/industry-templates';
import { useLanguage } from '@/components/i18n/language-provider';
import { useUnsavedChangesGuard } from '@/hooks/use-unsaved-changes-guard';
import { useQrFeatureFields } from '@/hooks/use-qr-feature-fields';
import { applyQrCreateDraft, buildQrCreateDraft } from '@/lib/qr-create-form-draft';
import { useQrCreateDraftSync } from '@/hooks/use-qr-create-draft-sync';
import { useQrCreateTemplateActions } from '@/hooks/use-qr-create-template-actions';
import { useQrCreateLogo } from '@/hooks/use-qr-create-logo';
import { useQrCreateUrlParams } from '@/hooks/use-qr-create-url-params';
import { useQrCreateSave } from '@/hooks/use-qr-create-save';
import { canProceedCreateStep } from '@/lib/qr-create-can-proceed';

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

  const hasWizardProgress =
    step > 0 ||
    Boolean(category) ||
    Boolean(name.trim()) ||
    Object.values(qrData).some((v) => String(v ?? '').trim() !== '') ||
    Boolean(logoFile) ||
    Boolean(logoPreview);
  useUnsavedChangesGuard(mode === 'wizard' && hasWizardProgress && !saving);

  const payloadData = useCallback(() => stripMetaFields(qrData), [qrData]);

  const buildCurrentDraft = useCallback(
    () =>
      buildQrCreateDraft({
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
      }),
    [
      step, category, name, qrData, style, logoPreview, activeTemplate,
      advanced, landingEnabled, landingPage, scheduleEnabled, scheduleData,
      geofenceEnabled, geofenceData, abTestEnabled, abTestData,
      gpsHeatmapEnabled, nfcEnabled, scanNotify, pixels,
    ],
  );

  const applyDraft = useCallback(
    (draft: ReturnType<typeof buildCurrentDraft>) => {
      applyQrCreateDraft(draft, {
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
      });
    },
    [
      resetStyleHistory,
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
    ],
  );

  const { redirectGuestToSignup, saveGuestDraft } = useQrCreateDraftSync({
    isGuest,
    category,
    authStatus,
    restoreParam: searchParams.get('restore'),
    buildCurrentDraft,
    applyDraft,
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    if (step < 1) return;
    void import('@/components/qr/qr-preview');
    void import('@/components/qr/qr-create-step-design');
  }, [step]);

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

  const canProceed = () =>
    canProceedCreateStep({
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
