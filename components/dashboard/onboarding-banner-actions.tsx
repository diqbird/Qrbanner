'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { demoBookingUrl } from '@/lib/site-contact';
import { ONBOARDING_STEP_KEYS } from './onboarding-banner-steps';

type OnboardingBannerActionsProps = {
  activeStep: number;
  onDismiss: () => void;
};

export function OnboardingBannerActions({ activeStep, onDismiss }: OnboardingBannerActionsProps) {
  const { t } = useLanguage();
  const demoUrl = demoBookingUrl();
  const current = ONBOARDING_STEP_KEYS[activeStep];

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <Link href={current.href}>
        <Button className="gap-2">
          {activeStep === ONBOARDING_STEP_KEYS.length - 1 ? t('onboarding.ctaAnalytics') : t('onboarding.cta')}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
      <Link href={demoUrl}>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          {t('onboarding.watchDemo')}
        </Button>
      </Link>
      <Button variant="ghost" size="sm" onClick={onDismiss}>
        {t('onboarding.dismiss')}
      </Button>
    </div>
  );
}
