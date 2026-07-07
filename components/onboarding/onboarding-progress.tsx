'use client';

import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';

const STEP_KEYS = [
  'onboarding.flowStep1',
  'onboarding.flowStep2',
  'onboarding.flowStep3',
] as const;

export function OnboardingProgress({ step }: { step: 1 | 2 | 3 }) {
  const { t, locale } = useLanguage();

  return (
    <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">{t('onboarding.flowTitle')}</p>
        <span className="text-xs text-muted-foreground">{t('onboarding.flowEta')}</span>
      </div>
      <ol className="mt-3 grid gap-2 sm:grid-cols-3">
        {STEP_KEYS.map((key, i) => {
          const n = (i + 1) as 1 | 2 | 3;
          const done = n < step;
          const active = n === step;
          return (
            <li
              key={key}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
                active
                  ? 'border-primary bg-background font-medium shadow-sm'
                  : done
                    ? 'border-primary/30 text-primary'
                    : 'border-border/50 text-muted-foreground'
              }`}
            >
              {done ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
              ) : (
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    active ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  {formatLocaleNumber(n, locale)}
                </span>
              )}
              <span>{t(key)}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
