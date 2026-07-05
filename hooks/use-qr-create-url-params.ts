'use client';

import { useRef, useEffect } from 'react';
import { QR_CATEGORIES } from '@/lib/qr-utils';
import { getTemplateById } from '@/lib/industry-templates';
import type { IndustryTemplate } from '@/lib/industry-templates';

export function useQrCreateUrlParams({
  searchParams,
  applyTemplate,
  applyStyleTemplateFromApi,
  setActiveTemplate,
  setCategory,
  setStep,
}: {
  searchParams: URLSearchParams | null;
  applyTemplate: (template: IndustryTemplate) => void;
  applyStyleTemplateFromApi: (id: string) => Promise<void>;
  setActiveTemplate: (t: IndustryTemplate | null) => void;
  setCategory: (id: string) => void;
  setStep: (step: number) => void;
}) {
  const urlParamsApplied = useRef(false);

  useEffect(() => {
    if (urlParamsApplied.current || !searchParams) return;
    const templateId = searchParams.get('template');
    const categoryId = searchParams.get('category');
    const styleTemplateId = searchParams.get('styleTemplate');
    if (templateId) {
      const template = getTemplateById(templateId);
      if (template) {
        urlParamsApplied.current = true;
        applyTemplate(template);
      }
    } else if (categoryId && QR_CATEGORIES.some((c) => c.id === categoryId)) {
      urlParamsApplied.current = true;
      setActiveTemplate(null);
      setCategory(categoryId);
      setStep(1);
    } else if (styleTemplateId) {
      urlParamsApplied.current = true;
      void applyStyleTemplateFromApi(styleTemplateId);
    }
  }, [searchParams, applyTemplate, applyStyleTemplateFromApi, setActiveTemplate, setCategory, setStep]);
}
