'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useScanBaseUrl, buildScanLink } from '@/lib/use-scan-base-url';
import {
  renderPrintBanner,
  downloadCanvasAsPdf,
  downloadCanvasAsPng,
} from '@/lib/print-banner';
import type { PrintBannerExportProps } from '@/lib/print-banner-export-types';

export function usePrintBannerGenerate({
  shortCode,
  qrName,
  style,
  logoPreview,
  templateId,
  title,
  subtitle,
  accent,
  t,
}: Pick<PrintBannerExportProps, 'shortCode' | 'qrName' | 'style' | 'logoPreview'> & {
  templateId: import('@/lib/print-banner').PrintTemplateId;
  title: string;
  subtitle: string;
  accent: string;
  t: (key: string) => string;
}) {
  const [generating, setGenerating] = useState(false);
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

  return { generating, handleGenerate };
}
