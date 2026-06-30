'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { useLanguage } from '@/components/i18n/language-provider';

import type { QRStyleConfig } from '@/lib/qr-style';

interface PrintBannerExportProps {
  shortCode: string;
  qrName?: string;
  style: Partial<QRStyleConfig>;
  logoPreview?: string | null;
  accentColor?: string;
}

export function PrintBannerExport({
  shortCode,
  qrName,
  style,
  logoPreview,
  accentColor = '#0071e3',
}: PrintBannerExportProps) {
  const { t } = useLanguage();
  const [templateId, setTemplateId] = useState<PrintTemplateId>('a4-portrait');
  const [title, setTitle] = useState(qrName || '');
  const [subtitle, setSubtitle] = useState(() => t('printBanner.subtitleDefault'));
  const [accent, setAccent] = useState(accentColor);
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
          <div className="grid gap-2 sm:grid-cols-2">
            {PRINT_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setTemplateId(tpl.id)}
                className={`rounded-lg border p-3 text-left transition-all ${
                  templateId === tpl.id
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border/50 hover:border-border'
                }`}
              >
                <p className="text-sm font-medium">{tpl.name}</p>
                <p className="text-xs text-muted-foreground">{tpl.description}</p>
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
