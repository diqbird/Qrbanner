'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useScanBaseUrl, buildScanLink } from '@/lib/use-scan-base-url';
import {
  type PrintTemplateId,
  renderPrintBanner,
  downloadCanvasAsPdf,
  downloadCanvasAsPng,
} from '@/lib/print-banner';
import {
  resolveIndustryPrintHeadline,
  resolveIndustryPrintNotes,
  resolveIndustryPrintSubtitle,
} from '@/lib/i18n/resolve-print-copy';
import { useLanguage } from '@/components/i18n/language-provider';
import {
  orderPrintTemplates,
  type PrintBannerExportProps,
} from '@/lib/print-banner-export-types';

export function usePrintBannerExport({
  shortCode,
  qrName,
  style,
  logoPreview,
  accentColor = '#0071e3',
  printLayout,
  industryTemplateId,
}: PrintBannerExportProps) {
  const { t } = useLanguage();
  const [templateId, setTemplateId] = useState<PrintTemplateId>(
    printLayout?.recommended ?? 'a4-portrait',
  );
  const [title, setTitle] = useState(qrName || printLayout?.headline || '');
  const [subtitle, setSubtitle] = useState(
    () => printLayout?.subtitle ?? t('printBanner.subtitleDefault'),
  );
  const [accent, setAccent] = useState(accentColor);
  const [generating, setGenerating] = useState(false);

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

  const scanBaseUrl = useScanBaseUrl();
  const qrContent = shortCode ? buildScanLink(shortCode, scanBaseUrl) : scanBaseUrl;

  const handleGenerate = async (format: 'pdf' | 'png') => {
    setGenerating(true);
    try {
      const canvas = await renderPrintBanner({
        templateId,
        title: title || qrName || t('printBanner.scanMe'),
        subtitle,
        qrContent,
        fgColor: style.fgColor ?? '#000000',
        bgColor: style.bgColor ?? '#FFFFFF',
        style,
        accentColor: accent,
        logoDataUrl: logoPreview,
      });
      const slug = (title || qrName || 'banner').replace(/\s+/g, '-').toLowerCase().slice(0, 30);
      if (format === 'pdf') {
        downloadCanvasAsPdf(canvas, `qrbanner-${slug}.pdf`);
        toast.success(t('printBanner.pdfDownloaded'));
      } else {
        downloadCanvasAsPng(canvas, `qrbanner-${slug}.png`);
        toast.success(t('printBanner.pngDownloaded'));
      }
    } catch (e) {
      console.error(e);
      toast.error(t('printBanner.generateFailed'));
    } finally {
      setGenerating(false);
    }
  };

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
    generating,
    orderedTemplates,
    printLayout,
    industryTemplateId,
    qrName,
    handleGenerate,
  };
}

export type PrintBannerExportState = ReturnType<typeof usePrintBannerExport>;
