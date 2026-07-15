'use client';

import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { QR_CREATE_STEP_KEYS } from '@/lib/qr-category-icons';

export function QrCreateStepIndicator({ step }: { step: number }) {
  const { t, locale } = useLanguage();
  const steps = QR_CREATE_STEP_KEYS.map((key) => t(key));

  return (
    <div className="surface-3d flex flex-wrap items-center gap-2 rounded-2xl border border-white/30 bg-card/70 px-3 py-2.5 backdrop-blur-md dark:border-white/10">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
              i <= step
                ? 'bg-primary text-primary-foreground shadow-[0_10px_22px_-10px_hsl(var(--primary)/0.8)]'
                : 'border border-white/20 bg-muted/60 text-muted-foreground'
            }`}
          >
            {i < step ? <CheckCircle2 className="h-4 w-4" /> : formatLocaleNumber(i + 1, locale)}
          </div>
          <span
            className={`max-w-[4.5rem] truncate text-[10px] leading-tight sm:max-w-none sm:text-sm ${
              i <= step ? 'font-medium' : 'text-muted-foreground'
            }`}
          >
            {s}
          </span>
          {i < steps.length - 1 && (
            <div className={`h-px w-6 sm:w-8 ${i < step ? 'bg-primary/70' : 'bg-border/70'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
