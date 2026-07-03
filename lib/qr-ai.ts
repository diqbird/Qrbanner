import type { QRStyleConfig } from '@/lib/qr-style';
import { STYLE_PRESETS } from '@/lib/qr-style';

export interface AiSuggestion {
  id: string;
  title: string;
  description: string;
  stylePatch?: Partial<QRStyleConfig>;
  logoSize?: number;
}

function hashHue(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h % 360;
}

function hslToHex(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/** Rule-based brand palette from name or domain (no external API). */
export function generateBrandPalette(seed: string): { primary: string; secondary: string; accent: string } {
  const h = hashHue(seed.toLowerCase().trim() || 'brand');
  return {
    primary: hslToHex(h, 0.65, 0.45),
    secondary: hslToHex((h + 40) % 360, 0.55, 0.55),
    accent: hslToHex((h + 180) % 360, 0.7, 0.5),
  };
}

export function suggestStyleForCategory(category: string, brandName?: string): Partial<QRStyleConfig> {
  const palette = generateBrandPalette(brandName ?? category);
  const presets: Record<string, Partial<QRStyleConfig>> = {
    restaurant: { fgColor: palette.primary, bgColor: '#fffbeb', dotStyle: 'rounded', frameStyle: 'badge', frameText: 'VIEW MENU', gradientEnabled: true, gradientColor2: palette.secondary },
    menu: { fgColor: palette.primary, bgColor: '#fffbeb', dotStyle: 'rounded', frameStyle: 'badge', frameText: 'MENU' },
    wedding: { fgColor: '#9d174d', bgColor: '#fdf2f8', dotStyle: 'classy-rounded', cornerStyle: 'extra-rounded', gradientEnabled: true, gradientColor2: '#f472b6' },
    event: { fgColor: palette.primary, bgColor: '#f0f9ff', dotStyle: 'rounded', frameStyle: 'scan-me', frameText: 'REGISTER' },
    instagram: { fgColor: '#c13584', bgColor: '#ffffff', gradientEnabled: true, gradientColor2: '#f56040', dotStyle: 'dots' },
    youtube: { fgColor: '#ff0000', bgColor: '#ffffff', frameStyle: 'badge', frameText: 'SUBSCRIBE' },
    crypto: { fgColor: '#f59e0b', bgColor: '#0f172a', dotStyle: 'square', cornerStyle: 'square' },
    vcard: { fgColor: palette.primary, bgColor: '#ffffff', dotStyle: 'classy', frameStyle: 'rounded' },
    wifi: { fgColor: '#0369a1', bgColor: '#f0f9ff', dotStyle: 'rounded' },
    google_review: { fgColor: '#4285f4', bgColor: '#ffffff', dotStyle: 'rounded', frameStyle: 'badge', frameText: 'REVIEW US', gradientEnabled: true, gradientColor2: '#34a853' },
    paypal: { fgColor: '#003087', bgColor: '#ffffff', dotStyle: 'classy', frameStyle: 'badge', frameText: 'PAY NOW', gradientEnabled: true, gradientColor2: '#009cde' },
    upi: { fgColor: '#097969', bgColor: '#f0fdf4', dotStyle: 'rounded', frameStyle: 'scan-me', frameText: 'SCAN & PAY' },
    signal: { fgColor: '#3a76f0', bgColor: '#ffffff', dotStyle: 'dots', frameStyle: 'rounded' },
    apple_music: { fgColor: '#fa243c', bgColor: '#1c1c1e', dotStyle: 'rounded', frameStyle: 'badge', frameText: 'LISTEN', frameTextColor: '#ffffff' },
    google_drive: { fgColor: '#4285f4', bgColor: '#ffffff', dotStyle: 'square', frameStyle: 'rounded' },
    dropbox: { fgColor: '#0061ff', bgColor: '#f0f7ff', dotStyle: 'rounded', frameStyle: 'badge', frameText: 'OPEN FILE' },
  };
  return presets[category] ?? {
    fgColor: palette.primary,
    bgColor: '#ffffff',
    gradientEnabled: true,
    gradientColor2: palette.secondary,
    dotStyle: 'rounded',
    cornerStyle: 'extra-rounded',
  };
}

export function suggestLogoSize(aspectRatio?: number): number {
  if (!aspectRatio || !Number.isFinite(aspectRatio)) return 0.22;
  if (aspectRatio > 1.4) return 0.18;
  if (aspectRatio < 0.75) return 0.2;
  return 0.24;
}

export function getSmartQrSuggestions(category: string, name?: string): AiSuggestion[] {
  const style = suggestStyleForCategory(category, name);
  const suggestions: AiSuggestion[] = [
    {
      id: 'brand-style',
      title: 'AI Brand Style',
      description: `Palette tuned for ${category} use case.`,
      stylePatch: style,
    },
    {
      id: 'scan-optimized',
      title: 'Scan-Optimized',
      description: 'High error correction and strong contrast for print.',
      stylePatch: { ...style, errorCorrection: 'H', fgColor: style.fgColor ?? '#000000', bgColor: '#ffffff', gradientEnabled: false },
    },
  ];

  if (['menu', 'restaurant', 'event', 'wedding'].includes(category)) {
    suggestions.push({
      id: 'landing',
      title: 'Landing Page + Lead Form',
      description: 'Enable a mini landing page before redirect to capture leads.',
    });
  }

  if (['instagram', 'youtube', 'tiktok', 'linkedin', 'apple_music'].includes(category)) {
    suggestions.push({
      id: 'social-frame',
      title: 'Social CTA Frame',
      description: 'Add a “Scan Me” frame for posters and stories.',
      stylePatch: { frameStyle: 'scan-me', frameText: 'FOLLOW US', errorCorrection: 'H' },
    });
  }

  return suggestions;
}

export function applyBrandGenerator(name: string): Partial<QRStyleConfig> {
  const p = generateBrandPalette(name);
  const preset = STYLE_PRESETS.find((s) => s.name === 'Brand');
  return {
    ...(preset?.style ?? {}),
    fgColor: p.primary,
    gradientEnabled: true,
    gradientColor2: p.secondary,
    frameColor: p.primary,
    cornerColor: p.accent,
  };
}
