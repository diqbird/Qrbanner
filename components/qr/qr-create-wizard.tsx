'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/components/i18n/language-provider';
import { isOnboardingQuery } from '@/lib/onboarding';
import { useQrCreateForm } from '@/hooks/use-qr-create-form';
import { QRQuickCreate } from './qr-quick-create';
import { CreateStepTip } from './create-step-tip';
import { QrCreateStepStart } from './qr-create-step-start';
import { QrCreateStepContent } from './qr-create-step-content';
import { QrCreateStepReview } from './qr-create-step-review';
import { QrCreateGuestBanner } from './qr-create-guest-banner';
import { QrCreateStepIndicator } from './qr-create-step-indicator';
import { QrCreateWizardFooter } from './qr-create-wizard-footer';
import { QrCreateDesignStep } from './qr-create-design-step';
import { QrCreateTrustStrip } from './qr-create-trust-strip';
import { useStudioCreateConfig } from '@/components/studio/studio-create-context';
import { StudioQuotaBanner } from '@/components/studio/studio-quota-banner';

export function QRCreateWizard() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const studio = useStudioCreateConfig();
  const onboarding = isOnboardingQuery(searchParams?.get('onboarding'));
  const form = useQrCreateForm();
  const { session, isGuest, mode, step, enterWizardFromQuick, saveGuestDraft, redirectGuestToSignup } = form;

  if (mode === 'quick' && !studio) {
    return (
      <QRQuickCreate
        onboarding={onboarding}
        onAdvanced={enterWizardFromQuick}
      />
    );
  }

  return (
    <div className="space-y-6">
      {session && !studio && (
        <div className="flex items-center gap-2 text-sm">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            ← {t('common.dashboard')}
          </Link>
        </div>
      )}

      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          {studio ? t('studio.createTitle') : t('create.title')}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {studio ? t('studio.createSubtitle') : t('create.subtitle')}
        </p>
      </div>

      {studio ? <StudioQuotaBanner remaining={studio.qrRemaining} max={studio.maxQr} /> : null}
      {!studio ? <QrCreateTrustStrip /> : null}
      <QrCreateStepIndicator step={step} />
      <CreateStepTip step={step} />

      <div key={step} className="animate-in fade-in slide-in-from-right-2 duration-200">
        {step === 0 && <QrCreateStepStart form={form} />}
        {step === 1 && <QrCreateStepContent form={form} />}
        {step === 2 && <QrCreateDesignStep form={form} />}
        {step === 3 && <QrCreateStepReview form={form} />}
      </div>

      {isGuest && !studio && (
        <QrCreateGuestBanner
          saveGuestDraft={saveGuestDraft}
          redirectGuestToSignup={redirectGuestToSignup}
        />
      )}

      <QrCreateWizardFooter
        step={step}
        isGuest={isGuest}
        saving={form.saving}
        canProceed={form.canProceed}
        getBlockers={form.getBlockers}
        goToStep={form.goToStep}
        handleSave={form.handleSave}
      />
    </div>
  );
}
