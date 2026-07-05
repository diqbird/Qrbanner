'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/components/i18n/language-provider';
import {
  resolveIndustryPrintHeadline,
  resolveIndustryPrintSubtitle,
} from '@/lib/i18n/resolve-print-copy';
import {
  orderPrintTemplates,
  type PrintBannerExportProps,
} from '@/lib/print-banner-export-types';
import type { PrintTemplateId } from '@/lib/print-banner';

export function usePrintBannerFormState({
  qrName,
  accentColor = '#0071e3',
  printLayout,
  industryTemplateId,
}: Pick<PrintBannerExportProps, 'qrName' | 'accentColor' | 'printLayout' | 'industryTemplateId'>) {
  const { t } = useLanguage();
  const [templateId, setTemplateId] = useState<PrintTemplateId>(
    printLayout?.recommended ?? 'a4-portrait',
  );
  const [title, setTitle] = useState(qrName || printLayout?.headline || '');
  const [subtitle, setSubtitle] = useState(
    () => printLayout?.subtitle ?? t('printBanner.subtitleDefault'),
  );
  const [accent, setAccent] = useState(accentColor);

  useEffect(() => {
    if (!printLayout) return;
    setTemplateId(printLayout.recommended);
    if (printLayout.headline && !qrName) {
      setTitle(
        industryTemplateId
          ? resolveIndustryPrintHeadline(t, industryTemplateId, printLayout.headline)
          : printLayout.headline,
      );
    }
    if (printLayout.subtitle) {
      setSubtitle(
        industryTemplateId
          ? resolveIndustryPrintSubtitle(t, industryTemplateId, printLayout.subtitle)
          : printLayout.subtitle,
      );
    }
  }, [printLayout, qrName, industryTemplateId, t]);

  const orderedTemplates = useMemo(
    () => orderPrintTemplates(printLayout),
    [printLayout],
  );

  return {
    t,
    templateId,
    setTemplateId,
    title,
    setTitle,
    subtitle,
    setSubtitle,
    accent,
    setAccent,
    orderedTemplates,
  };
}
