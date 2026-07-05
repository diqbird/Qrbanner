'use client';

import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import { useQrCreateFormTemplateLogo } from '@/hooks/use-qr-create-form-template-logo';
import { useQrCreateFormWizardSave } from '@/hooks/use-qr-create-form-wizard-save';
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
  const templateLogo = useQrCreateFormTemplateLogo({ core, featureFields, searchParams, t });

  const wizardSave = useQrCreateFormWizardSave({
    core,
    featureFields,
    advanced,
    payloadData,
    session,
    redirectGuestToSignup,
    router,
    uploadLogo: templateLogo.uploadLogo,
    t,
    enterWizardFromQuickInner: templateLogo.enterWizardFromQuick,
  });

  return {
    goToStep: wizardSave.goToStep,
    applyTemplate: templateLogo.applyTemplate,
    selectCategory: templateLogo.selectCategory,
    handleLogoChange: templateLogo.handleLogoChange,
    applyTemplateLogo: templateLogo.applyTemplateLogo,
    handleSave: wizardSave.handleSave,
    canProceed: wizardSave.canProceed,
    enterWizardFromQuick: wizardSave.enterWizardFromQuick,
  };
}
