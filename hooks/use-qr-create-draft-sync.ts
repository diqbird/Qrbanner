'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'sonner';
import {
  loadQrCreateDraft,
  saveQrCreateDraft,
  markQrCreateAutosave,
  type QrCreateDraft,
} from '@/lib/qr-create-draft';

export function useQrCreateDraftSync({
  isGuest,
  category,
  authStatus,
  restoreParam,
  autosaveParam,
  buildCurrentDraft,
  applyDraft,
  router,
  t,
}: {
  isGuest: boolean;
  category: string;
  authStatus: string;
  restoreParam: string | null;
  autosaveParam: string | null;
  buildCurrentDraft: () => QrCreateDraft;
  applyDraft: (draft: QrCreateDraft) => void;
  router: AppRouterInstance;
  t: (key: string) => string;
}) {
  const draftRestored = useRef(false);

  const redirectGuestToSignup = useCallback(() => {
    saveQrCreateDraft({ ...buildCurrentDraft(), step: 3 });
    markQrCreateAutosave();
    const callback = encodeURIComponent('/qr/create?restore=1');
    router.push(`/signup?callbackUrl=${callback}`);
  }, [buildCurrentDraft, router]);

  const saveGuestDraft = useCallback(() => {
    if (!isGuest || !category) return;
    saveQrCreateDraft(buildCurrentDraft());
    markQrCreateAutosave();
  }, [isGuest, category, buildCurrentDraft]);

  useEffect(() => {
    if (draftRestored.current || authStatus !== 'authenticated') return;
    const shouldRestore = restoreParam === '1' || autosaveParam === '1';
    if (!shouldRestore) return;
    const draft = loadQrCreateDraft();
    if (!draft) return;
    draftRestored.current = true;
    applyDraft(draft);
    if (restoreParam === '1') {
      toast.success(t('create.draftRestored'));
    }
    // Keep autosave=1 after paint so remounts can re-hydrate from sessionStorage.
    if (restoreParam === '1') {
      let cancelled = false;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (!cancelled) router.replace('/qr/create?autosave=1');
        });
      });
      return () => {
        cancelled = true;
      };
    }
  }, [authStatus, restoreParam, autosaveParam, applyDraft, router, t]);

  useEffect(() => {
    if (!isGuest || !category) return;
    const timer = window.setTimeout(() => {
      saveQrCreateDraft(buildCurrentDraft());
    }, 400);
    return () => window.clearTimeout(timer);
  }, [isGuest, category, buildCurrentDraft]);

  return { redirectGuestToSignup, saveGuestDraft };
}
