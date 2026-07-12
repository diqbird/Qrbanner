import { translate, type Locale } from '@/lib/i18n';

export type EmailShellOptions = {
  brandName?: string;
  hidePoweredBy?: boolean;
  logoUrl?: string;
  brandColor?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function safeHttpsLogoUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return undefined;
    return value.trim().slice(0, 500);
  } catch {
    return undefined;
  }
}

function safeBrandColor(value: string | undefined): string {
  if (!value) return '#4f46e5';
  const trimmed = value.trim();
  if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(trimmed)) return '#4f46e5';
  return trimmed;
}

export function buildEmailShell(locale: Locale, body: string, opts?: EmailShellOptions): string {
  const brandName = (opts?.brandName?.trim() || 'QRbanner').slice(0, 80);
  const brandHtml = escapeHtml(brandName);
  const logoUrl = safeHttpsLogoUrl(opts?.logoUrl);
  const accent = safeBrandColor(opts?.brandColor);
  const mark = logoUrl
    ? `<img src="${escapeHtml(logoUrl)}" alt="${brandHtml}" width="48" height="48" style="display:block;margin:0 auto;width:48px;height:48px;object-fit:contain;border:0" />`
    : `<div style="display:inline-block;width:48px;height:48px;line-height:48px;background:${accent};color:#fff;border-radius:12px;font-size:24px">▣</div>`;
  const rights = opts?.hidePoweredBy
    ? translate(locale, 'authEmail.footerRightsBrand', {
        year: new Date().getFullYear(),
        brand: brandName,
      })
    : translate(locale, 'authEmail.footerRights', { year: new Date().getFullYear() });
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#0f172a">
    <div style="text-align:center;margin-bottom:24px">
      ${mark}
      <h1 style="font-size:20px;margin:12px 0 0">${brandHtml}</h1>
    </div>
    ${body}
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
    <p style="font-size:12px;color:#94a3b8;text-align:center">${escapeHtml(rights)}</p>
  </div>`;
}
