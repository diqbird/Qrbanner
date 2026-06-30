import type { QRStyleConfig } from '@/lib/qr-style';

export interface ScannabilityResult {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  factors: { label: string; impact: number; tip: string }[];
  printDpiRecommendation: number;
}

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
    factors.push({
      label: 'Low contrast',
      impact,
      tip: 'Increase contrast between foreground and background (aim for 4.5:1 or higher).',
    });
  } else if (ratio < 4.5) {
    const impact = -15;
    score += impact;
    factors.push({
      label: 'Moderate contrast',
      impact,
      tip: 'Consider darker dots or a lighter background for outdoor scanning.',
    });
  } else {
    factors.push({ label: 'Good contrast', impact: 0, tip: 'Contrast ratio supports reliable scanning.' });
  }

  const ec = style.errorCorrection ?? 'M';
  const ecScore = EC_SCORE[ec] ?? 75;
  if (opts?.hasLogo && ec !== 'H') {
    const impact = -20;
    score += impact;
    factors.push({
      label: 'Logo without level H',
      impact,
      tip: 'Use error correction H when embedding a logo.',
    });
  }

  const logoSize = opts?.logoSize ?? style.logoSize ?? 0.22;
  if (opts?.hasLogo && logoSize > 0.28) {
    const impact = -18;
    score += impact;
    factors.push({
      label: 'Large logo',
      impact,
      tip: 'Reduce logo size below 28% of QR area for better readability.',
    });
  }

  if (style.gradientEnabled) {
    const impact = -8;
    score += impact;
    factors.push({
      label: 'Gradient fill',
      impact,
      tip: 'Gradients can reduce scan reliability on low-end cameras — test before print.',
    });
  }

  const complexDots = ['dots', 'classy', 'classy-rounded'].includes(style.dotStyle ?? '');
  if (complexDots) {
    const impact = -5;
    score += impact;
    factors.push({
      label: 'Decorative dot style',
      impact,
      tip: 'Rounded/classy dots scan well but may fail at very small print sizes.',
    });
  }

  const len = opts?.contentLength ?? 0;
  if (len > 800) {
    const impact = -12;
    score += impact;
    factors.push({
      label: 'Dense payload',
      impact,
      tip: 'Long content creates a busier QR — use a short link when possible.',
    });
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
): { ok: boolean; minPrintCm: number; message: string } {
  const scan = computeScannability(style, { hasLogo, logoSize: style.logoSize });
  const minPrintCm = scan.printDpiRecommendation <= 150 ? 2 : scan.printDpiRecommendation <= 200 ? 2.5 : 3.5;
  const physicalCm = (sizePx / scan.printDpiRecommendation) * 2.54;
  const ok = physicalCm >= minPrintCm;
  return {
    ok,
    minPrintCm,
    message: ok
      ? `At ${scan.printDpiRecommendation} DPI this QR prints clearly at ~${physicalCm.toFixed(1)} cm.`
      : `Increase print size to at least ${minPrintCm} cm or export at higher resolution (recommended ${scan.printDpiRecommendation} DPI).`,
  };
}
