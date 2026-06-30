export type DotStyle =
  | 'square'
  | 'dots'
  | 'rounded'
  | 'extra-rounded'
  | 'classy'
  | 'classy-rounded';

export type CornerStyle =
  | 'square'
  | 'dot'
  | 'rounded'
  | 'extra-rounded'
  | 'dots'
  | 'classy'
  | 'classy-rounded';

export type FrameStyle = 'none' | 'border' | 'rounded' | 'badge' | 'scan-me';

import { SHOW_QR_DESCRIPTION } from './marketing-config';

export interface QRStyleConfig {
  fgColor: string;
  bgColor: string;
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  cornerDotStyle: CornerStyle;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  gradientEnabled: boolean;
  gradientColor2: string;
  gradientType: 'linear' | 'radial';
  gradientRotation: number;
  cornerColor: string;
  cornerDotColor: string;
  frameStyle: FrameStyle;
  frameColor: string;
  frameText: string;
  frameTextColor: string;
  logoSize: number;
  transparentBg: boolean;
  /** Quiet zone (modules) around QR — 0–20 */
  margin: number;
}

export const DOT_STYLES: { id: DotStyle; label: string }[] = [
  { id: 'square', label: 'Square' },
  { id: 'dots', label: 'Dots' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'extra-rounded', label: 'Extra Round' },
  { id: 'classy', label: 'Classy' },
  { id: 'classy-rounded', label: 'Classy Round' },
];

export const CORNER_STYLES: { id: CornerStyle; label: string }[] = [
  { id: 'square', label: 'Square' },
  { id: 'dot', label: 'Dot' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'extra-rounded', label: 'Extra Round' },
  { id: 'dots', label: 'Dots' },
  { id: 'classy', label: 'Classy' },
  { id: 'classy-rounded', label: 'Classy Round' },
];

export const FRAME_STYLES: { id: FrameStyle; label: string; description: string }[] = [
  { id: 'none', label: 'None', description: 'QR only' },
  { id: 'border', label: 'Border', description: 'Simple outline' },
  { id: 'rounded', label: 'Rounded', description: 'Soft rounded frame' },
  { id: 'badge', label: 'Badge', description: 'Bottom label bar' },
  { id: 'scan-me', label: 'Scan Me', description: 'Bold call-to-action frame' },
];

export const FRAME_TEXT_PRESETS: { label: string; text: string }[] = [
  { label: 'Scan me', text: 'Scan me' },
  { label: 'Follow us', text: 'Follow us' },
  { label: 'View menu', text: 'View menu' },
  { label: 'Subscribe', text: 'Subscribe' },
  { label: 'Register', text: 'Register' },
  { label: 'Wi‑Fi', text: 'Wi‑Fi' },
  { label: 'Contact', text: 'Contact us' },
  { label: 'Donate', text: 'Donate' },
  { label: 'Book now', text: 'Book now' },
  { label: 'Shop now', text: 'Shop now' },
  { label: 'Learn more', text: 'Learn more' },
  { label: 'Open link', text: 'Open link' },
];

export const ERROR_LEVELS = ['L', 'M', 'Q', 'H'] as const;

export const DEFAULT_QR_STYLE: QRStyleConfig = {
  fgColor: '#000000',
  bgColor: '#FFFFFF',
  dotStyle: 'square',
  cornerStyle: 'square',
  cornerDotStyle: 'square',
  errorCorrection: 'M',
  gradientEnabled: false,
  gradientColor2: '#4f46e5',
  gradientType: 'linear',
  gradientRotation: 45,
  cornerColor: '',
  cornerDotColor: '',
  frameStyle: 'none',
  frameColor: '#000000',
  frameText: 'Scan me',
  frameTextColor: '#FFFFFF',
  logoSize: 0.22,
  transparentBg: false,
  margin: 6,
};

export const STYLE_PRESETS: { name: string; style: Partial<QRStyleConfig> }[] = [
  { name: 'Classic', style: { fgColor: '#000000', bgColor: '#FFFFFF', dotStyle: 'square', cornerStyle: 'square' } },
  { name: 'Ocean', style: { fgColor: '#0369a1', bgColor: '#f0f9ff', dotStyle: 'rounded', cornerStyle: 'extra-rounded', gradientEnabled: true, gradientColor2: '#0ea5e9' } },
  { name: 'Sunset', style: { fgColor: '#c2410c', bgColor: '#fff7ed', dotStyle: 'dots', cornerStyle: 'dot', gradientEnabled: true, gradientColor2: '#f59e0b', gradientRotation: 135 } },
  { name: 'Forest', style: { fgColor: '#166534', bgColor: '#f0fdf4', dotStyle: 'classy-rounded', cornerStyle: 'classy-rounded' } },
  { name: 'Midnight', style: { fgColor: '#e2e8f0', bgColor: '#0f172a', dotStyle: 'rounded', cornerStyle: 'extra-rounded', frameStyle: 'rounded', frameColor: '#334155' } },
  { name: 'Brand', style: { fgColor: '#4f46e5', bgColor: '#FFFFFF', dotStyle: 'classy', cornerStyle: 'classy', gradientEnabled: true, gradientColor2: '#7c3aed', frameStyle: 'badge', frameColor: '#4f46e5', frameText: 'SCAN ME' } },
];

