'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';

export function QrCreateWizardFooter({
  step,
  isGuest,
  saving,
  canProceed,
  goToStep,
  handleSave,
}: {
  step: number;
  isGuest: boolean;
  saving: boolean;
  canProceed: () => boolean;
  goToStep: (next: number) => void;
  handleSave: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="sticky bottom-0 z-40 -mx-4 mt-6 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80 lg:-mx-0 lg:rounded-xl lg:border lg:shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => goToStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> {t('create.back')}
        </Button>

        {step < 3 ? (
          <Button
            onClick={() => goToStep(Math.min(3, step + 1))}
            disabled={!canProceed()}
            className="shrink-0 gap-2"
          >
            {t('create.next')} <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSave} loading={saving} className="shrink-0 gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {isGuest ? t('create.signUpToSave') : t('create.createQr')}
          </Button>
        )}
      </div>
    </div>
  );
}
