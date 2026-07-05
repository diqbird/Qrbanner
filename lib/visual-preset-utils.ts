import { VISUAL_QR_PRESETS } from '@/lib/visual-qr-presets';
import { normalizeQRStyle, type QRStyleConfig } from '@/lib/qr-style';

export function findMatchingVisualPresetId(style: Partial<QRStyleConfig>): string | undefined {
  const s = normalizeQRStyle(style);
  return VISUAL_QR_PRESETS.find(
    (p) =>
      p.style.fgColor === s.fgColor &&
      p.style.bgColor === s.bgColor &&
      (p.style.dotStyle ?? 'square') === s.dotStyle &&
      (p.style.frameStyle ?? 'none') === s.frameStyle,
  )?.id;
}
