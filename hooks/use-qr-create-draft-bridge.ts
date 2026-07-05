'use client';

import { useCallback } from 'react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import {
  applyQrCreateDraft,
  buildQrCreateDraft,
  type QrCreateDraftSetters,
  type QrCreateDraftState,
} from '@/lib/qr-create-form-draft';
import { useQrCreateDraftSync } from '@/hooks/use-qr-create-draft-sync';

export function useQrCreateDraftBridge({
  draftState,
  draftSetters,
  isGuest,
  category,
  authStatus,
  restoreParam,
  router,
  t,
}: {
  draftState: QrCreateDraftState;
  draftSetters: QrCreateDraftSetters;
  isGuest: boolean;
  category: string;
  authStatus: string;
  restoreParam: string | null;
  router: AppRouterInstance;
  t: (key: string, vars?: Record<string, string | number>) => string;
}) {
  const buildCurrentDraft = useCallback(
    () => buildQrCreateDraft(draftState),
    [draftState],
  );

  const applyDraft = useCallback(
    (draft: ReturnType<typeof buildCurrentDraft>) => {
      applyQrCreateDraft(draft, draftSetters);
    },
    [draftSetters],
  );

  const { redirectGuestToSignup, saveGuestDraft } = useQrCreateDraftSync({
    isGuest,
    category,
    authStatus,
    restoreParam,
    buildCurrentDraft,
    applyDraft,
    router,
    t,
  });

  return { buildCurrentDraft, applyDraft, redirectGuestToSignup, saveGuestDraft };
}
