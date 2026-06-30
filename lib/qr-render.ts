import {
  buildQRStylingOptions,
  normalizeQRStyle,
  frameLabelVisible,
  type QRStyleConfig,
} from './qr-style';

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

function applyFrame(
  qrCanvas: HTMLCanvasElement,
  style: QRStyleConfig,
  skipFrameText = false
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

  ctx.fillStyle = style.bgColor;
  ctx.fillRect(0, 0, out.width, out.height);

  const qrX = pad;
  const qrY = pad;
  ctx.drawImage(qrCanvas, qrX, qrY);

  const frameColor = style.frameColor || style.fgColor;

  if (style.frameStyle === 'border') {
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = border;
    ctx.strokeRect(pad - 2, pad - 2, qrCanvas.width + 4, qrCanvas.height + 4);
  }

  if (style.frameStyle === 'rounded') {
    const rx = pad - 6;
    const ry = pad - 6;
    const rw = qrCanvas.width + 12;
    const rh = qrCanvas.height + 12;
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = 5;
    roundRect(ctx, rx, ry, rw, rh, 18);
    ctx.stroke();
  }

  if (showLabelBar) {
    const barY = pad + qrCanvas.height + (style.frameStyle === 'scan-me' ? 8 : 0);
    const barH = badgeH - (style.frameStyle === 'scan-me' ? 8 : 0);
    ctx.fillStyle = frameColor;
    if (style.frameStyle === 'scan-me') {
      roundRect(ctx, pad - 4, pad - 4, qrCanvas.width + 8, qrCanvas.height + barH + 16, 16);
      ctx.fill();
      ctx.drawImage(qrCanvas, qrX, qrY);
    } else if (style.frameStyle === 'badge' || style.frameStyle === 'border' || style.frameStyle === 'rounded') {
      ctx.fillRect(pad, barY, qrCanvas.width, barH);
    }

    ctx.fillStyle = style.frameTextColor;
    const fontSize = Math.max(10, Math.round(barH * 0.42));
    ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const label = (style.frameText || 'Scan me').trim().slice(0, 32);
    if (!skipFrameText) {
      ctx.fillText(
        label,
        out.width / 2,
        barY + barH / 2 + (style.frameStyle === 'scan-me' ? 4 : 0)
      );
    }
  }

  return out;
}

export async function renderStyledQR(
  content: string,
  style: Partial<QRStyleConfig> | Record<string, unknown>,
  options?: { size?: number; logoUrl?: string | null; withFrame?: boolean; skipFrameText?: boolean }
): Promise<HTMLCanvasElement> {
  const normalized = normalizeQRStyle(style);
  const size = options?.size ?? 280;
  const withFrame = options?.withFrame ?? normalized.frameStyle !== 'none';
  const skipFrameText = options?.skipFrameText ?? false;

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
    return applyFrame(qrCanvas, normalized, skipFrameText);
  } catch (e) {
    console.warn('qr-code-styling render failed, using fallback:', e);
    return renderBasicQR(content, normalized, size, withFrame, skipFrameText);
  }
}

async function renderBasicQR(
  content: string,
  style: QRStyleConfig,
  size: number,
  withFrame: boolean,
  skipFrameText = false
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
  return applyFrame(canvas, style, skipFrameText);
}

export async function renderStyledQRDataUrl(
  content: string,
  style: Partial<QRStyleConfig> | Record<string, unknown>,
  options?: { size?: number; logoUrl?: string | null; withFrame?: boolean }
): Promise<string> {
  const canvas = await renderStyledQR(content, style, options);
  return canvas.toDataURL('image/png');
}

export async function renderStyledQRSvg(
  content: string,
  style: Partial<QRStyleConfig> | Record<string, unknown>,
  options?: { size?: number; logoUrl?: string | null; withFrame?: boolean }
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
