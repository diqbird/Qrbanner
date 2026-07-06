import { renderHubLinkBeacon } from '@/lib/landing-cta-beacon';
import type {
  LandingBlock,
  LandingBlockType,
  HubLink,
  LeadFormConfig,
  SocialPlatform,
  BlockAlign,
} from '@/lib/landing-page';
import type { Locale } from '@/lib/i18n/types';
import { resolveScanPageCopy } from '@/lib/i18n/resolve-scan-page-copy';

export const MAX_BLOCKS = 30;
export const MAX_LINKS_PER_BLOCK = 12;

export const BLOCK_TYPES: LandingBlockType[] = [
  'heading',
  'text',
  'image',
  'button',
  'hubLinks',
  'social',
  'video',
  'leadForm',
  'divider',
  'spacer',
];

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  'instagram',
  'facebook',
  'twitter',
  'tiktok',
  'linkedin',
  'youtube',
  'whatsapp',
  'website',
];

function escapeHtml(str: string): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Only http(s) URLs allowed. Bare domains get https:// prefix. Anything
 *  else (javascript:, data:, mailto injection, etc.) returns ''. */
function safeUrl(raw: string | undefined): string {
  const value = String(raw ?? '').trim();
  if (!value) return '';
  const withProto = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const u = new URL(withProto);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
    return u.toString();
  } catch {
    return '';
  }
}

function alignClass(align?: BlockAlign): string {
  if (align === 'left') return 'al-left';
  if (align === 'right') return 'al-right';
  return 'al-center';
}

/** Extract a safe embed URL for YouTube or Vimeo, else ''. */
function videoEmbed(raw: string | undefined): string {
  const value = String(raw ?? '').trim();
  if (!value) return '';
  const yt = value.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,20})/
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = value.match(/vimeo\.com\/(?:video\/)?(\d{5,15})/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return '';
}

function socialIcon(platform: SocialPlatform): string {
  const svg = (inner: string) =>
    `<svg viewBox="0 0 24 24" aria-hidden="true">${inner}</svg>`;
  switch (platform) {
    case 'instagram':
      return svg(
        '<rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.3" fill="currentColor"/>'
      );
    case 'facebook':
      return svg(
        '<path d="M15 8h-2c-.5 0-1 .5-1 1v2h3l-.5 3H12v7H9v-7H7v-3h2V8.5C9 6.5 10.5 5 12.5 5H15z" fill="currentColor"/>'
      );
    case 'twitter':
      return svg(
        '<path d="M4 4l16 16M20 4L4 20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>'
      );
    case 'tiktok':
      return svg(
        '<path d="M9 15a3 3 0 103 3V6c1 2 2.5 3 4.5 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
      );
    case 'linkedin':
      return svg(
        '<rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 014 0v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
      );
    case 'youtube':
      return svg(
        '<rect x="3" y="6" width="18" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M11 9.5l4 2.5-4 2.5z" fill="currentColor"/>'
      );
    case 'whatsapp':
      return svg(
        '<path d="M4 20l1.5-4A8 8 0 1112 20a8 8 0 01-3.5-.8L4 20z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'
      );
    case 'website':
    default:
      return svg(
        '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" fill="none" stroke="currentColor" stroke-width="2"/>'
      );
  }
}

export interface RenderBlocksContext {
  shortCode: string;
  accent: string;
  preview: boolean;
  goUrl: string;
  locale?: Locale;
}

function renderLeadFormBlock(
  cfg: LeadFormConfig,
  submitLabel: string,
  ctx: RenderBlocksContext
): string {
  const copy = resolveScanPageCopy(ctx.locale ?? 'en');
  const label = escapeHtml(submitLabel || 'Submit');
  return `<form class="lead-form"${ctx.preview ? ' onsubmit="event.preventDefault();return false"' : ''}>
      ${cfg.collectName ? `<input type="text" name="name" placeholder="${copy.leadNamePlaceholder}"/>` : ''}
      ${cfg.collectEmail ? `<input type="email" name="email" placeholder="${copy.leadEmailPlaceholder}" ${cfg.requiredEmail ? 'required' : ''}/>` : ''}
      ${cfg.collectPhone ? `<input type="tel" name="phone" placeholder="${copy.leadPhonePlaceholder}"/>` : ''}
      ${cfg.collectMessage ? `<textarea name="message" placeholder="${copy.leadMessagePlaceholder}" rows="3"></textarea>` : ''}
      <button type="submit" class="cta" style="border:none;cursor:pointer;margin-top:0">${label}</button>
      <p class="lead-err"></p>
    </form>`;
}

