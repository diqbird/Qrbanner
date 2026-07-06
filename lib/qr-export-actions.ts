'use client';

import { renderStyledQR, renderStyledQRSvg } from '@/lib/qr-render';
import { renderStyledQREps } from '@/lib/qr-eps';
import { normalizeQRStyle, type QRStyleConfig } from '@/lib/qr-style';
import { resolveQrEncodeContent } from '@/lib/qr-preview-content';
import type { Locale } from '@/lib/i18n';
import { toast } from 'sonner';

export const QR_EXPORT_SIZES = [512, 1024, 2048, 4096] as const;

export type QrExportFormat = 'png' | 'jpg' | 'webp' | 'svg' | 'eps' | 'pdf';

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(',');
  if (!data) throw new Error('invalid_data_url');
  const mime = header.match(/:(.*?);/)?.[1] || 'image/png';
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function triggerDownload(href: string, filename: string) {
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  a.click();
}

type ExportContext = {
  previewContent: string;
  normalized: QRStyleConfig;
  logoPreview: string | null;
  exportSize: number;
  pendingDynamic: boolean;
  qrDataUrl: string | null;
  shortCode?: string;
  category: string;
  qrData: Record<string, string>;
  scanBaseUrl: string;
  qrName?: string;
  t: (key: string, params?: Record<string, string | number>) => string;
  locale?: Locale;
};

async function renderExportCanvas(ctx: ExportContext) {
  return renderStyledQR(ctx.previewContent, ctx.normalized, {
    size: ctx.exportSize,
    logoUrl: ctx.logoPreview,
    withFrame: true,
    locale: ctx.locale ?? 'en',
  });
}

export async function downloadQrFormat(ctx: ExportContext, format: QrExportFormat) {
  if (ctx.pendingDynamic) {
    toast.message(ctx.t('preview.saveBeforeExport'));
    return;
  }
  try {
    if (format === 'svg') {
      const svg = await renderStyledQRSvg(ctx.previewContent, ctx.normalized, {
        size: ctx.exportSize,
        logoUrl: ctx.logoPreview,
        withFrame: ctx.normalized.frameStyle !== 'none',
        locale: ctx.locale ?? 'en',
      });
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, 'qr-code.svg');
      URL.revokeObjectURL(url);
    } else if (format === 'eps') {
      const eps = await renderStyledQREps(ctx.previewContent, ctx.normalized, {
        size: ctx.exportSize,
      });
      const blob = new Blob([eps], { type: 'application/postscript' });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, 'qr-code.eps');
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      const canvas = await renderExportCanvas(ctx);
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
      const canvas = await renderExportCanvas(ctx);
      const mime =
        format === 'jpg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
      const quality = format === 'png' ? undefined : 0.92;
      triggerDownload(
        canvas.toDataURL(mime, quality),
        `qr-code.${format === 'jpg' ? 'jpg' : format}`,
      );
    }
    toast.success(ctx.t('preview.downloadSuccess', { format: format.toUpperCase() }));
  } catch {
    toast.error(ctx.t('preview.downloadFailed'));
  }
}

export async function printQrPreview(ctx: ExportContext) {
  if (ctx.pendingDynamic) {
    toast.message(ctx.t('preview.saveBeforeExport'));
    return;
  }
  try {
    const canvas = await renderStyledQR(ctx.previewContent, ctx.normalized, {
      size: 600,
      logoUrl: ctx.logoPreview,
      withFrame: true,
      locale: ctx.locale ?? 'en',
    });
    const dataUrl = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html><head><title>${ctx.t('preview.printTitle')}</title></head>
        <body style="display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0">
          <img src="${dataUrl}" style="max-width:400px" />
        </body></html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  } catch {
    toast.error(ctx.t('preview.downloadFailed'));
  }
}

export async function shareQrPreview(ctx: ExportContext) {
  if (ctx.pendingDynamic) {
    toast.message(ctx.t('preview.saveBeforeExport'));
    return;
  }
  if (!ctx.qrDataUrl) {
    toast.error(ctx.t('preview.downloadFailed'));
    return;
  }

  try {
    const blob = dataUrlToBlob(ctx.qrDataUrl);
    const shareTitle = ctx.qrName || ctx.t('preview.shareDefaultTitle');
    const file = new File([blob], 'qr-code.png', { type: blob.type || 'image/png' });
    const fileShare = { files: [file], title: shareTitle };

    if (navigator.canShare?.(fileShare)) {
      try {
        await navigator.share(fileShare);
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
      }
    }

    if (ctx.shortCode) {
      const link = resolveQrEncodeContent({
        category: ctx.category,
        qrData: ctx.qrData,
        shortCode: ctx.shortCode,
        scanBaseUrl: ctx.scanBaseUrl,
      }).content;
      const urlShare = {
        url: link,
        title: shareTitle,
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
        toast.success(ctx.t('preview.linkCopied'));
        return;
      }
    }

    if (navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type || 'image/png']: blob }),
      ]);
      toast.success(ctx.t('preview.imageCopied'));
      return;
    }

    triggerDownload(ctx.qrDataUrl, 'qr-code.png');
    toast.success(ctx.t('preview.downloadSuccess', { format: 'PNG' }));
  } catch {
    toast.error(ctx.t('preview.shareFailed'));
  }
}

export { normalizeQRStyle };
