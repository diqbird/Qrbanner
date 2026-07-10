function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function googleMapsUrlFromGeo(schemeUrl: string): string | undefined {
  const match = schemeUrl.match(/^geo:([^?]+)/);
  if (!match) return undefined;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(match[1])}`;
}

export { schemePageMeta, type SchemePageMeta } from '@/lib/i18n/resolve-scan-page-copy';

import type { Locale } from '@/lib/i18n/types';

export function renderSchemeRedirectPage(
  schemeUrl: string,
  meta: {
    title: string;
    message: string;
    buttonLabel: string;
    secondaryUrl?: string;
    secondaryLabel?: string;
  },
  locale: Locale = 'en'
): string {
  const safeScheme = escapeHtml(schemeUrl);
  const secondary =
    meta.secondaryUrl && meta.secondaryLabel
      ? `<a class="secondary" href="${escapeHtml(meta.secondaryUrl)}">${escapeHtml(meta.secondaryLabel)}</a>`
      : '';

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(meta.title)}</title>
  <meta http-equiv="refresh" content="0;url=${safeScheme}">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f8fafc; color: #0f172a; }
    .card { max-width: 420px; padding: 2rem; text-align: center; background: #fff; border-radius: 1rem; box-shadow: 0 4px 24px rgba(15,23,42,.08); }
    h1 { font-size: 1.25rem; margin: 0 0 .75rem; }
    p { margin: 0; color: #475569; line-height: 1.5; font-size: .95rem; }
    a.btn { display: inline-block; margin-top: 1.25rem; padding: .75rem 1.5rem; background: #2563eb; color: #fff; text-decoration: none; border-radius: .5rem; font-weight: 600; }
    a.secondary { display: block; margin-top: .75rem; color: #64748b; font-size: .875rem; }
  </style>
  <script>setTimeout(function(){ window.location.replace(${JSON.stringify(schemeUrl)}); }, 350);</script>
</head>
<body>
  <div class="card">
    <h1>${escapeHtml(meta.title)}</h1>
    <p>${escapeHtml(meta.message)}</p>
    <a class="btn" href="${safeScheme}">${escapeHtml(meta.buttonLabel)}</a>
    ${secondary}
  </div>
</body>
</html>`;
}
