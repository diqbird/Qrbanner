'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, Loader2 } from 'lucide-react';
import type { PrintBannerExportState } from '@/hooks/use-print-banner-export';

export function PrintBannerFieldsPanel({ exportState }: { exportState: PrintBannerExportState }) {
  const {
    t,
    title,
    setTitle,
    subtitle,
    setSubtitle,
    accent,
    setAccent,
    generating,
    qrName,
    handleGenerate,
  } = exportState;

  return (
    <>
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
    </>
  );
}
