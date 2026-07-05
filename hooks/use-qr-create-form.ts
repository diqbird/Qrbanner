'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { DEFAULT_QR_STYLE, normalizeQRStyle } from '@/components/qr/qr-style-editor';
import type { QRStyleConfig } from '@/lib/qr-style';
import { useQRStyleHistory } from '@/hooks/use-qr-style-history';
import { QR_CATEGORIES, buildQRPayload } from '@/lib/qr-utils';
import type { IndustryTemplate } from '@/lib/industry-templates';
import { stripMetaFields, getTemplateById, validateTemplateRequiredFields } from '@/lib/industry-templates';
import { useLanguage } from '@/components/i18n/language-provider';
import { useUnsavedChangesGuard } from '@/hooks/use-unsaved-changes-guard';
import { buildQrFeaturePayload, useQrFeatureFields } from '@/hooks/use-qr-feature-fields';
import { hubLinksValid, firstHubUrl } from '@/components/qr/link-hub-editor';
import { clearQrCreateDraft } from '@/lib/qr-create-draft';
import { applyQrCreateDraft, buildQrCreateDraft } from '@/lib/qr-create-form-draft';
import { useQrCreateDraftSync } from '@/hooks/use-qr-create-draft-sync';
import { useQrCreateTemplateActions } from '@/hooks/use-qr-create-template-actions';
import { useQrCreateLogo } from '@/hooks/use-qr-create-logo';

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
  const urlParamsApplied = useRef(false);

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
    applyStyleTemplate,
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

  useEffect(() => {
    if (urlParamsApplied.current) return;
    const templateId = searchParams.get('template');
    const categoryId = searchParams.get('category');
    const styleTemplateId = searchParams.get('styleTemplate');
    if (templateId) {
      const template = getTemplateById(templateId);
      if (template) {
        urlParamsApplied.current = true;
        applyTemplate(template);
      }
    } else if (categoryId && QR_CATEGORIES.some((c) => c.id === categoryId)) {
      urlParamsApplied.current = true;
      setActiveTemplate(null);
      setCategory(categoryId);
      setStep(1);
    } else if (styleTemplateId) {
      urlParamsApplied.current = true;
      void applyStyleTemplateFromApi(styleTemplateId);
    }
  }, [searchParams, applyTemplate, applyStyleTemplateFromApi]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    if (step < 1) return;
    void import('@/components/qr/qr-preview');
    void import('@/components/qr/qr-create-step-design');
  }, [step]);

  const goToStep = useCallback((next: number) => setStep(next), []);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error(t('create.nameRequired'));
      return;
    }
    if (!session) {
      redirectGuestToSignup();
      return;
    }
    setSaving(true);
    try {
      let logoPath = storedLogoPath;
      let fileToUpload: File | null = logoFile;
      if (!fileToUpload && logoPreview?.startsWith('data:')) {
        const blob = await fetch(logoPreview).then((r) => r.blob());
        fileToUpload = new File([blob], 'logo.png', { type: blob.type || 'image/png' });
      }
      if (fileToUpload) {
        const result = await uploadLogo(fileToUpload);
        logoPath = result?.cloud_storage_path ?? null;
        if (!logoPath) toast.error(t('create.logoUploadFailed'));
      } else if (!logoPath && logoPreview && !logoPreview.startsWith('data:')) {
        logoPath = logoPreview;
      }

      const res = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          qrData: payloadData(),
          style,
          logoPath,
          logoIsPublic: true,
          password: advanced.password || undefined,
          ...buildQrFeaturePayload({ name, mode: 'create', fields: featureFields }),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        clearQrCreateDraft();
        router.replace(`/qr/${data?.qrCode?.id ?? ''}`);
      } else if (res.status === 401) {
        redirectGuestToSignup();
      } else {
        const err = await res.json();
        toast.error(err?.error ?? t('create.createFailed'));
      }
    } catch {
      toast.error(t('bulk.somethingWrong'));
    } finally {
      setSaving(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return Boolean(category);
    if (step === 1) {
      if (!name.trim()) return false;
      if (category === 'link_hub') {
        return hubLinksValid(landingPage.hubLinks) && Boolean(firstHubUrl(landingPage.hubLinks));
      }
      if (activeTemplate && !validateTemplateRequiredFields(activeTemplate, qrData)) return false;
      return Boolean(buildQRPayload(category, payloadData()).trim());
    }
    return true;
  };

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
