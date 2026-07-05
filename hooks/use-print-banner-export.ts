'use client';

import { usePrintBannerFormState } from '@/hooks/use-print-banner-form-state';
import { usePrintBannerGenerate } from '@/hooks/use-print-banner-generate';
import { type PrintBannerExportProps } from '@/lib/print-banner-export-types';

export function usePrintBannerExport(props: PrintBannerExportProps) {
  const {
    shortCode,
    qrName,
    style,
    logoPreview,
    accentColor,
    printLayout,
    industryTemplateId,
  } = props;

  const formState = usePrintBannerFormState({
    qrName,
    accentColor,
    printLayout,
    industryTemplateId,
  });

  const { generating, handleGenerate } = usePrintBannerGenerate({
    shortCode,
    qrName,
    style,
    logoPreview,
    templateId: formState.templateId,
    title: formState.title,
    subtitle: formState.subtitle,
    accent: formState.accent,
    t: formState.t,
  });

  return {
    ...formState,
    generating,
    printLayout,
    industryTemplateId,
    qrName,
    handleGenerate,
  };
}

export type PrintBannerExportState = ReturnType<typeof usePrintBannerExport>;
