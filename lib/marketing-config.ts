/** Env default for QR caption bar. Admin can override at runtime via Site Admin → Site settings. */
export const SHOW_QR_DESCRIPTION =
  process.env.NEXT_PUBLIC_SHOW_QR_DESCRIPTION !== 'false';

export const HERO_VIDEO_URL = process.env.NEXT_PUBLIC_HERO_VIDEO_URL?.trim() || '';

export const CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID?.trim() || '';

export const G2_REVIEW_URL = process.env.NEXT_PUBLIC_G2_REVIEW_URL?.trim() || '';
export const CAPTERRA_REVIEW_URL = process.env.NEXT_PUBLIC_CAPTERRA_REVIEW_URL?.trim() || '';

export type VideoEmbed = { type: 'youtube' | 'loom' | 'mp4'; src: string };

export function parseHeroVideoEmbed(raw: string): VideoEmbed | null {
  const url = raw.trim();
  if (!url) return null;

  if (/\.mp4(\?|$)/i.test(url)) {
    return { type: 'mp4', src: url };
  }

  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      if (id) return { type: 'youtube', src: `https://www.youtube-nocookie.com/embed/${id}` };
    }
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '');
      if (id) return { type: 'youtube', src: `https://www.youtube-nocookie.com/embed/${id}` };
    }
    if (u.hostname.includes('loom.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      if (id) return { type: 'loom', src: `https://www.loom.com/embed/${id}` };
    }
  } catch {
    return null;
  }
  return null;
}

export function heroVideoEmbed(): VideoEmbed | null {
  return parseHeroVideoEmbed(HERO_VIDEO_URL);
}
