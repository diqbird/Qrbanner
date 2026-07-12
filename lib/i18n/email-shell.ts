import { translate, type Locale } from '@/lib/i18n';

export type EmailShellOptions = {
  brandName?: string;
  hidePoweredBy?: boolean;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildEmailShell(locale: Locale, body: string, opts?: EmailShellOptions): string {
  const brandName = (opts?.brandName?.trim() || 'QRbanner').slice(0, 80);
  const brandHtml = escapeHtml(brandName);
  const rights = opts?.hidePoweredBy
    ? translate(locale, 'authEmail.footerRightsBrand', {
        year: new Date().getFullYear(),
        brand: brandName,
      })
    : translate(locale, 'authEmail.footerRights', { year: new Date().getFullYear() });
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#0f172a">
    <div style="text-align:center;margin-bottom:24px">
      <div style="display:inline-block;width:48px;height:48px;line-height:48px;background:#4f46e5;color:#fff;border-radius:12px;font-size:24px">▣</div>
      <h1 style="font-size:20px;margin:12px 0 0">${brandHtml}</h1>
    </div>
    ${body}
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
    <p style="font-size:12px;color:#94a3b8;text-align:center">${escapeHtml(rights)}</p>
  </div>`;
}
