'use client';

import type { QRStyleConfig } from '@/lib/qr-style';
import type { IndustryTemplate } from '@/lib/industry-templates';
import type { LandingPageData } from '@/lib/landing-page';
import { useQrCreateStyleTemplate } from '@/hooks/use-qr-create-style-template';
import { useQrCreateCategoryActions } from '@/hooks/use-qr-create-category-actions';

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

  const categoryActions = useQrCreateCategoryActions({
    resetStyleHistory,
    setCategory,
    setQrData,
    setName,
    setStep,
    setActiveTemplate,
    setTemplateGuideDismissed,
    setLandingEnabled,
    setLandingPage,
  });

  return {
    ...styleTemplates,
    ...categoryActions,
  };
}
