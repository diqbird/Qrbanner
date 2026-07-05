'use client';

import { useCallback } from 'react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import type { QRStyleConfig } from '@/lib/qr-style';
import { useQrCreateTemplateActions } from '@/hooks/use-qr-create-template-actions';
import { useQrCreateLogo } from '@/hooks/use-qr-create-logo';
import { useQrCreateUrlParams } from '@/hooks/use-qr-create-url-params';
import { useQrCreateSave } from '@/hooks/use-qr-create-save';
import {
  createCanProceedCreateStep,
  useQrCreateWizardEffects,
} from '@/hooks/use-qr-create-wizard-effects';
import type { QrFeatureFields } from '@/hooks/use-qr-feature-fields';
import type { useQrCreateCoreState } from '@/hooks/use-qr-create-core-state';

type Core = ReturnType<typeof useQrCreateCoreState>;

export function useQrCreateFormActions({
  core,
  featureFields,
  advanced,
  payloadData,
  session,
  redirectGuestToSignup,
  router,
  searchParams,
  t,
}: {
  core: Core;
  featureFields: QrFeatureFields;
  advanced: QrFeatureFields['advanced'];
  payloadData: () => Record<string, string>;
  session: { user?: unknown } | null | undefined;
  redirectGuestToSignup: () => void;
  router: AppRouterInstance;
  searchParams: ReadonlyURLSearchParams;
  t: (key: string) => string;
}) {
  const {
    step,
    category,
    name,
    qrData,
    style,
    resetHistory: resetStyleHistory,
    setCategory,
    setQrData,
    setName,
    setStep,
    setActiveTemplate,
    setTemplateGuideDismissed,
    setStoredLogoPath,
    setLogoPreview,
    setLogoFile,
    logoFile,
    logoPreview,
    storedLogoPath,
    activeTemplate,
    setSaving,
    setMode,
  } = core;

  const { landingPage, setLandingEnabled, setLandingPage } = featureFields;

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

  const goToStep = useCallback((next: number) => setStep(next), [setStep]);

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
    [enterWizardFromQuickInner, setMode],
  );

  return {
    goToStep,
    applyTemplate,
    selectCategory,
    handleLogoChange,
    applyTemplateLogo,
    handleSave,
    canProceed,
    enterWizardFromQuick,
  };
}
