'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { QR_CREATE_STEP_KEYS } from '@/lib/qr-category-icons';
import { useScanBaseUrl } from '@/lib/use-scan-base-url';
import { resolveQrContentLength } from '@/lib/qr-preview-content';
import { isOnboardingQuery } from '@/lib/onboarding';
import { useQrCreateForm } from '@/hooks/use-qr-create-form';
import { QRQuickCreate } from './qr-quick-create';
import { CreateStepTip } from './create-step-tip';
import { QrCreateStepStart } from './qr-create-step-start';
import { QrCreateStepContent } from './qr-create-step-content';
import { QrCreateStepReview } from './qr-create-step-review';
import { QRPreviewSkeleton } from './qr-preview-skeleton';

const QrCreateStepDesign = dynamic(
  () => import('./qr-create-step-design').then((m) => ({ default: m.QrCreateStepDesign })),
  { loading: () => <QRPreviewSkeleton /> },
);

export function QRCreateWizard() {
  const { t } = useLanguage();
  const scanBaseUrl = useScanBaseUrl();
  const searchParams = useSearchParams();
  const onboarding = isOnboardingQuery(searchParams?.get('onboarding'));
  const form = useQrCreateForm();
  const {
    session,
    isGuest,
    mode,
    step,
    goToStep,
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
    saving,
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
    handleSave,
    canProceed,
    redirectGuestToSignup,
    saveGuestDraft,
    enterWizardFromQuick,
  } = form;

  const steps = QR_CREATE_STEP_KEYS.map((key) => t(key));

  if (mode === 'quick') {
    return (
      <QRQuickCreate
        onboarding={onboarding}
        onAdvanced={enterWizardFromQuick}
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

      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`hidden text-sm sm:block ${i <= step ? 'font-medium' : 'text-muted-foreground'}`}>
              {s}
            </span>
            {i < steps.length - 1 && (
              <div className={`h-px w-8 ${i < step ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      <CreateStepTip step={step} />

      <div key={step} className="animate-in fade-in slide-in-from-right-2 duration-200">
        {step === 0 && <QrCreateStepStart form={form} />}
        {step === 1 && <QrCreateStepContent form={form} />}
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
        )}
        {step === 3 && <QrCreateStepReview form={form} />}
      </div>

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
              className="shrink-0 gap-2"
            >
              {t('create.next')} <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSave} loading={saving} className="shrink-0 gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {isGuest ? t('create.signUpToSave') : t('create.createQr')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