type GradientOpts = {
  type: 'linear' | 'radial';
  rotation: number;
  colorStops: { offset: number; color: string }[];
};

function buildFill(color: string, gradient?: GradientOpts) {
  if (gradient) return { gradient };
  return { color };
}

function mainGradient(style: QRStyleConfig): GradientOpts | undefined {
  if (!style.gradientEnabled || !style.gradientColor2) return undefined;
  return {
    type: style.gradientType,
    rotation: (style.gradientRotation * Math.PI) / 180,
    colorStops: [
      { offset: 0, color: style.fgColor },
      { offset: 1, color: style.gradientColor2 },
    ],
  };
}

export function normalizeQRStyle(input?: Partial<QRStyleConfig> | Record<string, unknown> | null): QRStyleConfig {
  const s = { ...DEFAULT_QR_STYLE, ...(input ?? {}) } as QRStyleConfig;
  return {
    ...DEFAULT_QR_STYLE,
    ...s,
    errorCorrection: (['L', 'M', 'Q', 'H'].includes(s.errorCorrection) ? s.errorCorrection : 'M') as QRStyleConfig['errorCorrection'],
    margin: Math.min(20, Math.max(0, Number(s.margin) || 6)),
  };
}

export function frameLabelVisible(
  style: QRStyleConfig,
  options?: { showQrDescription?: boolean }
): boolean {
  const show = options?.showQrDescription ?? SHOW_QR_DESCRIPTION;
  if (!show) return false;
  if (style.frameStyle === 'none') return false;
  return ['badge', 'scan-me', 'border', 'rounded'].includes(style.frameStyle);
}

/** Label bar position as fractions of the framed canvas (preview base 280px). */
export function getFrameLabelRect(style: QRStyleConfig): {
  left: number;
  top: number;
  width: number;
  height: number;
} {
  const W = 280;
  const pad = Math.round(W * 0.08);
  const badgeH = Math.round(W * 0.14);
  const scanOffset = style.frameStyle === 'scan-me' ? 8 : 0;
  const barH = badgeH - scanOffset;
  const outW = W + pad * 2;
  const outH = W + pad * 2 + badgeH;
  const barY = pad + W + scanOffset;
  return {
    left: pad / outW,
    top: barY / outH,
    width: W / outW,
    height: barH / outH,
  };
}

export function patchFrameText(
  style: QRStyleConfig,
  text: string
): Partial<QRStyleConfig> {
  const frameText = text.slice(0, 32);
  const patch: Partial<QRStyleConfig> = { frameText };
  if (frameText.trim() && style.frameStyle === 'none') {
    patch.frameStyle = 'scan-me';
  }
  return patch;
}

export function buildQRStylingOptions(style: Partial<QRStyleConfig>, content: string, size: number, logoUrl?: string | null) {
  const s = normalizeQRStyle(style);
  const grad = mainGradient(s);
  const cornerFill = s.cornerColor || s.fgColor;
  const cornerDotFill = s.cornerDotColor || cornerFill;
  const cornerGrad = grad && !s.cornerColor ? grad : undefined;
  const cornerDotGrad = grad && !s.cornerDotColor && !s.cornerColor ? grad : undefined;

  return {
    width: size,
    height: size,
    type: 'canvas' as const,
    data: content,
    margin: s.margin ?? 6,
    qrOptions: {
      errorCorrectionLevel: s.errorCorrection,
    },
    dotsOptions: {
      type: s.dotStyle,
      ...buildFill(s.fgColor, grad),
    },
    cornersSquareOptions: {
      type: s.cornerStyle,
      ...buildFill(cornerFill, cornerGrad),
    },
    cornersDotOptions: {
      type: s.cornerDotStyle,
      ...buildFill(cornerDotFill, cornerDotGrad),
    },
    backgroundOptions: {
      color: s.transparentBg ? 'transparent' : s.bgColor,
    },
    image: logoUrl || undefined,
    imageOptions: logoUrl
      ? {
          crossOrigin: 'anonymous' as const,
          margin: 6,
          imageSize: s.logoSize ?? 0.22,
        }
      : undefined,
  };
}
