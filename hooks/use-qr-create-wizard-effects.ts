'use client';

import { useEffect } from 'react';
import type { IndustryTemplate } from '@/lib/industry-templates';
import type { LandingPageData } from '@/lib/landing-page';
import { canProceedCreateStep } from '@/lib/qr-create-can-proceed';

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

export function createCanProceedCreateStep({
  step,
  category,
  name,
  qrData,
  payloadData,
  activeTemplate,
  landingPage,
}: {
  step: number;
  category: string;
  name: string;
  qrData: Record<string, string>;
  payloadData: () => Record<string, string>;
  activeTemplate: IndustryTemplate | null;
  landingPage: LandingPageData;
}) {
  return () =>
    canProceedCreateStep({
      step,
      category,
      name,
      qrData,
      payloadData,
      activeTemplate,
      landingPage,
    });
}
