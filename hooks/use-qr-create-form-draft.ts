'use client';

import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useQrCreateDraftBridge } from '@/hooks/use-qr-create-draft-bridge';
import { useQrCreateDraftState } from '@/hooks/use-qr-create-draft-state';
import type { QrCreateDraftSetters, QrCreateDraftValues } from '@/lib/qr-create-draft-state-types';

type DraftBridgeArgs = {
  draftValues: QrCreateDraftValues;
  draftSettersInput: QrCreateDraftSetters;
  isGuest: boolean;
  category: string;
  authStatus: string;
  restoreParam: string | null;
  router: AppRouterInstance;
  t: (key: string) => string;
};

export function useQrCreateFormDraft({
  draftValues,
  draftSettersInput,
  isGuest,
  category,
  authStatus,
  restoreParam,
  router,
  t,
}: DraftBridgeArgs) {
  const { draftState, draftSetters } = useQrCreateDraftState(draftValues, draftSettersInput);

  const { redirectGuestToSignup, saveGuestDraft } = useQrCreateDraftBridge({
    draftState,
    draftSetters,
    isGuest,
    category,
    authStatus,
    restoreParam,
    router,
    t,
  });

  return { redirectGuestToSignup, saveGuestDraft };
}
