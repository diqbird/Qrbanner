'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileImage, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useScanBaseUrl, buildScanLink } from '@/lib/use-scan-base-url';
import {
  PRINT_TEMPLATES,
  PrintTemplateId,
  renderPrintBanner,
  downloadCanvasAsPdf,
  downloadCanvasAsPng,
} from '@/lib/print-banner';
import {
  resolveIndustryPrintHeadline,
  resolveIndustryPrintNotes,
  resolveIndustryPrintSubtitle,
  resolvePrintTemplateDescription,
  resolvePrintTemplateName,
} from '@/lib/i18n/resolve-print-copy';

import type { IndustryPrintLayout } from '@/lib/industry-print-layouts';
import { useLanguage } from '@/components/i18n/language-provider';
import type { QRStyleConfig } from '@/lib/qr-style';

interface PrintBannerExportProps {
  shortCode: string;
  qrName?: string;
  style: Partial<QRStyleConfig>;
  logoPreview?: string | null;
  accentColor?: string;
  printLayout?: IndustryPrintLayout;
  industryTemplateId?: string;
}

export function PrintBannerExport({
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
    printLayout?.recommended ?? 'a4-portrait'
  );
  const [title, setTitle] = useState(qrName || printLayout?.headline || '');
  const [subtitle, setSubtitle] = useState(
    () => printLayout?.subtitle ?? t('printBanner.subtitleDefault')
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

  const orderedTemplates = useMemo(() => {
    if (!printLayout) return PRINT_TEMPLATES.map((tpl) => ({ tpl, recommended: false }));
    const order = [printLayout.recommended, ...printLayout.alternates];
    const seen = new Set<string>();
    const sorted = order
      .filter((id) => {
        if (seen.has(id)) return false;
        seen.add(id);
        return PRINT_TEMPLATES.some((t) => t.id === id);
      })
      .map((id) => ({
        tpl: PRINT_TEMPLATES.find((t) => t.id === id)!,
        recommended: id === printLayout.recommended,
      }));
    for (const tpl of PRINT_TEMPLATES) {
      if (!seen.has(tpl.id)) sorted.push({ tpl, recommended: false });
    }
    return sorted;
  }, [printLayout]);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2 text-base">
          <FileImage className="h-5 w-5 text-primary" />
          {t('printBanner.title')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t('printBanner.desc')}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t('printBanner.template')}</Label>
          {printLayout ? (
            <p className="text-xs text-muted-foreground">
              {industryTemplateId
                ? resolveIndustryPrintNotes(t, industryTemplateId, printLayout.notes)
                : printLayout.notes}
            </p>
          ) : null}
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {orderedTemplates.map(({ tpl, recommended }) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setTemplateId(tpl.id)}
                className={`relative rounded-lg border p-3 text-left transition-all ${
                  templateId === tpl.id
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border/50 hover:border-border'
                }`}
              >
                {recommended ? (
                  <Badge className="absolute right-2 top-2 text-[9px] px-1.5 py-0">
                    {t('printBanner.recommended')}
                  </Badge>
                ) : null}
                <p className="text-sm font-medium pr-16">{resolvePrintTemplateName(t, tpl.id, tpl.name)}</p>
                <p className="text-xs text-muted-foreground">
                  {resolvePrintTemplateDescription(t, tpl.id, tpl.description)}
                </p>
                {tpl.physicalSize ? (
                  <p className="text-[10px] text-muted-foreground mt-1">{tpl.physicalSize}</p>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t('printBanner.headline')}</Label>
            <Input
              placeholder={qrName || t('printBanner.headlinePlaceholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('printBanner.accentColor')}</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="h-10 w-12 cursor-pointer rounded border"
              />
              <Input value={accent} onChange={(e) => setAccent(e.target.value)} className="font-mono text-xs" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t('printBanner.subtitle')}</Label>
          <Textarea
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder={t('printBanner.subtitlePlaceholder')}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => handleGenerate('pdf')} disabled={generating} className="gap-2">
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {t('printBanner.downloadPdf')}
          </Button>
          <Button variant="outline" onClick={() => handleGenerate('png')} disabled={generating} className="gap-2">
            <Download className="h-4 w-4" /> {t('printBanner.downloadPng')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
