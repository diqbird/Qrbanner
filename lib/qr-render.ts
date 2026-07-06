import {
  buildQRStylingOptions,
  normalizeQRStyle,
  frameLabelVisible,
  type QRStyleConfig,
} from './qr-style';
import { resolveFrameLabelText } from '@/lib/i18n/resolve-frame-label-text';
import type { Locale } from '@/lib/i18n';

export { frameLabelVisible };

async function blobToCanvas(blob: Blob): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    ctx.drawImage(img, 0, 0);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function frameHasLabelBar(style: QRStyleConfig): boolean {
  return frameLabelVisible(style);
}

function fillFramedBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  style: QRStyleConfig
) {
  if (style.backgroundGradientEnabled && style.backgroundGradientColor2) {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, style.bgColor);
    g.addColorStop(1, style.backgroundGradientColor2);
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = style.bgColor;
  }
  ctx.fillRect(0, 0, w, h);
}

export type QrRenderOptions = {
  size?: number;
  logoUrl?: string | null;
  withFrame?: boolean;
  skipFrameText?: boolean;
  locale?: Locale;
};

function drawLabelBar(
  ctx: CanvasRenderingContext2D,
  style: QRStyleConfig,
  outW: number,
  pad: number,
  qrCanvas: HTMLCanvasElement,
  badgeH: number,
  skipFrameText: boolean,
  locale: Locale = 'en'
) {
  const barY = pad + qrCanvas.height + (style.frameStyle === 'scan-me' ? 8 : 0);
  const barH = badgeH - (style.frameStyle === 'scan-me' ? 8 : 0);
  const frameColor = style.frameColor || style.fgColor;

  ctx.fillStyle = frameColor;
  if (style.frameStyle === 'scan-me') {
    roundRect(ctx, pad - 4, pad - 4, qrCanvas.width + 8, qrCanvas.height + barH + 16, 16);
    ctx.fill();
    ctx.drawImage(qrCanvas, pad, pad);
  } else if (
    ['badge', 'border', 'rounded', 'shadow', 'double', 'sticker', 'coupon'].includes(style.frameStyle)
  ) {
    roundRect(ctx, pad, barY, qrCanvas.width, barH, style.frameStyle === 'coupon' ? 4 : 0);
    ctx.fill();
  }

  ctx.fillStyle = style.frameTextColor;
  const fontSize = Math.max(10, Math.round(barH * 0.42));
  ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const label = resolveFrameLabelText(style.frameText, locale);
  if (!skipFrameText && label) {
    ctx.fillText(label, outW / 2, barY + barH / 2 + (style.frameStyle === 'scan-me' ? 4 : 0));
  }
}

