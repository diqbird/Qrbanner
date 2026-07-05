'use client';

import { useCallback } from 'react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { QRStyleConfig } from '@/lib/qr-style';
import { useQrCreateSave } from '@/hooks/use-qr-create-save';
import { createCanProceedCreateStep } from '@/hooks/use-qr-create-wizard-effects';
import type { QrFeatureFields } from '@/hooks/use-qr-feature-fields';
import type { useQrCreateCoreState } from '@/hooks/use-qr-create-core-state';

type Core = ReturnType<typeof useQrCreateCoreState>;

export function useQrCreateFormWizardSave({
  core,
  featureFields,
  advanced,
  payloadData,
  session,
  redirectGuestToSignup,
  router,
  uploadLogo,
  t,
  enterWizardFromQuickInner,
}: {
  core: Core;
  featureFields: QrFeatureFields;
  advanced: QrFeatureFields['advanced'];
  payloadData: () => Record<string, string>;
  session: { user?: unknown } | null | undefined;
  redirectGuestToSignup: () => void;
  router: AppRouterInstance;
  uploadLogo: (file: File) => Promise<{ cloud_storage_path?: string } | null | undefined>;
  t: (key: string) => string;
  enterWizardFromQuickInner: (data: { url?: string; name?: string; style?: Partial<QRStyleConfig> }) => void;
}) {
  const {
    step,
    category,
    name,
    qrData,
    style,
    logoFile,
    logoPreview,
    storedLogoPath,
    activeTemplate,
    setStep,
    setSaving,
    setMode,
  } = core;

  const { landingPage } = featureFields;

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

  return { goToStep, handleSave, canProceed, enterWizardFromQuick };
}
