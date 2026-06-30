import { renderGpsCaptureScript } from '@/lib/gps-heatmap';

export interface PixelAnalyticsConfig {
  ga4Enabled: boolean;
  ga4MeasurementId: string | null;
  metaPixelEnabled: boolean;
  metaPixelId: string | null;
}

export const emptyPixelAnalytics: PixelAnalyticsConfig = {
  ga4Enabled: false,
  ga4MeasurementId: null,
  metaPixelEnabled: false,
  metaPixelId: null,
};

const GA4_RE = /^G-[A-Z0-9]{6,}$/i;
const META_PIXEL_RE = /^\d{5,20}$/;

export function normalizeGa4Id(input: string | null | undefined): string | null {
  const id = (input ?? '').trim().toUpperCase();
  if (!id) return null;
  return GA4_RE.test(id) ? id : null;
}

export function normalizeMetaPixelId(input: string | null | undefined): string | null {
  const id = (input ?? '').replace(/\D/g, '');
  if (!id) return null;
  return META_PIXEL_RE.test(id) ? id : null;
}

export function getPixelConfig(qr: {
  ga4Enabled?: boolean | null;
  ga4MeasurementId?: string | null;
  metaPixelEnabled?: boolean | null;
  metaPixelId?: string | null;
}): PixelAnalyticsConfig {
  const ga4Id = normalizeGa4Id(qr.ga4MeasurementId);
  const metaId = normalizeMetaPixelId(qr.metaPixelId);
  return {
    ga4Enabled: Boolean(qr.ga4Enabled) && Boolean(ga4Id),
    ga4MeasurementId: ga4Id,
    metaPixelEnabled: Boolean(qr.metaPixelEnabled) && Boolean(metaId),
    metaPixelId: metaId,
  };
}

export function hasActivePixels(config: PixelAnalyticsConfig): boolean {
  return config.ga4Enabled || config.metaPixelEnabled;
}

function escapeJsString(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/</g, '\\u003c');
}

export function renderPixelHeadScripts(config: PixelAnalyticsConfig): string {
  const parts: string[] = [];

  if (config.ga4Enabled && config.ga4MeasurementId) {
    const id = escapeJsString(config.ga4MeasurementId);
    parts.push(`<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>`);
    parts.push(`<script>
      window.dataLayer=window.dataLayer||[];
      function gtag(){dataLayer.push(arguments);}
      gtag('js',new Date());
      gtag('config','${id}',{send_page_view:true});
    </script>`);
  }

  if (config.metaPixelEnabled && config.metaPixelId) {
    const pid = escapeJsString(config.metaPixelId);
    parts.push(`<script>
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init','${pid}');
      fbq('track','PageView');
    </script>`);
    parts.push(`<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pid}&ev=PageView&noscript=1" alt=""/></noscript>`);
  }

  return parts.join('\n  ');
}

export function renderCtaClickHandler(qrName: string): string {
  const name = escapeJsString(qrName || 'QR Scan');
  return `onclick="try{if(window.gtag)gtag('event','qr_cta_click',{event_category:'QRbanner',event_label:'${name}'});if(window.fbq)fbq('track','Lead',{content_name:'${name}'})}catch(e){}"`;
}

export function renderPixelRedirectPage(
  redirectUrl: string,
  config: PixelAnalyticsConfig,
  qrName: string,
  options?: { shortCode?: string; gpsHeatmapEnabled?: boolean }
): string {
  const safeUrl = redirectUrl.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const headScripts = renderPixelHeadScripts(config);
  const name = escapeJsString(qrName || 'QR Scan');
  const gpsScript =
    options?.shortCode && options?.gpsHeatmapEnabled
      ? renderGpsCaptureScript(options.shortCode, true)
      : '';

  return `<!DOCTYPE html>
<html lang="en"><head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta http-equiv="refresh" content="1;url=${safeUrl}"/>
  <title>Redirecting…</title>
  ${headScripts}
  <script>
    (function(){
      try{
        if(window.gtag) gtag('event','qr_scan',{event_category:'QRbanner',event_label:'${name}'});
        if(window.fbq) fbq('trackCustom','QRScan',{content_name:'${name}'});
      }catch(e){}
      setTimeout(function(){ window.location.replace('${safeUrl.replace(/'/g, "\\'")}'); }, 400);
    })();
  </script>
  <style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;color:#64748b}</style>
</head><body><p>Redirecting…</p>${gpsScript}</body></html>`;
}
