'use client';

import { LayoutTemplate, Sparkles, PlusCircle, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { ONBOARDING_CREATE_URL } from '@/lib/onboarding';

export const ONBOARDING_STEP_ICONS = [LayoutTemplate, Sparkles, PlusCircle, BarChart3];

export const ONBOARDING_STEP_KEYS = [
  { title: 'onboarding.step1Title', desc: 'onboarding.step1Desc', href: ONBOARDING_CREATE_URL },
  { title: 'onboarding.step2Title', desc: 'onboarding.step2Desc', href: ONBOARDING_CREATE_URL },
  { title: 'onboarding.step3Title', desc: 'onboarding.step3Desc', href: ONBOARDING_CREATE_URL },
  { title: 'onboarding.step4Title', desc: 'onboarding.step4Desc', href: '/dashboard' },
] as const;

type OnboardingBannerStepsProps = {
  activeStep: number;
  onSelectStep: (index: number) => void;
};

export function OnboardingBannerSteps({ activeStep, onSelectStep }: OnboardingBannerStepsProps) {
  const { t } = useLanguage();
  const progress = ((activeStep + 1) / ONBOARDING_STEP_KEYS.length) * 100;

  return (
    <>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={activeStep + 1}
          aria-valuemin={1}
          aria-valuemax={ONBOARDING_STEP_KEYS.length}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ONBOARDING_STEP_KEYS.map((step, i) => {
          const Icon = ONBOARDING_STEP_ICONS[i];
          const isActive = i === activeStep;
          return (
            <button
              key={step.title}
              type="button"
              onClick={() => onSelectStep(i)}
              className={`rounded-lg border p-4 text-left transition-colors ${
                isActive
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : 'border-border/50 bg-card/80 hover:border-primary/30'
              }`}
            >
              <Icon className={`mb-2 h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className="text-sm font-medium">{t(step.title)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t(step.desc)}</p>
            </button>
          );
        })}
      </div>
    </>
  );
}
