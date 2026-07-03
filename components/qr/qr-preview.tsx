'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, Printer, Share2, Eye, Loader2 } from 'lucide-react';
import { PrintBannerExport } from './print-banner-export';
import { toast } from 'sonner';
import { renderStyledQR, renderStyledQRSvg } from '@/lib/qr-render';
import { renderStyledQREps } from '@/lib/qr-eps';
import { normalizeQRStyle, type QRStyleConfig } from '@/lib/qr-style';
import { EditableFrameLabel } from './editable-frame-label';
import { MockupPreview } from './mockup-preview';
import { ScanSimulation } from './scan-simulation';
import { buildQRPayload } from '@/lib/qr-utils';
import { stripMetaFields } from '@/lib/industry-templates';
import { useScanBaseUrl, buildScanLink } from '@/lib/use-scan-base-url';
import { useShowQrDescription } from '@/components/site-settings-provider';
import { useLanguage } from '@/components/i18n/language-provider';

import type { IndustryPrintLayout } from '@/lib/industry-print-layouts';

const EXPORT_SIZES = [512, 1024, 2048, 4096] as const;

interface QRPreviewProps {
  category: string;
  qrData: Record<string, string>;
  style: Partial<QRStyleConfig> | Record<string, unknown>;
  logoPreview: string | null;
  shortCode?: string;
  qrName?: string;
  accentColor?: string;
  showExtras?: boolean;
  showScanTest?: boolean;
  showPrintBanner?: boolean;
  printLayout?: IndustryPrintLayout;
  industryTemplateId?: string;
  onStyleChange?: (style: QRStyleConfig) => void;
}

