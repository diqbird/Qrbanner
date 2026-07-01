import {
  renderPixelHeadScripts,
  renderCtaClickHandler,
  type PixelAnalyticsConfig,
} from '@/lib/pixel-analytics';
import { renderHubLinkBeacon } from '@/lib/landing-cta-analytics';
import { renderGpsCaptureScript } from '@/lib/gps-heatmap';

export type LandingTemplate = 'minimal' | 'restaurant' | 'hotel' | 'event' | 'business';

export interface LeadFormConfig {
  collectName: boolean;
  collectEmail: boolean;
  collectPhone: boolean;
  collectMessage: boolean;
  requiredEmail: boolean;
}

export interface LandingPageSeo {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  faviconUrl?: string;
  /** Allow search engines to index this landing page (default: false) */
  indexable?: boolean;
}

export interface HubLink {
  label: string;
  url: string;
}

export interface LandingPageData {
  template: LandingTemplate;
  title: string;
  subtitle: string;
  bannerImage: string;
  accentColor: string;
  ctaLabel: string;
  leadFormEnabled?: boolean;
  leadForm?: LeadFormConfig;
  seo?: LandingPageSeo;
  /** Linktree-style multiple buttons on scan landing */
  hubLinks?: HubLink[];
  hubMode?: boolean;
}

export const defaultLeadForm: LeadFormConfig = {
  collectName: true,
  collectEmail: true,
  collectPhone: false,
  collectMessage: false,
  requiredEmail: true,
};

export const emptyLandingPage: LandingPageData = {
  template: 'minimal',
  title: '',
  subtitle: '',
  bannerImage: '',
  accentColor: '#0071e3',
  ctaLabel: 'Continue',
};

export const LANDING_TEMPLATES: { id: LandingTemplate; name: string; description: string }[] = [
  { id: 'minimal', name: 'Clean & Simple', description: 'Minimal layout — works for any link or promo' },
  { id: 'restaurant', name: 'Restaurant', description: 'Warm colors — perfect for menus and dining' },
  { id: 'hotel', name: 'Hotel & Hospitality', description: 'Elegant look for hotels, spas and venues' },
  { id: 'event', name: 'Event & Conference', description: 'Bold design for registrations and RSVPs' },
  { id: 'business', name: 'Business', description: 'Professional style for corporate campaigns' },
];

