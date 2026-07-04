import { renderStyledQR } from '@/lib/qr-render';
import { normalizeQRStyle } from '@/lib/qr-style';
import { resolveQrEncodeContent } from '@/lib/qr-preview-content';

export const BULK_ZIP_MAX = 50;

export type BulkQrZipItem = {
  id: string;
  name: string;
  shortCode: string;
  category: string;
  targetUrl: string;
  qrData?: Record<string, string> | null;
  style?: Record<string, unknown> | null;
  logoPath?: string | null;
};

function safeFilename(name: string): string {
  const base = name
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 48);
  return base || 'qr-code';
}

/** Render selected QR codes as PNG files inside a ZIP archive (browser only). */
export async function downloadBulkQrImagesZip(
  items: BulkQrZipItem[],
  scanBaseUrl: string,
): Promise<number> {
  if (!items.length) return 0;

  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  const usedNames = new Set<string>();
  let added = 0;

  for (const item of items.slice(0, BULK_ZIP_MAX)) {
    const style = normalizeQRStyle((item.style ?? {}) as Record<string, unknown>);
    const content = resolveQrEncodeContent({
      category: item.category,
      qrData: item.qrData ?? {},
      shortCode: item.shortCode,
      scanBaseUrl,
      targetUrl: item.targetUrl,
    }).content;

    if (!content?.trim()) continue;

    const canvas = await renderStyledQR(content, style, {
      size: 512,
      logoUrl: item.logoPath ?? undefined,
    });

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/png');
    });
    if (!blob) continue;

    let stem = safeFilename(item.name || item.shortCode);
    if (usedNames.has(stem)) {
      let n = 2;
      while (usedNames.has(`${stem}-${n}`)) n += 1;
      stem = `${stem}-${n}`;
    }
    usedNames.add(stem);
    zip.file(`${stem}.png`, blob);
    added += 1;
  }

  if (added === 0) {
    throw new Error('no_images');
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(zipBlob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `qr-images-${new Date().toISOString().slice(0, 10)}.zip`;
  anchor.click();
  URL.revokeObjectURL(url);
  return added;
}