export function QRPreview({
  category,
  qrData,
  style,
  logoPreview,
  shortCode,
  qrName,
  accentColor,
  showPrintBanner,
  showExtras,
  showScanTest,
  printLayout,
  industryTemplateId,
  onStyleChange,
}: QRPreviewProps) {
  const { t } = useLanguage();
  const showQrDescription = useShowQrDescription();
  const containerRef = useRef<HTMLDivElement>(null);
  const renderIdRef = useRef(0);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportSize, setExportSize] = useState<number>(1024);
  const normalized = normalizeQRStyle(style);
  const scanBaseUrl = useScanBaseUrl();

  const styleKey = useMemo(() => JSON.stringify(normalized), [normalized]);
  const qrDataKey = useMemo(() => JSON.stringify(qrData ?? {}), [qrData]);

  const previewContent = useMemo(() => {
    if (shortCode) {
      return buildScanLink(shortCode, scanBaseUrl);
    }
    const payload = buildQRPayload(category, stripMetaFields(qrData ?? {}));
    return payload || 'https://qrbanner.com';
  }, [category, qrDataKey, shortCode, scanBaseUrl]);

  useEffect(() => {
    const renderId = ++renderIdRef.current;
    let cancelled = false;

    const generateQR = async () => {
      setLoading(true);
      setError(null);

      try {
        const canvas = await renderStyledQR(previewContent, normalized, {
          size: 280,
          logoUrl: logoPreview,
          withFrame: true,
          skipFrameText: !!onStyleChange,
        });

        if (cancelled || renderId !== renderIdRef.current) return;

        const dataUrl = canvas.toDataURL('image/png');
        setQrDataUrl(dataUrl);

        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          canvas.style.maxWidth = '100%';
          canvas.style.height = 'auto';
          canvas.style.display = 'block';
          containerRef.current.appendChild(canvas);
        }
      } catch (e) {
        console.error('QR generation error:', e);
        if (!cancelled && renderId === renderIdRef.current) {
          setError(t('preview.renderError'));
          if (containerRef.current) containerRef.current.innerHTML = '';
        }
      } finally {
        if (!cancelled && renderId === renderIdRef.current) {
          setLoading(false);
        }
      }
    };

    generateQR();
    return () => {
      cancelled = true;
    };
  }, [previewContent, styleKey, logoPreview, t, onStyleChange]);

  const renderExportCanvas = async () =>
    renderStyledQR(previewContent, normalized, {
      size: exportSize,
      logoUrl: logoPreview,
      withFrame: true,
    });

  const triggerDownload = (href: string, filename: string) => {
    const a = document.createElement('a');
    a.href = href;
    a.download = filename;
    a.click();
  };

  const handleDownload = async (format: 'png' | 'jpg' | 'webp' | 'svg' | 'eps' | 'pdf') => {
    try {
      if (format === 'svg') {
        const svg = await renderStyledQRSvg(previewContent, normalized, {
          size: exportSize,
          logoUrl: logoPreview,
          withFrame: normalized.frameStyle !== 'none',
        });
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        triggerDownload(url, 'qr-code.svg');
        URL.revokeObjectURL(url);
      } else if (format === 'eps') {
        const eps = await renderStyledQREps(previewContent, normalized, {
          size: exportSize,
        });
        const blob = new Blob([eps], { type: 'application/postscript' });
        const url = URL.createObjectURL(blob);
        triggerDownload(url, 'qr-code.eps');
        URL.revokeObjectURL(url);
      } else if (format === 'pdf') {
        const canvas = await renderExportCanvas();
        const { jsPDF } = await import('jspdf');
        const img = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: canvas.width >= canvas.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(img, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('qr-code.pdf');
      } else {
        const canvas = await renderExportCanvas();
        const mime =
          format === 'jpg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
        const quality = format === 'png' ? undefined : 0.92;
        triggerDownload(
          canvas.toDataURL(mime, quality),
          `qr-code.${format === 'jpg' ? 'jpg' : format}`
        );
      }
      toast.success(t('preview.downloadSuccess', { format: format.toUpperCase() }));
    } catch {
      toast.error(t('preview.downloadFailed'));
    }
  };

  const handlePrint = async () => {
    try {
      const canvas = await renderStyledQR(previewContent, normalized, {
        size: 600,
        logoUrl: logoPreview,
        withFrame: true,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html><head><title>Print QR Code</title></head>
          <body style="display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0">
            <img src="${dataUrl}" style="max-width:400px" />
          </body></html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    } catch {
      toast.error(t('preview.downloadFailed'));
    }
  };

  const handleShare = async () => {
    if (!qrDataUrl) {
      toast.error(t('preview.downloadFailed'));
      return;
    }

    try {
      const blob = await fetch(qrDataUrl).then((r: Response) => r.blob());
      const file = new File([blob], 'qr-code.png', { type: blob.type || 'image/png' });
      const fileShare = { files: [file], title: qrName || 'QR Code from QRbanner' };

      if (navigator.canShare?.(fileShare)) {
        try {
          await navigator.share(fileShare);
          return;
        } catch (err) {
          if ((err as Error).name === 'AbortError') return;
        }
      }

      if (shortCode) {
        const link = buildScanLink(shortCode, scanBaseUrl);
        const urlShare = {
          url: link,
          title: qrName || 'QR Code from QRbanner',
          text: link,
        };
        if (navigator.share && navigator.canShare?.(urlShare)) {
          try {
            await navigator.share(urlShare);
            return;
          } catch (err) {
            if ((err as Error).name === 'AbortError') return;
          }
        }
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(link);
          toast.success(t('preview.linkCopied'));
          return;
        }
      }

      if (navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type || 'image/png']: blob }),
        ]);
        toast.success(t('preview.imageCopied'));
        return;
      }

      triggerDownload(qrDataUrl, 'qr-code.png');
      toast.success(t('preview.downloadSuccess', { format: 'PNG' }));
    } catch {
      toast.error(t('preview.shareFailed'));
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" /> {t('preview.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div
            className={`relative flex min-h-[300px] w-full items-center justify-center rounded-xl border p-4 ${
              onStyleChange && normalized.frameStyle === 'none' ? 'pb-12' : ''
            }`}
            style={{ backgroundColor: normalized.transparentBg ? 'transparent' : normalized.bgColor }}
          >
            {loading && (
              <Loader2 className="absolute h-8 w-8 animate-spin text-muted-foreground" />
            )}
            {!loading && error && (
              <p className="px-4 text-center text-sm text-muted-foreground">{error}</p>
            )}
            <div className="flex w-full min-w-0 items-center justify-center overflow-hidden">
            <div
              ref={containerRef}
              className={`relative inline-block max-w-full min-w-0 ${loading || error ? 'invisible' : ''}`}
            >
              {onStyleChange && !loading && !error && (
                <EditableFrameLabel
                  style={normalized}
                  onChange={(patch) =>
                    onStyleChange(normalizeQRStyle({ ...normalized, ...patch }))
                  }
                />
              )}
            </div>
            </div>
          </div>

          {onStyleChange && showQrDescription && (
            <p className="w-full max-w-full px-1 text-center text-xs leading-snug text-muted-foreground">
              {t('style.frameLabelEditHint')}
            </p>
          )}

          <div className="w-full space-y-2">
            <Label className="text-xs text-muted-foreground">{t('preview.exportSize')}</Label>
            <Select
              value={String(exportSize)}
              onValueChange={(v) => setExportSize(parseInt(v, 10))}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPORT_SIZES.map((sz) => (
                  <SelectItem key={sz} value={String(sz)}>
                    {sz} × {sz} px{sz >= 2048 ? ` (${t('preview.printQuality')})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleDownload('png')} className="gap-2 min-h-9" disabled={loading || !!error}>
              <Download className="h-3.5 w-3.5" /> PNG
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDownload('jpg')} className="gap-2 min-h-9" disabled={loading || !!error}>
              <Download className="h-3.5 w-3.5" /> JPG
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDownload('webp')} className="gap-2 min-h-9" disabled={loading || !!error}>
              <Download className="h-3.5 w-3.5" /> WEBP
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDownload('svg')} className="gap-2 min-h-9" disabled={loading || !!error}>
              <Download className="h-3.5 w-3.5" /> SVG
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDownload('eps')} className="gap-2 min-h-9" disabled={loading || !!error}>
              <Download className="h-3.5 w-3.5" /> EPS
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDownload('pdf')} className="gap-2 min-h-9" disabled={loading || !!error}>
              <Download className="h-3.5 w-3.5" /> {t('preview.pdf')}
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2 min-h-9" disabled={loading || !!error}>
              <Printer className="h-3.5 w-3.5" /> {t('preview.print')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-2 min-h-9" disabled={loading || !!error}>
              <Share2 className="h-3.5 w-3.5" /> {t('preview.share')}
            </Button>
          </div>
          {normalized.transparentBg && (
            <p className="text-center text-xs text-muted-foreground">{t('preview.transparentHint')}</p>
          )}
        </CardContent>
      </Card>

      {(showScanTest || showExtras) && (
        <div className="space-y-3 rounded-xl border border-dashed border-border/60 p-3">
          {showExtras && (
            <p className="text-center text-xs text-muted-foreground">
              {t('scan.optionalExtras')}
            </p>
          )}
          {showExtras && <MockupPreview qrDataUrl={qrDataUrl} />}
          {(showScanTest || showExtras) && (
            <ScanSimulation
              qrDataUrl={qrDataUrl}
              expectedContent={previewContent}
              style={normalized}
              hasLogo={!!logoPreview}
              contentLength={previewContent.length}
              defaultOpen={!!showScanTest && !showExtras}
            />
          )}
        </div>
      )}

      {showPrintBanner && shortCode && (
        <PrintBannerExport
          shortCode={shortCode}
          qrName={qrName}
          style={normalized}
          logoPreview={logoPreview}
          accentColor={accentColor}
          printLayout={printLayout}
          industryTemplateId={industryTemplateId}
        />
      )}
    </div>
  );
}
