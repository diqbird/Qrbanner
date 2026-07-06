import type { QRStyleConfig } from '@/lib/qr-style';

export interface ScannabilityResult {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  factors: { id: ScannabilityFactorId; impact: number }[];
  printDpiRecommendation: number;
}

export type ScannabilityFactorId =
  | 'lowContrast'
  | 'moderateContrast'
  | 'goodContrast'
  | 'logoWithoutH'
  | 'largeLogo'
  | 'gradientFill'
  | 'decorativeDots'
  | 'densePayload';

function contrastRatio(fg: string, bg: string): number {
  const parse = (hex: string) => {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
    const r = ((n >> 16) & 255) / 255;
    const g = ((n >> 8) & 255) / 255;
    const b = (n & 255) / 255;
    const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  };
  try {
    const l1 = parse(fg);
    const l2 = parse(bg);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  } catch {
    return 4.5;
  }
}

const EC_SCORE: Record<string, number> = { L: 60, M: 75, Q: 88, H: 100 };

export function computeScannability(
  style: Partial<QRStyleConfig>,
  opts?: { hasLogo?: boolean; logoSize?: number; contentLength?: number }
): ScannabilityResult {
  const factors: ScannabilityResult['factors'] = [];
  let score = 100;

  const fg = style.fgColor ?? '#000000';
  const bg = style.transparentBg ? '#ffffff' : (style.bgColor ?? '#ffffff');
  const ratio = contrastRatio(fg, bg);

  if (ratio < 3) {
    const impact = -35;
    score += impact;
    factors.push({ id: 'lowContrast', impact });
  } else if (ratio < 4.5) {
    const impact = -15;
    score += impact;
    factors.push({ id: 'moderateContrast', impact });
  } else {
    factors.push({ id: 'goodContrast', impact: 0 });
  }

  const ec = style.errorCorrection ?? 'M';
  const ecScore = EC_SCORE[ec] ?? 75;
  if (opts?.hasLogo && ec !== 'H') {
    const impact = -20;
    score += impact;
    factors.push({ id: 'logoWithoutH', impact });
  }

  const logoSize = opts?.logoSize ?? style.logoSize ?? 0.22;
  if (opts?.hasLogo && logoSize > 0.28) {
    const impact = -18;
    score += impact;
    factors.push({ id: 'largeLogo', impact });
  }

  if (style.gradientEnabled) {
    const impact = -8;
    score += impact;
    factors.push({ id: 'gradientFill', impact });
  }

  const complexDots = ['dots', 'classy', 'classy-rounded'].includes(style.dotStyle ?? '');
  if (complexDots) {
    const impact = -5;
    score += impact;
    factors.push({ id: 'decorativeDots', impact });
  }

  const len = opts?.contentLength ?? 0;
  if (len > 800) {
    const impact = -12;
    score += impact;
    factors.push({ id: 'densePayload', impact });
  }

  score = Math.round(Math.min(100, Math.max(0, (score * 0.6 + ecScore * 0.4))));
  const grade: ScannabilityResult['grade'] =
    score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 45 ? 'D' : 'F';

  const printDpiRecommendation = score >= 85 ? 150 : score >= 70 ? 200 : score >= 55 ? 300 : 600;

  return { score, grade, factors, printDpiRecommendation };
}

export function analyzePrintQuality(
  style: Partial<QRStyleConfig>,
  sizePx: number,
  hasLogo?: boolean
): { ok: boolean; minPrintCm: number; printDpi: number; physicalCm: number } {
  const scan = computeScannability(style, { hasLogo, logoSize: style.logoSize });
  const minPrintCm = scan.printDpiRecommendation <= 150 ? 2 : scan.printDpiRecommendation <= 200 ? 2.5 : 3.5;
  const physicalCm = (sizePx / scan.printDpiRecommendation) * 2.54;
  const ok = physicalCm >= minPrintCm;
  return {
    ok,
    minPrintCm,
    printDpi: scan.printDpiRecommendation,
    physicalCm,
  };
}
