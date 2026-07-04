import { buildQRPayload, isDynamicCategory } from '@/lib/qr-utils';
import { stripMetaFields } from '@/lib/industry-templates';
import { buildScanLink } from '@/lib/use-scan-base-url';

/** Scan slug used in editor preview before a QR is saved — not a real short code. */
export const DYNAMIC_PREVIEW_SCAN_SLUG = 'draft-preview';

export function buildDynamicPreviewScanUrl(scanBaseUrl: string): string {
  return buildScanLink(DYNAMIC_PREVIEW_SCAN_SLUG, scanBaseUrl);
}

export function isPendingDynamicQr(category: string, shortCode?: string | null): boolean {
  return isDynamicCategory(category) && !shortCode?.trim();
}

export function resolveQrEncodeContent({
  category,
  qrData,
  shortCode,
  scanBaseUrl,
  targetUrl,
}: {
  category: string;
  qrData?: Record<string, string> | null;
  shortCode?: string | null;
  scanBaseUrl: string;
  targetUrl?: string | null;
}): { content: string; pendingDynamic: boolean } {
  if (shortCode?.trim()) {
    return {
      content: buildScanLink(shortCode.trim(), scanBaseUrl),
      pendingDynamic: false,
    };
  }

  if (isDynamicCategory(category)) {
    return {
      content: buildDynamicPreviewScanUrl(scanBaseUrl),
      pendingDynamic: true,
    };
  }

  const payload =
    buildQRPayload(category, stripMetaFields(qrData ?? {})) ||
    (targetUrl?.trim() ?? '');
  return {
    content: payload || 'https://qrbanner.com',
    pendingDynamic: false,
  };
}

export function resolveQrContentLength(
  category: string,
  qrData?: Record<string, string> | null,
  shortCode?: string | null,
  scanBaseUrl?: string
): number {
  const base = scanBaseUrl ?? 'https://qrbanner.com';
  return resolveQrEncodeContent({ category, qrData, shortCode, scanBaseUrl: base }).content.length;
}
