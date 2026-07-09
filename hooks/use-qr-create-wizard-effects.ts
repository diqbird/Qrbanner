'use client';

import { useEffect } from 'react';
import type { IndustryTemplate } from '@/lib/industry-templates';
import type { LandingPageData } from '@/lib/landing-page';
import { canProceedCreateStep, getCreateStepBlockers } from '@/lib/qr-create-can-proceed';

export function useQrCreateWizardEffects(step: number) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    if (step < 1) return;
    void import('@/components/qr/qr-preview');
    void import('@/components/qr/qr-create-step-design');
  }, [step]);
}

type ProceedArgs = {
  step: number;
  category: string;
  name: string;
  qrData: Record<string, string>;
  payloadData: () => Record<string, string>;
  activeTemplate: IndustryTemplate | null;
  landingPage: LandingPageData;
};

export function createCanProceedCreateStep(args: ProceedArgs) {
  return () => canProceedCreateStep(args);
}

export function createGetCreateStepBlockers(args: ProceedArgs) {
  return () => getCreateStepBlockers(args);
}