const TEMPLATE_STYLES: Record<LandingTemplate, { gradient: string; emoji: string }> = {
  minimal: { gradient: 'linear-gradient(135deg,#f5f5f7 0%,#ffffff 100%)', emoji: '' },
  restaurant: { gradient: 'linear-gradient(135deg,#fff7ed 0%,#ffffff 100%)', emoji: '🍽️' },
  hotel: { gradient: 'linear-gradient(135deg,#f0f4ff 0%,#ffffff 100%)', emoji: '🏨' },
  event: { gradient: 'linear-gradient(135deg,#fdf4ff 0%,#ffffff 100%)', emoji: '🎪' },
  business: { gradient: 'linear-gradient(135deg,#f8fafc 0%,#ffffff 100%)', emoji: '💼' },
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface RenderLandingPageOptions {
  pixels?: PixelAnalyticsConfig;
  qrName?: string;
  gpsHeatmapEnabled?: boolean;
  hidePoweredBy?: boolean;
  /** Static iframe preview in the editor — disables tracking and navigation */
  preview?: boolean;
  locale?: 'en' | 'tr';
}

export function renderLandingPage(
  shortCode: string,
  data: LandingPageData,
  redirectUrl: string,
  options: RenderLandingPageOptions = {},
): string {
  const {
    pixels,
    qrName,
    gpsHeatmapEnabled,
    hidePoweredBy,
    preview = false,
    locale = 'en',
  } = options;
  const tpl = TEMPLATE_STYLES[data.template] ?? TEMPLATE_STYLES.minimal;
  const accent = data.accentColor || '#0071e3';
  const title = escapeHtml(data.title || 'Welcome');
  const subtitle = escapeHtml(data.subtitle || '');
  const cta = escapeHtml(data.ctaLabel || 'Continue');
  const banner = data.bannerImage ? escapeHtml(data.bannerImage) : '';
  const goUrl = preview ? '#' : `/s/${escapeHtml(shortCode)}?go=1`;
  const emoji = tpl.emoji;
  const pixelHead = preview || !pixels ? '' : renderPixelHeadScripts(pixels);
  const gpsScript = preview ? '' : renderGpsCaptureScript(shortCode, Boolean(gpsHeatmapEnabled));
  const ctaClick = preview || !pixels ? '' : renderCtaClickHandler(qrName || data.title || 'QR');
  const leadForm = data.leadForm ?? defaultLeadForm;
  const showLeadForm = Boolean(data.leadFormEnabled);

  const seo = data.seo ?? {};
  const metaTitle = escapeHtml(seo.metaTitle || data.title || 'Welcome');
  const metaDesc = escapeHtml(
    seo.metaDescription || data.subtitle || data.title || 'Scan to continue'
  );
  const ogImage = seo.ogImage ? escapeHtml(seo.ogImage) : banner;
  const favicon = seo.faviconUrl ? escapeHtml(seo.faviconUrl) : '';
  const robots = seo.indexable ? 'index,follow' : 'noindex,nofollow';
  const pageUrl = `https://qrbanner.com/s/${escapeHtml(shortCode)}`;
  const bannerAlt = escapeHtml(data.title || 'Banner');

  const hubLinks = (data.hubLinks ?? []).filter((l) => l.label?.trim() && l.url?.trim());
  const hubLinksHtml =
    hubLinks.length > 0
      ? `<div class="hub-links">${hubLinks
          .map((link) => {
            const href = preview
              ? '#'
              : /^https?:\/\//i.test(link.url.trim())
                ? link.url.trim()
                : `https://${link.url.trim()}`;
            return `<a class="cta hub-link" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" ${preview ? '' : renderHubLinkBeacon(shortCode, link.label.trim())}>${escapeHtml(link.label.trim())}</a>`;
          })
          .join('')}</div>`
      : '';

  const leadFields = showLeadForm
    ? `
    <form id="lead-form" class="lead-form"${preview ? ' onsubmit="event.preventDefault();return false"' : ''}>
      ${leadForm.collectName ? `<input type="text" name="name" placeholder="Your name" ${leadForm.requiredEmail ? '' : ''}/>` : ''}
      ${leadForm.collectEmail ? `<input type="email" name="email" placeholder="Email address" ${leadForm.requiredEmail ? 'required' : ''}/>` : ''}
      ${leadForm.collectPhone ? `<input type="tel" name="phone" placeholder="Phone number"/>` : ''}
      ${leadForm.collectMessage ? `<textarea name="message" placeholder="Message" rows="3"></textarea>` : ''}
      <button type="submit" class="cta" style="border:none;cursor:pointer">${cta}</button>
      <p class="lead-err" id="lead-err"></p>
    </form>
    <script>
    document.getElementById('lead-form')?.addEventListener('submit',async function(e){
      e.preventDefault();
      const fd=new FormData(this);
      const err=document.getElementById('lead-err');
      err.textContent='';
      const body={shortCode:${JSON.stringify(shortCode)}};
      fd.forEach((v,k)=>{if(v)body[k]=v});
      try{
        const r=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
        const j=await r.json();
        if(!r.ok){err.textContent=j.error||'Submission failed';return;}
        window.location.href=j.redirect||${JSON.stringify(goUrl)};
      }catch{err.textContent='Network error';}
    });
    </script>`
    : hubLinks.length > 0
      ? hubLinksHtml
      : `<a class="cta" href="${goUrl}" ${ctaClick}>${cta}</a>`;

  const footer = hidePoweredBy
    ? ''
    : '<div class="footer">Powered by <a href="https://qrbanner.com">QRbanner</a></div>';

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
  <meta name="robots" content="${robots}"/>
  <title>${metaTitle}</title>
  <meta name="description" content="${metaDesc}"/>
  <link rel="canonical" href="${pageUrl}"/>
  ${favicon ? `<link rel="icon" href="${favicon}"/>` : ''}
  <meta property="og:type" content="website"/>
  <meta property="og:url" content="${pageUrl}"/>
  <meta property="og:title" content="${metaTitle}"/>
  <meta property="og:description" content="${metaDesc}"/>
  ${ogImage ? `<meta property="og:image" content="${ogImage}"/>` : ''}
  <meta name="twitter:card" content="${ogImage ? 'summary_large_image' : 'summary'}"/>
  <meta name="twitter:title" content="${metaTitle}"/>
  <meta name="twitter:description" content="${metaDesc}"/>
  ${ogImage ? `<meta name="twitter:image" content="${ogImage}"/>` : ''}
  ${pixelHead}
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{
      font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Roboto,Helvetica,Arial,sans-serif;
      min-height:100dvh;display:flex;flex-direction:column;
      background:${tpl.gradient};color:#1d1d1f;-webkit-font-smoothing:antialiased;
    }
    .banner{width:100%;height:180px;object-fit:cover;display:block}
    .wrap{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem 1.5rem 2.5rem;max-width:480px;margin:0 auto;width:100%}
    .emoji{font-size:3rem;margin-bottom:1rem;line-height:1}
    h1{font-size:1.75rem;font-weight:700;letter-spacing:-.02em;text-align:center;line-height:1.2}
    .sub{margin-top:.75rem;font-size:1rem;color:#6e6e73;text-align:center;line-height:1.5}
    .cta{
      display:block;width:100%;max-width:320px;margin-top:2rem;padding:1rem 1.5rem;
      background:${accent};color:#fff;border:none;border-radius:980px;
      font-size:1.0625rem;font-weight:600;text-align:center;text-decoration:none;
      transition:opacity .2s,transform .15s;cursor:pointer;
      box-shadow:0 4px 14px ${accent}40;
    }
    .cta:active{transform:scale(.98);opacity:.9}
    .hub-links{display:flex;flex-direction:column;gap:.75rem;width:100%;max-width:320px;margin-top:2rem}
    .hub-link{margin-top:0!important}
    .lead-form{width:100%;max-width:320px;margin-top:2rem;display:flex;flex-direction:column;gap:.75rem}
    .lead-form input,.lead-form textarea{
      width:100%;padding:.875rem 1rem;border:1px solid #d2d2d7;border-radius:12px;
      font-size:1rem;font-family:inherit;background:#fff;
    }
    .lead-err{color:#ff3b30;font-size:.875rem;text-align:center;margin-top:.25rem}
    .footer{margin-top:auto;padding:1.25rem;text-align:center;font-size:.75rem;color:#86868b}
    .footer a{color:#86868b;text-decoration:none}
  </style>
</head>
<body>
  ${banner ? `<img class="banner" src="${banner}" alt="${bannerAlt}" loading="lazy" decoding="async"/>` : ''}
  <div class="wrap">
    ${!banner && emoji ? `<div class="emoji">${emoji}</div>` : ''}
    <h1>${title}</h1>
    ${subtitle ? `<p class="sub">${subtitle}</p>` : ''}
    ${leadFields}
  </div>
  ${footer}
  ${gpsScript}
</body>
</html>`;
}
