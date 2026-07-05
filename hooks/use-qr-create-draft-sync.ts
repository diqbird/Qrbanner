'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'sonner';
import {
  loadQrCreateDraft,
  saveQrCreateDraft,
  type QrCreateDraft,
} from '@/lib/qr-create-draft';

export function useQrCreateDraftSync({
  isGuest,
  category,
  authStatus,
  restoreParam,
  buildCurrentDraft,
  applyDraft,
  router,
  t,
}: {
  isGuest: boolean;
  category: string;
  authStatus: string;
  restoreParam: string | null;
  buildCurrentDraft: () => QrCreateDraft;
  applyDraft: (draft: QrCreateDraft) => void;
  router: AppRouterInstance;
  t: (key: string) => string;
}) {
  const draftRestored = useRef(false);

  const redirectGuestToSignup = useCallback(() => {
    saveQrCreateDraft({ ...buildCurrentDraft(), step: 3 });
    const callback = encodeURIComponent('/qr/create?restore=1');
    router.push(`/signup?callbackUrl=${callback}`);
  }, [buildCurrentDraft, router]);

  const saveGuestDraft = useCallback(() => {
    if (!isGuest || !category) return;
    saveQrCreateDraft(buildCurrentDraft());
  }, [isGuest, category, buildCurrentDraft]);

  useEffect(() => {
    if (draftRestored.current || authStatus !== 'authenticated') return;
    if (restoreParam !== '1') return;
    const draft = loadQrCreateDraft();
    if (!draft) return;
    draftRestored.current = true;
    applyDraft(draft);
    toast.success(t('create.draftRestored'));
    router.replace('/qr/create');
  }, [authStatus, restoreParam, applyDraft, router, t]);

  useEffect(() => {
    if (!isGuest || !category) return;
    const timer = window.setTimeout(() => {
      saveQrCreateDraft(buildCurrentDraft());
    }, 400);
    return () => window.clearTimeout(timer);
  }, [isGuest, category, buildCurrentDraft]);

  return { redirectGuestToSignup, saveGuestDraft };
}
