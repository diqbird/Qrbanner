import { normalizeQRStyle, type QRStyleConfig } from './qr-style';

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim();
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const int = parseInt(full.slice(0, 6) || '000000', 16);
  const r = (int >> 16) & 0xff;
  const g = (int >> 8) & 0xff;
  const b = int & 0xff;
  return [r / 255, g / 255, b / 255];
}

/**
 * Render a QR code as a true vector EPS (PostScript) document.
 * Print shops require scalable vector output; this draws each dark module
 * as a filled rectangle. Frames, logos and gradients are intentionally
 * omitted to keep the output a clean, scannable, single-color vector.
 */
export async function renderStyledQREps(
  content: string,
  style: Partial<QRStyleConfig> | Record<string, unknown>,
  options?: { size?: number }
): Promise<string> {
  const normalized = normalizeQRStyle(style);
  const QRCode = (await import('qrcode')).default;

  const qr = QRCode.create(content, {
    errorCorrectionLevel: normalized.errorCorrection,
  });
  const count = qr.modules.size;
  const data = qr.modules.data;

  const margin = Math.max(0, Math.round(normalized.margin ?? 2));
  const totalModules = count + margin * 2;
  const dimension = options?.size ?? 1024;
  const moduleSize = dimension / totalModules;

  const [fr, fg, fb] = hexToRgb(normalized.fgColor);
  const [br, bg, bb] = normalized.transparentBg
    ? [1, 1, 1]
    : hexToRgb(normalized.bgColor);

  const lines: string[] = [];
  lines.push('%!PS-Adobe-3.0 EPSF-3.0');
  lines.push(`%%BoundingBox: 0 0 ${Math.ceil(dimension)} ${Math.ceil(dimension)}`);
  lines.push('%%Creator: QRbanner');
  lines.push('%%Title: QR Code');
  lines.push('%%EndComments');

  if (!normalized.transparentBg) {
    lines.push(`${br.toFixed(4)} ${bg.toFixed(4)} ${bb.toFixed(4)} setrgbcolor`);
    lines.push(`0 0 ${dimension.toFixed(3)} ${dimension.toFixed(3)} rectfill`);
  }

  lines.push(`${fr.toFixed(4)} ${fg.toFixed(4)} ${fb.toFixed(4)} setrgbcolor`);

  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      const dark = data[row * count + col];
      if (!dark) continue;
      const x = (col + margin) * moduleSize;
      // EPS origin is bottom-left, so flip the row axis.
      const y = (totalModules - 1 - (row + margin)) * moduleSize;
      lines.push(
        `${x.toFixed(3)} ${y.toFixed(3)} ${moduleSize.toFixed(3)} ${moduleSize.toFixed(3)} rectfill`
      );
    }
  }

  lines.push('showpage');
  lines.push('%%EOF');
  return lines.join('\n');
}
