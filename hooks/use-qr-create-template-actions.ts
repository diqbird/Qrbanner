'use client';

import { useCallback } from 'react';
import { DEFAULT_QR_STYLE, normalizeQRStyle } from '@/components/qr/qr-style-editor';
import type { QRStyleConfig } from '@/lib/qr-style';
import type { IndustryTemplate } from '@/lib/industry-templates';
import { emptyLandingPage } from '@/components/qr/landing-page-editor';
import type { LandingPageData } from '@/lib/landing-page';
import {
  applyIndustryTemplateToForm,
  linkHubCategoryDefaults,
} from '@/lib/qr-create-template-utils';
import { useQrCreateStyleTemplate } from '@/hooks/use-qr-create-style-template';

type Translate = (key: string, vars?: Record<string, string>) => string;

export function useQrCreateTemplateActions({
  category,
  resetStyleHistory,
  setCategory,
  setQrData,
  setName,
  setStep,
  setActiveTemplate,
  setTemplateGuideDismissed,
  setStoredLogoPath,
  setLogoPreview,
  setLogoFile,
  setLandingEnabled,
  setLandingPage,
  t,
}: {
  category: string;
  resetStyleHistory: (style: QRStyleConfig) => void;
  setCategory: (category: string) => void;
  setQrData: (data: Record<string, string>) => void;
  setName: (name: string) => void;
  setStep: (step: number | ((s: number) => number)) => void;
  setActiveTemplate: (template: IndustryTemplate | null) => void;
  setTemplateGuideDismissed: (dismissed: boolean) => void;
  setStoredLogoPath: (path: string | null) => void;
  setLogoPreview: (preview: string | null) => void;
  setLogoFile: (file: File | null) => void;
  setLandingEnabled: (enabled: boolean) => void;
  setLandingPage: (page: LandingPageData) => void;
  t: Translate;
}) {
  const styleTemplates = useQrCreateStyleTemplate({
    category,
    resetStyleHistory,
    setCategory,
    setQrData,
    setStep,
    setStoredLogoPath,
    setLogoPreview,
    setLogoFile,
    t,
  });

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

  return {
    ...styleTemplates,
    applyTemplate,
    selectCategory,
    enterWizardFromQuick,
  };
}
