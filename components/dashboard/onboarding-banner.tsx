'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, PlusCircle, LayoutTemplate, BarChart3, Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { demoBookingUrl } from '@/lib/site-contact';

const STORAGE_KEY = 'qrb_onboarding_dismissed';

const STEP_ICONS = [LayoutTemplate, Sparkles, PlusCircle, BarChart3];
const STEP_KEYS = [
  { title: 'onboarding.step1Title', desc: 'onboarding.step1Desc', href: '/qr/create?quick=1' },
  { title: 'onboarding.step2Title', desc: 'onboarding.step2Desc', href: '/qr/create?quick=1' },
  { title: 'onboarding.step3Title', desc: 'onboarding.step3Desc', href: '/qr/create?quick=1' },
  { title: 'onboarding.step4Title', desc: 'onboarding.step4Desc', href: '/dashboard' },
] as const;

export function OnboardingBanner({ show }: { show: boolean }) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const demoUrl = demoBookingUrl();

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

  const current = STEP_KEYS[activeStep];
  const progress = ((activeStep + 1) / STEP_KEYS.length) * 100;

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

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={activeStep + 1}
            aria-valuemin={1}
            aria-valuemax={STEP_KEYS.length}
          />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEP_KEYS.map((step, i) => {
            const Icon = STEP_ICONS[i];
            const isActive = i === activeStep;
            return (
              <button
                key={step.title}
                type="button"
                onClick={() => setActiveStep(i)}
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

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link href={current.href}>
            <Button className="gap-2">
              {activeStep === STEP_KEYS.length - 1 ? t('onboarding.ctaAnalytics') : t('onboarding.cta')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={demoUrl}>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              {t('onboarding.watchDemo')}
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={dismiss}>
            {t('onboarding.dismiss')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