function leadFormScript(shortCode: string, goUrl: string, locale: Locale = 'en'): string {
  const copy = resolveScanPageCopy(locale);
  return `<script>
    document.querySelectorAll('form.lead-form').forEach(function(form){
      form.addEventListener('submit',async function(e){
        e.preventDefault();
        var fd=new FormData(this);
        var err=this.querySelector('.lead-err');
        if(err)err.textContent='';
        var body={shortCode:${JSON.stringify(shortCode)}};
        fd.forEach(function(v,k){if(v)body[k]=v});
        try{
          var r=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
          var j=await r.json();
          if(!r.ok){if(err)err.textContent=j.error||${JSON.stringify(copy.leadSubmitFailed)};return;}
          window.location.href=j.redirect||${JSON.stringify(goUrl)};
        }catch(_){if(err)err.textContent=${JSON.stringify(copy.leadNetworkError)};}
      });
    });
  </script>`;
}

/** Renders builder blocks to safe HTML. All user content is HTML-escaped and
 *  all URLs pass through safeUrl(). Returns body html + an optional script
 *  (lead-form handler) that must be injected once near the end of <body>. */
export function renderLandingBlocks(
  blocks: LandingBlock[],
  ctx: RenderBlocksContext
): { html: string; script: string } {
  const parts: string[] = [];
  let hasLeadForm = false;

  for (const block of (blocks ?? []).slice(0, MAX_BLOCKS)) {
    if (!block || typeof block !== 'object') continue;
    switch (block.type) {
      case 'heading': {
        const text = escapeHtml(block.text ?? '');
        if (!text) break;
        const lvl = block.level === 2 ? 2 : block.level === 3 ? 3 : 1;
        parts.push(
          `<div class="blk-heading blk-h${lvl} ${alignClass(block.align)}">${text}</div>`
        );
        break;
      }
      case 'text': {
        const text = escapeHtml(block.text ?? '').replace(/\n/g, '<br/>');
        if (!text) break;
        parts.push(`<p class="blk-text ${alignClass(block.align)}">${text}</p>`);
        break;
      }
      case 'image': {
        const url = safeUrl(block.url);
        if (!url) break;
        const alt = escapeHtml(block.alt ?? '');
        parts.push(
          `<img class="blk-img${block.rounded ? ' rounded' : ''}" src="${escapeHtml(url)}" alt="${alt}" loading="lazy" decoding="async"/>`
        );
        break;
      }
      case 'button': {
        const label = escapeHtml(block.label ?? '');
        const url = safeUrl(block.url);
        if (!label || !url) break;
        const href = ctx.preview ? '#' : escapeHtml(url);
        const variant = block.variant === 'outline' ? 'outline' : 'solid';
        const beacon = ctx.preview ? '' : renderHubLinkBeacon(ctx.shortCode, block.label ?? '');
        parts.push(
          `<a class="blk-btn ${variant}" href="${href}" target="_blank" rel="noopener noreferrer" ${beacon}>${label}</a>`
        );
        break;
      }
      case 'hubLinks': {
        const links = (block.links ?? []).slice(0, MAX_LINKS_PER_BLOCK);
        for (const link of links) {
          const label = escapeHtml(link?.label ?? '');
          const url = safeUrl(link?.url);
          if (!label || !url) continue;
          const href = ctx.preview ? '#' : escapeHtml(url);
          const beacon = ctx.preview ? '' : renderHubLinkBeacon(ctx.shortCode, link.label ?? '');
          parts.push(
            `<a class="blk-btn solid" href="${href}" target="_blank" rel="noopener noreferrer" ${beacon}>${label}</a>`
          );
        }
        break;
      }
      case 'social': {
        const links = (block.links ?? []).slice(0, MAX_LINKS_PER_BLOCK);
        const items: string[] = [];
        for (const link of links) {
          const platform = SOCIAL_PLATFORMS.includes(link?.platform as SocialPlatform)
            ? (link.platform as SocialPlatform)
            : 'website';
          const url = safeUrl(link?.url);
          if (!url) continue;
          const href = ctx.preview ? '#' : escapeHtml(url);
          const beacon = ctx.preview ? '' : renderHubLinkBeacon(ctx.shortCode, platform);
          items.push(
            `<a href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${platform}" ${beacon}>${socialIcon(platform)}</a>`
          );
        }
        if (items.length) parts.push(`<div class="blk-social">${items.join('')}</div>`);
        break;
      }
      case 'video': {
        const embed = videoEmbed(block.url);
        if (!embed) break;
        parts.push(
          `<div class="blk-video"><iframe src="${escapeHtml(embed)}" title="Video" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`
        );
        break;
      }
      case 'leadForm': {
        const cfg: LeadFormConfig = {
          collectName: Boolean(block.config?.collectName),
          collectEmail: block.config?.collectEmail !== false,
          collectPhone: Boolean(block.config?.collectPhone),
          collectMessage: Boolean(block.config?.collectMessage),
          requiredEmail: block.config?.requiredEmail !== false,
        };
        parts.push(renderLeadFormBlock(cfg, block.submitLabel ?? 'Submit', ctx));
        hasLeadForm = true;
        break;
      }
      case 'divider':
        parts.push('<hr class="blk-divider"/>');
        break;
      case 'spacer': {
        const size = block.size === 'sm' ? 'sm' : block.size === 'lg' ? 'lg' : 'md';
        parts.push(`<div class="blk-spacer-${size}"></div>`);
        break;
      }
      default:
        break;
    }
  }

  const html = `<div class="blocks">${parts.join('')}</div>`;
  const script = hasLeadForm && !ctx.preview ? leadFormScript(ctx.shortCode, ctx.goUrl, ctx.locale ?? 'en') : '';
  return { html, script };
}

