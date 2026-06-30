import { buildQRPayload } from '@/lib/qr-utils';
import { isBlockedRedirectUrl } from '@/lib/url-safety';

const URL_FIELD_KEYS = [
  'url',
  'website',
  'link',
  'menuUrl',
  'pdfUrl',
  'fileUrl',
  'iosUrl',
  'androidUrl',
  'instagram',
  'facebook',
  'tiktok',
  'linkedin',
  'youtube',
  'spotify',
  'telegram',
  'discord',
  'zoom',
  'googleMeet',
] as const;

function collectCandidateUrls(
  category: string,
  qrData: Record<string, unknown>,
  extras?: { iosUrl?: string | null; androidUrl?: string | null }
): string[] {
  const urls = new Set<string>();

  const payload = buildQRPayload(category, qrData as Record<string, string>);
  if (payload && /^https?:\/\//i.test(payload)) {
    urls.add(payload);
  }

  for (const key of URL_FIELD_KEYS) {
    const value = qrData[key];
    if (typeof value === 'string' && value.trim()) {
      urls.add(value.trim());
    }
  }

  if (extras?.iosUrl?.trim()) urls.add(extras.iosUrl.trim());
  if (extras?.androidUrl?.trim()) urls.add(extras.androidUrl.trim());

  return Array.from(urls);
}

export function assertQrUrlsAllowed(
  category: string,
  qrData: Record<string, unknown>,
  extras?: {
    iosUrl?: string | null;
    androidUrl?: string | null;
    landingPageData?: { hubLinks?: { url?: string }[] } | null;
  }
): { ok: true } | { ok: false; error: string } {
  const candidates = collectCandidateUrls(category, qrData, extras);

  for (const link of extras?.landingPageData?.hubLinks ?? []) {
    const raw = link?.url?.trim();
    if (!raw) continue;
    const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    candidates.push(normalized);
  }

  for (const raw of candidates) {
    if (isBlockedRedirectUrl(raw)) {
      return {
        ok: false,
        error: 'This destination URL is not allowed for security reasons.',
      };
    }
  }
  return { ok: true };
}
