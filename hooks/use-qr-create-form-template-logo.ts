'use client';

import type { ReadonlyURLSearchParams } from 'next/navigation';
import { useQrCreateTemplateActions } from '@/hooks/use-qr-create-template-actions';
import { useQrCreateLogo } from '@/hooks/use-qr-create-logo';
import { useQrCreateUrlParams } from '@/hooks/use-qr-create-url-params';
import { useQrCreateWizardEffects } from '@/hooks/use-qr-create-wizard-effects';
import type { QrFeatureFields } from '@/hooks/use-qr-feature-fields';
import type { useQrCreateCoreState } from '@/hooks/use-qr-create-core-state';

type Core = ReturnType<typeof useQrCreateCoreState>;

export function useQrCreateFormTemplateLogo({
  core,
  featureFields,
  searchParams,
  t,
}: {
  core: Core;
  featureFields: QrFeatureFields;
  searchParams: ReadonlyURLSearchParams;
  t: (key: string) => string;
}) {
  const {
    step,
    category,
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
  } = core;

  const { setLandingEnabled, setLandingPage } = featureFields;

  const templateActions = useQrCreateTemplateActions({
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

  const logo = useQrCreateLogo({
    logoFile,
    setLogoFile,
    setLogoPreview,
    setStoredLogoPath,
  });

  useQrCreateUrlParams({
    searchParams,
    applyTemplate: templateActions.applyTemplate,
    applyStyleTemplateFromApi: templateActions.applyStyleTemplateFromApi,
    setActiveTemplate,
    setCategory,
    setStep,
  });

  useQrCreateWizardEffects(step);

  return {
    ...templateActions,
    handleLogoChange: logo.handleLogoChange,
    applyTemplateLogo: logo.applyTemplateLogo,
    uploadLogo: logo.uploadLogo,
  };
}
