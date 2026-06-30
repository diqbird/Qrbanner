'use client';

import { useEffect, useState } from 'react';
import { Lightbulb, X } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';

const STORAGE_KEY = 'qrb_create_tips_hidden';
const TIP_KEYS = ['createTips.step0', 'createTips.step1', 'createTips.step2', 'createTips.step3'] as const;

export function CreateStepTip({ step }: { step: number }) {
  const { t } = useLanguage();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) setHidden(true);
    } catch {
      /* ignore */
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setHidden(true);
  };

  if (hidden || step < 0 || step >= TIP_KEYS.length) return null;

  return (
    <div
      className="flex items-start gap-3 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3"
      role="note"
      aria-label={t('createTips.ariaLabel')}
    >
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
      <p className="flex-1 text-sm text-muted-foreground leading-relaxed">{t(TIP_KEYS[step])}</p>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 text-muted-foreground hover:text-foreground"
        aria-label={t('createTips.dismiss')}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