export function newBlockId(): string {
  return `b_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

/** Defense-in-depth: sanitize the `blocks` field of stored landing page data
 *  before persisting. Leaves everything else untouched and is a no-op for
 *  legacy pages that don't use the builder. */
export function sanitizeStoredLandingPage<T>(data: T): T {
  if (!data || typeof data !== 'object') return data;
  const d = data as Record<string, unknown>;
  if (!('blocks' in d) && !d.builderMode) return data;
  return { ...d, blocks: sanitizeLandingBlocks(d.blocks) } as T;
}

/** Server-side sanitizer: enforces types, caps, and URL safety before persist.
 *  Rendering is also defensive, but this keeps stored JSON clean. */
export function sanitizeLandingBlocks(raw: unknown): LandingBlock[] {
  if (!Array.isArray(raw)) return [];
  const out: LandingBlock[] = [];

  for (const item of raw) {
    if (out.length >= MAX_BLOCKS) break;
    if (!item || typeof item !== 'object') continue;
    const b = item as Record<string, unknown>;
    const type = String(b.type ?? '') as LandingBlockType;
    if (!BLOCK_TYPES.includes(type)) continue;
    const id = typeof b.id === 'string' && b.id.trim() ? b.id.slice(0, 40) : newBlockId();
    const align = (['left', 'center', 'right'] as const).includes(b.align as BlockAlign)
      ? (b.align as BlockAlign)
      : undefined;

    switch (type) {
      case 'heading':
        out.push({
          id,
          type,
          text: String(b.text ?? '').slice(0, 200),
          level: b.level === 2 ? 2 : b.level === 3 ? 3 : 1,
          align,
        });
        break;
      case 'text':
        out.push({ id, type, text: String(b.text ?? '').slice(0, 2000), align });
        break;
      case 'image':
        out.push({
          id,
          type,
          url: safeUrl(b.url as string).slice(0, 500),
          alt: String(b.alt ?? '').slice(0, 200),
          rounded: Boolean(b.rounded),
        });
        break;
      case 'button':
        out.push({
          id,
          type,
          label: String(b.label ?? '').slice(0, 80),
          url: safeUrl(b.url as string).slice(0, 500),
          variant: b.variant === 'outline' ? 'outline' : 'solid',
        });
        break;
      case 'hubLinks': {
        const links = Array.isArray(b.links) ? b.links : [];
        out.push({
          id,
          type,
          links: links
            .slice(0, MAX_LINKS_PER_BLOCK)
            .map((l): HubLink => ({
              label: String((l as HubLink)?.label ?? '').slice(0, 80),
              url: safeUrl((l as HubLink)?.url).slice(0, 500),
            })),
        });
        break;
      }
      case 'social': {
        const links = Array.isArray(b.links) ? b.links : [];
        out.push({
          id,
          type,
          links: links.slice(0, MAX_LINKS_PER_BLOCK).map((l) => {
            const row = l as { platform?: string; url?: string };
            const platform = SOCIAL_PLATFORMS.includes(row?.platform as SocialPlatform)
              ? (row.platform as SocialPlatform)
              : 'website';
            return { platform, url: safeUrl(row?.url).slice(0, 500) };
          }),
        });
        break;
      }
      case 'video':
        out.push({ id, type, url: String(b.url ?? '').slice(0, 500) });
        break;
      case 'leadForm': {
        const c = (b.config ?? {}) as Partial<LeadFormConfig>;
        out.push({
          id,
          type,
          config: {
            collectName: Boolean(c.collectName),
            collectEmail: c.collectEmail !== false,
            collectPhone: Boolean(c.collectPhone),
            collectMessage: Boolean(c.collectMessage),
            requiredEmail: c.requiredEmail !== false,
          },
          submitLabel: String(b.submitLabel ?? '').slice(0, 60) || undefined,
        });
        break;
      }
      case 'divider':
        out.push({ id, type });
        break;
      case 'spacer':
        out.push({
          id,
          type,
          size: b.size === 'sm' ? 'sm' : b.size === 'lg' ? 'lg' : 'md',
        });
        break;
    }
  }

  return out;
}
