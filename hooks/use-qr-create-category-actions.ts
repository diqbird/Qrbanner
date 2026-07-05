'use client';

import { useCallback } from 'react';
import { DEFAULT_QR_STYLE, normalizeQRStyle } from '@/components/qr/qr-style-editor';
import type { QRStyleConfig } from '@/lib/qr-style';
import type { IndustryTemplate } from '@/lib/industry-templates';
import type { LandingPageData } from '@/lib/landing-page';
import {
  applyIndustryTemplateToForm,
  linkHubCategoryDefaults,
} from '@/lib/qr-create-template-utils';

export function useQrCreateCategoryActions({
  resetStyleHistory,
  setCategory,
  setQrData,
  setName,
  setStep,
  setActiveTemplate,
  setTemplateGuideDismissed,
  setLandingEnabled,
  setLandingPage,
}: {
  resetStyleHistory: (style: QRStyleConfig) => void;
  setCategory: (category: string) => void;
  setQrData: (data: Record<string, string>) => void;
  setName: (name: string) => void;
  setStep: (step: number | ((s: number) => number)) => void;
  setActiveTemplate: (template: IndustryTemplate | null) => void;
  setTemplateGuideDismissed: (dismissed: boolean) => void;
  setLandingEnabled: (enabled: boolean) => void;
  setLandingPage: (page: LandingPageData) => void;
}) {
  const applyTemplate = useCallback(
    (template: IndustryTemplate) => {
      applyIndustryTemplateToForm(template, {
        setActiveTemplate,
        setTemplateGuideDismissed,
        setCategory,
        setQrData,
        resetStyleHistory,
        setName,
        setLandingEnabled,
        setLandingPage,
        setStep,
      });
    },
    [
      resetStyleHistory,
      setLandingEnabled,
      setLandingPage,
      setActiveTemplate,
      setTemplateGuideDismissed,
      setCategory,
      setQrData,
      setName,
      setStep,
    ],
  );

  const selectCategory = useCallback(
    (catId: string) => {
      setActiveTemplate(null);
      setCategory(catId);
      setQrData({});
      if (catId === 'link_hub') {
        setLandingEnabled(true);
        setLandingPage(linkHubCategoryDefaults());
      }
      setStep(1);
    },
    [setActiveTemplate, setCategory, setQrData, setLandingEnabled, setLandingPage, setStep],
  );

  const enterWizardFromQuick = useCallback(
    (data: { url?: string; name?: string; style?: Partial<QRStyleConfig> }) => {
      if (data.url) {
        setCategory('url');
        setQrData({ url: data.url });
        setName(data.name || '');
        resetStyleHistory(normalizeQRStyle(data.style ?? DEFAULT_QR_STYLE));
        setStep(1);
      }
    },
    [resetStyleHistory, setCategory, setQrData, setName, setStep],
  );

  return { applyTemplate, selectCategory, enterWizardFromQuick };
}
