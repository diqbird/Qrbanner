'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { stripMetaFields } from '@/lib/industry-templates';
import { useLanguage } from '@/components/i18n/language-provider';
import { useQrCreateWizardGuard } from '@/hooks/use-qr-create-wizard-guard';
import { useQrCreateCoreState } from '@/hooks/use-qr-create-core-state';
import { useQrCreateFormDraft } from '@/hooks/use-qr-create-form-draft';
import { useQrCreateFormActions } from '@/hooks/use-qr-create-form-actions';
import { buildQrCreateDraftSetters, buildQrCreateDraftValues } from '@/lib/qr-create-draft-input';
import { extractQrCreateFeatureSlice } from '@/lib/qr-create-feature-slice';
import { buildQrCreateFormReturn } from '@/lib/qr-create-form-return';

export function useQrCreateForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status: authStatus } = useSession() || {};
  const isGuest = authStatus === 'unauthenticated';

  const core = useQrCreateCoreState();
  const { featureFields, ...coreRest } = core;
  const featureSlice = extractQrCreateFeatureSlice(featureFields);

  useQrCreateWizardGuard({
    mode: coreRest.mode,
    saving: coreRest.saving,
    step: coreRest.step,
    category: coreRest.category,
    name: coreRest.name,
    qrData: coreRest.qrData,
    logoFile: coreRest.logoFile,
    logoPreview: coreRest.logoPreview,
  });

  const payloadData = useCallback(() => stripMetaFields(coreRest.qrData), [coreRest.qrData]);

  const { redirectGuestToSignup, saveGuestDraft } = useQrCreateFormDraft({
    draftValues: buildQrCreateDraftValues(coreRest, featureSlice),
    draftSettersInput: buildQrCreateDraftSetters(core, featureFields),
    isGuest,
    category: coreRest.category,
    authStatus,
    restoreParam: searchParams.get('restore'),
    router,
    t,
  });

  const actions = useQrCreateFormActions({
    core,
    featureFields,
    advanced: featureSlice.advanced,
    payloadData,
    session,
    redirectGuestToSignup,
    router,
    searchParams,
    t,
  });

  return buildQrCreateFormReturn({
    session,
    isGuest,
    coreRest,
    featureFields,
    featureSlice,
    actions,
    payloadData,
    redirectGuestToSignup,
    saveGuestDraft,
  });
}

export type QrCreateFormState = ReturnType<typeof useQrCreateForm>;