function applyFrame(
  qrCanvas: HTMLCanvasElement,
  style: QRStyleConfig,
  skipFrameText = false,
  locale: Locale = 'en'
): HTMLCanvasElement {
  const pad = Math.round(qrCanvas.width * 0.08);
  const showLabelBar = frameHasLabelBar(style);
  const badgeH = showLabelBar ? Math.round(qrCanvas.width * 0.14) : 0;
  const border = style.frameStyle === 'border' || style.frameStyle === 'rounded' ? 4 : 0;

  const out = document.createElement('canvas');
  out.width = qrCanvas.width + pad * 2;
  out.height = qrCanvas.height + pad * 2 + badgeH;
  const ctx = out.getContext('2d');
  if (!ctx) return qrCanvas;

  fillFramedBackground(ctx, out.width, out.height, style);

  const qrX = pad;
  const qrY = pad;
  const frameColor = style.frameColor || style.fgColor;

  if (style.frameStyle === 'shadow' || style.frameStyle === 'sticker') {
    ctx.save();
    ctx.shadowColor = style.frameStyle === 'shadow' ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0.14)';
    ctx.shadowBlur = style.frameStyle === 'shadow' ? 22 : 14;
    ctx.shadowOffsetY = style.frameStyle === 'shadow' ? 10 : 5;
    const cardH = qrCanvas.height + 16 + (showLabelBar ? badgeH : 0);
    roundRect(ctx, qrX - 8, qrY - 8, qrCanvas.width + 16, cardH, 20);
    if (style.frameStyle === 'sticker') {
      const stickerGrad = ctx.createLinearGradient(0, qrY - 8, 0, qrY + cardH);
      stickerGrad.addColorStop(0, '#ffffff');
      stickerGrad.addColorStop(1, style.bgColor);
      ctx.fillStyle = stickerGrad;
    } else {
      ctx.fillStyle = '#ffffff';
    }
    ctx.fill();
    ctx.restore();
  }

  if (style.frameStyle !== 'scan-me') {
    ctx.drawImage(qrCanvas, qrX, qrY);
  }

  if (style.frameStyle === 'border') {
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = border;
    ctx.strokeRect(pad - 2, pad - 2, qrCanvas.width + 4, qrCanvas.height + 4);
  }

  if (style.frameStyle === 'rounded') {
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = 5;
    roundRect(ctx, pad - 6, pad - 6, qrCanvas.width + 12, qrCanvas.height + 12, 18);
    ctx.stroke();
  }

  if (style.frameStyle === 'double') {
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = 4;
    roundRect(ctx, pad - 10, pad - 10, qrCanvas.width + 20, qrCanvas.height + 20, 12);
    ctx.stroke();
    ctx.strokeStyle = style.fgColor;
    ctx.lineWidth = 2;
    roundRect(ctx, pad - 5, pad - 5, qrCanvas.width + 10, qrCanvas.height + 10, 8);
    ctx.stroke();
  }

  if (style.frameStyle === 'coupon') {
    ctx.setLineDash([8, 5]);
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = 2;
    roundRect(ctx, pad - 6, pad - 6, qrCanvas.width + 12, qrCanvas.height + 12 + (showLabelBar ? badgeH : 0), 6);
    ctx.stroke();
    ctx.setLineDash([]);
    const midY = pad + qrCanvas.height / 2;
    for (const nx of [pad - 6, pad + qrCanvas.width + 6]) {
      ctx.beginPath();
      ctx.arc(nx, midY, 7, 0, Math.PI * 2);
      ctx.fillStyle = style.backgroundGradientEnabled && style.backgroundGradientColor2
        ? style.backgroundGradientColor2
        : style.bgColor;
      ctx.fill();
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  if (style.frameStyle === 'sticker') {
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;
    roundRect(ctx, qrX - 8, qrY - 8, qrCanvas.width + 16, qrCanvas.height + 16 + (showLabelBar ? badgeH : 0), 20);
    ctx.stroke();
  }

  if (showLabelBar) {
    drawLabelBar(ctx, style, out.width, pad, qrCanvas, badgeH, skipFrameText, locale);
  }

  return out;
}

export async function renderStyledQR(
  content: string,
  style: Partial<QRStyleConfig> | Record<string, unknown>,
  options?: QrRenderOptions
): Promise<HTMLCanvasElement> {
  const normalized = normalizeQRStyle(style);
  const size = options?.size ?? 280;
  const withFrame = options?.withFrame ?? normalized.frameStyle !== 'none';
  const skipFrameText = options?.skipFrameText ?? false;
  const locale = options?.locale ?? 'en';

  try {
    const QRCodeStyling = (await import('qr-code-styling')).default;
    const qr = new QRCodeStyling(buildQRStylingOptions(normalized, content, size, options?.logoUrl));

    const raw = await qr.getRawData('png');
    if (!raw) throw new Error('Failed to render QR code');

    const blob = raw instanceof Blob ? raw : new Blob([raw], { type: 'image/png' });
    const qrCanvas = await blobToCanvas(blob);

    if (!withFrame || normalized.frameStyle === 'none') {
      return qrCanvas;
    }
    return applyFrame(qrCanvas, normalized, skipFrameText, locale);
  } catch (e) {
    console.warn('qr-code-styling render failed, using fallback:', e);
    return renderBasicQR(content, normalized, size, withFrame, skipFrameText, locale);
  }
}

async function renderBasicQR(
  content: string,
  style: QRStyleConfig,
  size: number,
  withFrame: boolean,
  skipFrameText = false,
  locale: Locale = 'en'
): Promise<HTMLCanvasElement> {
  const QRCode = (await import('qrcode')).default;
  const canvas = document.createElement('canvas');
  await QRCode.toCanvas(canvas, content, {
    width: size,
    margin: style.margin ?? 2,
    color: {
      dark: style.fgColor,
      light: style.bgColor,
    },
    errorCorrectionLevel: style.errorCorrection,
  });
  if (!withFrame || style.frameStyle === 'none') {
    return canvas;
  }
  return applyFrame(canvas, style, skipFrameText, locale);
}

export async function renderStyledQRDataUrl(
  content: string,
  style: Partial<QRStyleConfig> | Record<string, unknown>,
  options?: QrRenderOptions
): Promise<string> {
  const canvas = await renderStyledQR(content, style, options);
  return canvas.toDataURL('image/png');
}

export async function renderStyledQRSvg(
  content: string,
  style: Partial<QRStyleConfig> | Record<string, unknown>,
  options?: QrRenderOptions
): Promise<string> {
  const normalized = normalizeQRStyle(style);
  const withFrame = options?.withFrame ?? normalized.frameStyle !== 'none';

  if (withFrame) {
    const canvas = await renderStyledQR(content, style, {
      size: options?.size ?? 280,
      logoUrl: options?.logoUrl,
      withFrame: true,
    });
    const width = canvas.width;
    const height = canvas.height;
    const href = canvas.toDataURL('image/png');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><image width="${width}" height="${height}" xlink:href="${href}"/></svg>`;
  }

  const size = options?.size ?? 280;
  const QRCodeStyling = (await import('qr-code-styling')).default;
  const qr = new QRCodeStyling({
    ...buildQRStylingOptions(normalized, content, size, options?.logoUrl),
    type: 'svg',
  });
  const raw = await qr.getRawData('svg');
  if (!raw) throw new Error('Failed to render SVG');
  if (typeof raw === 'string') return raw;
  if (raw instanceof Blob) return await raw.text();
  return raw.toString('utf-8');
}
