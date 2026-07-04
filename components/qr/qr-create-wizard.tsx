'use client';

import { useState, useEffect, useRef, useCallback, type ComponentType } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Globe, Contact, Wifi, Mail, MessageSquare, Phone,
  Calendar, FileText, Share2, Download, ArrowLeft, ArrowRight,
  CheckCircle2, MapPin, Bitcoin, Type, Video,
  Music, MessageCircle, Instagram, Youtube, Linkedin, Facebook, Link2, Package,
} from 'lucide-react';
import { toast } from 'sonner';
import { DEFAULT_QR_STYLE } from './qr-style-editor';
import { QRPreviewSkeleton } from './qr-preview-skeleton';
import type { QRStyleConfig } from '@/lib/qr-style';
import { normalizeQRStyle } from '@/lib/qr-style';
import { useQRStyleHistory } from '@/hooks/use-qr-style-history';
import { downscaleLogo } from '@/lib/image-downscale';
import { QR_CATEGORIES, QR_CATEGORY_GROUPS, buildQRPayload, categoryDisplayName } from '@/lib/qr-utils';
import { CategoryFields } from './category-fields';
import { IndustryTemplatePicker } from './industry-template-picker';
import { IndustryTemplateGuide } from './industry-template-guide';
import { TemplateSectionFields } from './template-section-fields';
import type { IndustryTemplate } from '@/lib/industry-templates';
import { stripMetaFields, buildLandingFromTemplate, getTemplateById, validateTemplateRequiredFields } from '@/lib/industry-templates';
import { defaultLeadForm } from '@/lib/landing-page';
import { AdvancedValues, emptyAdvanced } from './advanced-settings';
import { type LandingPageData, emptyLandingPage } from './landing-page-editor';
import { type ScheduleData } from './schedule-settings';
import { type GeofenceData } from './geofence-settings';
import type { AbTestData } from '@/lib/ab-routing';
import { type ScanNotifyValues } from './scan-notify-settings';
import { type PixelAnalyticsConfig } from './analytics-pixel-settings';
import { useLanguage } from '@/components/i18n/language-provider';
import { useUnsavedChangesGuard } from '@/hooks/use-unsaved-changes-guard';
import { buildQrFeaturePayload, useQrFeatureFields } from '@/hooks/use-qr-feature-fields';
import { LinkHubEditor, hubLinksValid, firstHubUrl } from './link-hub-editor';
import { QRQuickCreate } from './qr-quick-create';
import { isOnboardingQuery } from '@/lib/onboarding';
import { CreateStepTip } from './create-step-tip';
import { useScanBaseUrl } from '@/lib/use-scan-base-url';
import { resolveQrContentLength } from '@/lib/qr-preview-content';
import {
  clearQrCreateDraft,
  loadQrCreateDraft,
  saveQrCreateDraft,
  type QrCreateDraft,
} from '@/lib/qr-create-draft';

const CATEGORY_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  url: Globe, text: Type, vcard: Contact, wifi: Wifi, email: Mail, sms: MessageSquare, phone: Phone,
  location: MapPin, event: Calendar, menu: FileText, social: Share2, app: Download, pdf: FileText, file: FileText,
  whatsapp: MessageCircle, telegram: MessageCircle, discord: MessageCircle, instagram: Instagram,
  facebook: Facebook, tiktok: Share2, linkedin: Linkedin, youtube: Youtube, spotify: Music,
  zoom: Video, google_meet: Video, crypto: Bitcoin, link_hub: Link2, gs1: Package,
};

const STEP_KEYS = ['create.steps.start', 'create.steps.content', 'create.steps.design', 'create.steps.review'] as const;

const QRPreview = dynamic(
  () => import('./qr-preview').then((m) => ({ default: m.QRPreview })),
  { loading: () => <QRPreviewSkeleton /> },
);

const QrCreateStepDesign = dynamic(
  () => import('./qr-create-step-design').then((m) => ({ default: m.QrCreateStepDesign })),
  { loading: () => <QRPreviewSkeleton /> },
);

