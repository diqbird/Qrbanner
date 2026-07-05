'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { OnboardingBannerSteps } from './onboarding-banner-steps';
import { OnboardingBannerActions } from './onboarding-banner-actions';

const STORAGE_KEY = 'qrb_onboarding_dismissed';

export function OnboardingBanner({ show }: { show: boolean }) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!show) return;
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (!dismissed) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, [show]);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-background overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold">{t('onboarding.title')}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t('onboarding.subtitle')}</p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="text-muted-foreground hover:text-foreground"
            aria-label={t('common.dismissAria')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <OnboardingBannerSteps activeStep={activeStep} onSelectStep={setActiveStep} />
        <OnboardingBannerActions activeStep={activeStep} onDismiss={dismiss} />
      </CardContent>
    </Card>
  );
}
