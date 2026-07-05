'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { DEFAULT_QR_STYLE, normalizeQRStyle } from '@/components/qr/qr-style-editor';
import type { QRStyleConfig } from '@/lib/qr-style';
import { useQRStyleHistory } from '@/hooks/use-qr-style-history';
import { downscaleLogo } from '@/lib/image-downscale';
import { QR_CATEGORIES, buildQRPayload } from '@/lib/qr-utils';
import type { IndustryTemplate } from '@/lib/industry-templates';
import {
  stripMetaFields,
  buildLandingFromTemplate,
  getTemplateById,
  validateTemplateRequiredFields,
} from '@/lib/industry-templates';
import { emptyLandingPage } from '@/components/qr/landing-page-editor';
import { defaultLeadForm } from '@/lib/landing-page';
import { useLanguage } from '@/components/i18n/language-provider';
import { useUnsavedChangesGuard } from '@/hooks/use-unsaved-changes-guard';
import { buildQrFeaturePayload, useQrFeatureFields } from '@/hooks/use-qr-feature-fields';
import { hubLinksValid, firstHubUrl } from '@/components/qr/link-hub-editor';
import {
  clearQrCreateDraft,
  loadQrCreateDraft,
  saveQrCreateDraft,
  type QrCreateDraft,
} from '@/lib/qr-create-draft';

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
  const draftRestored = useRef(false);

  const hasWizardProgress =
    step > 0 ||
    Boolean(category) ||
    Boolean(name.trim()) ||
    Object.values(qrData).some((v) => String(v ?? '').trim() !== '') ||
    Boolean(logoFile) ||
    Boolean(logoPreview);
  useUnsavedChangesGuard(mode === 'wizard' && hasWizardProgress && !saving);

  const payloadData = useCallback(() => stripMetaFields(qrData), [qrData]);

  const buildCurrentDraft = useCallback((): QrCreateDraft => ({
    version: 1,
    savedAt: new Date().toISOString(),
    step,
    category,
    name,
    qrData,
    style,
    logoPreview,
    templateId: activeTemplate?.id ?? null,
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
  }), [
    step, category, name, qrData, style, logoPreview, activeTemplate,
    advanced, landingEnabled, landingPage, scheduleEnabled, scheduleData,
    geofenceEnabled, geofenceData, abTestEnabled, abTestData,
    gpsHeatmapEnabled, nfcEnabled, scanNotify, pixels,
  ]);

  const applyDraft = useCallback(
    (draft: QrCreateDraft) => {
      setStep(draft.step);
      setCategory(draft.category);
      setName(draft.name);
      setQrData(draft.qrData);
      resetStyleHistory(normalizeQRStyle(draft.style));
      setLogoPreview(draft.logoPreview);
      setAdvanced(draft.advanced);
      setLandingEnabled(draft.landingEnabled);
      setLandingPage(draft.landingPage);
      setScheduleEnabled(draft.scheduleEnabled);
      setScheduleData(draft.scheduleData);
      setGeofenceEnabled(draft.geofenceEnabled);
      setGeofenceData(draft.geofenceData);
      setAbTestEnabled(draft.abTestEnabled);
      setAbTestData(draft.abTestData);
      setGpsHeatmapEnabled(draft.gpsHeatmapEnabled);
      setNfcEnabled(draft.nfcEnabled);
      setScanNotify(draft.scanNotify);
      setPixels(draft.pixels);
      if (draft.templateId) {
        const tmpl = getTemplateById(draft.templateId);
        if (tmpl) setActiveTemplate(tmpl);
      }
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

  const redirectGuestToSignup = useCallback(() => {
    saveQrCreateDraft({ ...buildCurrentDraft(), step: 3 });
    const callback = encodeURIComponent('/qr/create?restore=1');
    router.push(`/signup?callbackUrl=${callback}`);
  }, [buildCurrentDraft, router]);

  const saveGuestDraft = useCallback(() => {
    if (!isGuest || !category) return;
    saveQrCreateDraft(buildCurrentDraft());
  }, [isGuest, category, buildCurrentDraft]);

  const applyStyleTemplate = useCallback(
    (tpl: { style: Record<string, unknown>; logoPath: string | null; name?: string }) => {
      resetStyleHistory(normalizeQRStyle(tpl.style));
      if (tpl.logoPath) {
        setStoredLogoPath(tpl.logoPath);
        setLogoPreview(tpl.logoPath);
        setLogoFile(null);
      }
      if (!category) {
        setCategory('url');
        setQrData({ url: 'https://' });
      }
      setStep((s) => Math.max(s, 1));
    },
    [resetStyleHistory, category],
  );

  const applyTemplate = useCallback(
    (template: IndustryTemplate) => {
      setActiveTemplate(template);
      setTemplateGuideDismissed(false);
      setCategory(template.category);
      setQrData({ ...template.qrData });
      resetStyleHistory(normalizeQRStyle({ ...DEFAULT_QR_STYLE, ...template.style }));
      setName(template.suggestedQrName);
      const built = buildLandingFromTemplate(template, template.qrData);
      const hubLinks = template.landingPage?.hubLinks;
      const wantsLanding = built.enabled || template.category === 'link_hub';
      if (wantsLanding) {
        setLandingEnabled(true);
        setLandingPage({
          ...emptyLandingPage,
          template: built.template ?? (template.category === 'link_hub' ? 'hotel' : 'minimal'),
          title: built.title ?? template.suggestedQrName,
          subtitle: built.subtitle ?? '',
          accentColor: built.accentColor ?? emptyLandingPage.accentColor,
          ctaLabel: built.ctaLabel ?? 'Continue',
          leadFormEnabled: built.leadFormEnabled ?? false,
          leadForm: { ...defaultLeadForm, ...built.leadForm },
          ...(hubLinks?.length ? { hubMode: true, hubLinks: [...hubLinks] } : {}),
        });
        if (template.category === 'link_hub' && hubLinks?.length) {
          const url = hubLinks.find((l) => l.url?.trim())?.url ?? '';
          if (url) setQrData({ url });
        }
      }
      setStep(1);
    },
    [resetStyleHistory, setLandingEnabled, setLandingPage],
  );

  const selectCategory = useCallback(
    (catId: string) => {
      setActiveTemplate(null);
      setCategory(catId);
      setQrData({});
      if (catId === 'link_hub') {
        setLandingEnabled(true);
        setLandingPage({
          ...emptyLandingPage,
          template: 'minimal',
          hubMode: true,
          hubLinks: [
            { label: 'Website', url: '' },
            { label: 'Instagram', url: '' },
          ],
        });
      }
      setStep(1);
    },
    [setLandingEnabled, setLandingPage],
  );

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
      fetch('/api/templates')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          const tpl = (data?.templates ?? []).find(
            (row: { id: string }) => row.id === styleTemplateId,
          );
          if (tpl) {
            applyStyleTemplate(tpl);
            toast.success(t('settings.brandKit.applied', { name: tpl.name }));
          }
        })
        .catch(() => {
          /* ignore */
        });
    }
  }, [searchParams, applyTemplate, applyStyleTemplate, t]);

  useEffect(() => {
    if (draftRestored.current || authStatus !== 'authenticated') return;
    if (searchParams.get('restore') !== '1') return;
    const draft = loadQrCreateDraft();
    if (!draft) return;
    draftRestored.current = true;
    applyDraft(draft);
    toast.success(t('create.draftRestored'));
    router.replace('/qr/create');
  }, [authStatus, searchParams, applyDraft, router, t]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    if (step < 1) return;
    void import('@/components/qr/qr-preview');
    void import('@/components/qr/qr-create-step-design');
  }, [step]);

  useEffect(() => {
    if (!isGuest || !category) return;
    const timer = window.setTimeout(() => {
      saveQrCreateDraft(buildCurrentDraft());
    }, 400);
    return () => window.clearTimeout(timer);
  }, [isGuest, category, buildCurrentDraft]);

  const goToStep = useCallback((next: number) => setStep(next), []);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    setStoredLogoPath(null);
    try {
      const { dataUrl, file: optimized } = await downscaleLogo(file);
      setLogoFile(optimized);
      setLogoPreview(dataUrl);
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
      setLogoFile(file);
    }
  };

  const applyTemplateLogo = useCallback((path: string | null) => {
    setStoredLogoPath(path);
    if (path) setLogoPreview(path);
  }, []);

  const uploadLogo = async (file?: File | null): Promise<{ cloud_storage_path: string } | null> => {
    const toUpload = file ?? logoFile;
    if (!toUpload) return null;
    try {
      const formData = new FormData();
      formData.append('file', toUpload);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) return null;
      const { path } = await res.json();
      return { cloud_storage_path: path };
    } catch (e: unknown) {
      console.error('Logo upload failed:', e);
      return null;
    }
  };

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
      if (data.url) {
        setCategory('url');
        setQrData({ url: data.url });
        setName(data.name || '');
        resetStyleHistory(normalizeQRStyle(data.style ?? DEFAULT_QR_STYLE));
        setStep(1);
      }
      setMode('wizard');
    },
    [resetStyleHistory],
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