export function QRCreateWizard() {
  const { t } = useLanguage();
  const router = useRouter();
  const scanBaseUrl = useScanBaseUrl();
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
  const searchParams = useSearchParams();
  const onboarding = isOnboardingQuery(searchParams?.get('onboarding'));
  const [mode, setMode] = useState<'quick' | 'wizard'>(() =>
    searchParams?.get('quick') === '1' ? 'quick' : 'wizard'
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

  const applyDraft = useCallback((draft: QrCreateDraft) => {
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
  }, []);

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
    [resetStyleHistory, category]
  );

  const applyTemplate = useCallback((template: IndustryTemplate) => {
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
  }, []);

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
            (row: { id: string }) => row.id === styleTemplateId
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
    void import('./qr-preview');
    void import('./qr-create-step-design');
  }, [step]);

  useEffect(() => {
    if (!isGuest || !category) return;
    const timer = window.setTimeout(() => {
      saveQrCreateDraft(buildCurrentDraft());
    }, 400);
    return () => window.clearTimeout(timer);
  }, [isGuest, category, buildCurrentDraft]);

  const goToStep = (next: number) => {
    setStep(next);
  };

  const payloadData = () => stripMetaFields(qrData);

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

  const uploadLogo = async (file?: File | null): Promise<{ cloud_storage_path: string } | null> => {
    const toUpload = file ?? logoFile;
    if (!toUpload) return null;

    try {
      const formData = new FormData();
      formData.append('file', toUpload);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) return null;

      const { path } = await res.json();
      return { cloud_storage_path: path };
    } catch (e: any) {
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
        if (!logoPath) {
          toast.error(t('create.logoUploadFailed'));
        }
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
    } catch (e: any) {
      toast.error(t('bulk.somethingWrong'));
    } finally {
      setSaving(false);
    }
  };

  const steps = STEP_KEYS.map((key) => t(key));

  const canProceed = () => {
    if (step === 0) return !!category;
    if (step === 1) {
      if (!name.trim()) return false;
      if (category === 'link_hub') {
        return hubLinksValid(landingPage.hubLinks) && !!firstHubUrl(landingPage.hubLinks);
      }
      if (activeTemplate && !validateTemplateRequiredFields(activeTemplate, qrData)) return false;
      return !!buildQRPayload(category, payloadData()).trim();
    }
    return true;
  };

  if (mode === 'quick') {
    return (
      <QRQuickCreate
        onboarding={onboarding}
        onAdvanced={(data) => {
          if (data.url) {
            setCategory('url');
            setQrData({ url: data.url });
            setName(data.name || '');
            resetStyleHistory(data.style);
            setStep(1);
          }
          setMode('wizard');
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {session && (
        <div className="flex items-center gap-2 text-sm">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            ← {t('common.dashboard')}
          </Link>
        </div>
      )}

      {isGuest && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">{t('create.guestBannerTitle')}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{t('create.guestBannerDesc')}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                href={`/login?callbackUrl=${encodeURIComponent('/qr/create?restore=1')}`}
                onClick={saveGuestDraft}
              >
                <Button variant="outline" size="sm">{t('common.signIn')}</Button>
              </Link>
              <Button size="sm" onClick={redirectGuestToSignup}>
                {t('common.signUp')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">{t('create.title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('create.subtitle')}</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {steps.map((s: string, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`hidden text-sm sm:block ${i <= step ? 'font-medium' : 'text-muted-foreground'}`}>{s}</span>
            {i < steps.length - 1 && <div className={`h-px w-8 ${i < step ? 'bg-primary' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      <CreateStepTip step={step} />

      <div key={step} className="animate-in fade-in slide-in-from-right-2 duration-200">
          {step === 0 && (
            <div className="space-y-6">
              <IndustryTemplatePicker
                onApply={applyTemplate}
              />
              {QR_CATEGORY_GROUPS.map((group) => (
                <Card key={group.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="font-display text-base">{group.label}</CardTitle>
                    {'subtitle' in group && group.subtitle && (
                      <p className="text-xs text-muted-foreground">{group.subtitle}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {QR_CATEGORIES.filter((c) => c.group === group.id).map((cat) => {
                        const Icon = CATEGORY_ICONS[cat.id] ?? Globe;
                        const isPopular = 'popular' in cat && cat.popular;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            data-testid={`qr-category-${cat.id}`}
                            onClick={() => {
                              setActiveTemplate(null);
                              setCategory(cat.id);
                              setQrData({});
                              if (cat.id === 'link_hub') {
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
                            }}
                            className={`relative flex items-center gap-3 rounded-lg border p-4 text-left transition-all hover:shadow-sm ${
                              category === cat.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/50 hover:border-border'
                            }`}
                          >
                            {isPopular && (
                              <Badge className="absolute right-2 top-2 text-[10px] px-1.5 py-0">{t('create.popular')}</Badge>
                            )}
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                              category === cat.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                            }`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 pr-8">
                              <p className="font-medium text-sm">{cat.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2">{cat.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
              <p className="text-center text-xs text-muted-foreground">
                {t('create.templateHint')}
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="order-2 lg:order-1">
                <CardHeader>
                  <CardTitle className="font-display">{t('create.yourContent')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeTemplate && !templateGuideDismissed && (
                    <IndustryTemplateGuide
                      template={activeTemplate}
                      onDismiss={() => setTemplateGuideDismissed(true)}
                    />
                  )}
                  <div className="space-y-2">
                    <Label>{t('create.qrNameLabel')}</Label>
                    <Input
                      placeholder={t('create.qrNamePlaceholder')}
                      value={name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    />
                  </div>
                  {category === 'link_hub' ? (
                    <div className="space-y-4">
                      {activeTemplate ? (
                        <TemplateSectionFields
                          template={activeTemplate}
                          data={qrData}
                          onChange={(next) => {
                            setQrData(next);
                            if (activeTemplate.landingPage?.enabled) {
                              const built = buildLandingFromTemplate(activeTemplate, next);
                              setLandingPage((prev) => ({
                                ...prev,
                                title: built.title ?? prev.title,
                                subtitle: built.subtitle ?? prev.subtitle,
                              }));
                            }
                          }}
                        />
                      ) : null}
                      <LinkHubEditor
                        landing={landingPage}
                        qrName={name}
                        onChange={(next) => {
                          setLandingPage(next);
                          const url = firstHubUrl(next.hubLinks);
                          if (url) setQrData((prev) => ({ ...prev, url }));
                        }}
                      />
                    </div>
                  ) : activeTemplate ? (
                    <TemplateSectionFields
                      template={activeTemplate}
                      data={qrData}
                      onChange={(next) => {
                        setQrData(next);
                        if (activeTemplate.landingPage?.enabled) {
                          const built = buildLandingFromTemplate(activeTemplate, next);
                          setLandingPage((prev) => ({
                            ...prev,
                            title: built.title ?? prev.title,
                            subtitle: built.subtitle ?? prev.subtitle,
                          }));
                        }
                      }}
                    />
                  ) : (
                    <CategoryFields
                      category={category}
                      data={qrData}
                      onChange={setQrData}
                    />
                  )}
                </CardContent>
              </Card>
              <div className="order-1 h-fit lg:order-2 lg:sticky lg:top-24">
                <QRPreview
                  category={category}
                  qrData={qrData}
                  style={style}
                  logoPreview={logoPreview}
                  printLayout={activeTemplate?.printLayout}
                  industryTemplateId={activeTemplate?.id}
                  accentColor={landingPage.accentColor}
                />
              </div>
            </div>
          )}

          {step === 2 && (
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
              onTemplateLogoApply={(path) => {
                setStoredLogoPath(path);
                if (path) setLogoPreview(path);
              }}
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
          )}

          {step === 3 && (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="order-2 lg:order-1">
                <CardHeader>
                  <CardTitle className="font-display">{t('create.summary')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('create.reviewName')}</span>
                    <span className="font-medium">{name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('create.reviewCategory')}</span>
                    <Badge variant="outline">{categoryDisplayName(category)}</Badge>
                  </div>
                  {style.frameStyle !== 'none' && style.frameText?.trim() && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t('create.reviewFrameLabel')}</span>
                      <span className="text-sm font-medium">{style.frameText}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('create.reviewLogo')}</span>
                    <span className="text-sm">{logoFile ? logoFile.name : t('create.none')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('create.reviewForeground')}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded border" style={{ backgroundColor: style?.fgColor ?? '#000' }} />
                      <span className="font-mono text-xs">{style?.fgColor ?? '#000'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('create.reviewBackground')}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded border" style={{ backgroundColor: style?.bgColor ?? '#FFF' }} />
                      <span className="font-mono text-xs">{style?.bgColor ?? '#FFF'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="order-1 h-fit lg:order-2 lg:sticky lg:top-24">
                <QRPreview
                  category={category}
                  qrData={qrData}
                  style={style}
                  logoPreview={logoPreview}
                  showExtras
                  printLayout={activeTemplate?.printLayout}
                  industryTemplateId={activeTemplate?.id}
                  accentColor={landingPage.accentColor}
                />
              </div>
            </div>
          )}
        </div>

      {/* Navigation — sticky so Next/Create stays visible */}
      <div className="sticky bottom-0 z-40 -mx-4 mt-6 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80 lg:-mx-0 lg:rounded-xl lg:border lg:shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={() => goToStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> {t('create.back')}
          </Button>

          {step < 3 ? (
            <Button
              onClick={() => goToStep(Math.min(3, step + 1))}
              disabled={!canProceed()}
              className="gap-2 shrink-0"
            >
              {t('create.next')} <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSave} loading={saving} className="gap-2 shrink-0">
              <CheckCircle2 className="h-4 w-4" />
              {isGuest ? t('create.signUpToSave') : t('create.createQr')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
