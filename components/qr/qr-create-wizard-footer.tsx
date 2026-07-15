'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { consumeQrCreateAutosave, loadQrCreateDraft } from '@/lib/qr-create-draft';

function localizeBlocker(t: (key: string) => string, blocker: string): string {
  const key = `create.blockers.${blocker}`;
  const translated = t(key);
  return translated !== key ? translated : blocker;
}

export function QrCreateWizardFooter({
  step,
  isGuest,
  saving,
  canProceed,
  getBlockers,
  goToStep,
  handleSave,
}: {
  step: number;
  isGuest: boolean;
  saving: boolean;
  canProceed: () => boolean;
  getBlockers: () => string[];
  goToStep: (next: number) => void;
  handleSave: () => void | Promise<void>;
}) {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const autosaveStarted = useRef(false);
  const ready = canProceed();
  const blockers = !ready && step <= 1 ? getBlockers() : [];

  useEffect(() => {
    if (autosaveStarted.current) return;
    if (step !== 3 || isGuest || saving) return;
    // Wait until draft hydrate finishes (empty form → restored step 3).
    const draft = loadQrCreateDraft();
    if (draft && draft.step === 3 && !ready) return;
    const wantsAutosave =
      searchParams?.get('autosave') === '1' || consumeQrCreateAutosave();
    if (!wantsAutosave) return;
    autosaveStarted.current = true;
    const timer = window.setTimeout(() => {
      void handleSave();
    }, 180);
    return () => window.clearTimeout(timer);
  }, [step, isGuest, saving, searchParams, handleSave, ready]);

  return (
    <div className="surface-3d sticky bottom-0 z-40 -mx-4 mt-6 border border-white/30 bg-card/80 px-4 py-3 backdrop-blur-2xl dark:border-white/10 lg:-mx-0 lg:rounded-2xl">
      {!ready && blockers.length > 0 ? (
        <p className="mb-2 text-xs text-muted-foreground" role="status">
          {t('create.missingFields')}:{' '}
          {blockers.map((b) => localizeBlocker(t, b)).join(', ')}
        </p>
      ) : null}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => goToStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="gap-2 rounded-xl border-white/25 bg-background/40"
        >
          <ArrowLeft className="h-4 w-4" /> {t('create.back')}
        </Button>

        {step < 3 ? (
          <Button
            onClick={() => goToStep(Math.min(3, step + 1))}
            disabled={!ready}
            className="shrink-0 gap-2 rounded-xl shadow-[0_14px_34px_-14px_hsl(var(--primary)/0.7)]"
          >
            {t('create.next')} <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={() => void handleSave()}
            loading={saving}
            className="shrink-0 gap-2 rounded-xl shadow-[0_14px_34px_-14px_hsl(var(--primary)/0.7)]"
          >
            <CheckCircle2 className="h-4 w-4" />
            {isGuest ? t('create.signUpToSave') : t('create.createQr')}
          </Button>
        )}
      </div>
    </div>
  );
}
