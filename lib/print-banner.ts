import { jsPDF } from 'jspdf';
import { renderStyledQR } from '@/lib/qr-render';
import { normalizeQRStyle, type QRStyleConfig } from '@/lib/qr-style';

export type PrintTemplateId =
  | 'a4-portrait'
  | 'a4-landscape'
  | 'a5-flyer'
  | 'desk-stand'
  | 'rollup'
  | 'story'
  | 'business-card'
  | 'sticker'
  | 'table-card';

export interface PrintTemplate {
  id: PrintTemplateId;
  name: string;
  description: string;
  width: number;
  height: number;
  /** Typical physical size label for UI */
  physicalSize?: string;
  useCase?: string;
}

export const PRINT_TEMPLATES: PrintTemplate[] = [
  { id: 'a4-portrait', name: 'A4 Poster', description: '210 × 297 mm — wall & window', physicalSize: 'A4', useCase: 'Poster, window, entrance', width: 1240, height: 1754 },
  { id: 'a4-landscape', name: 'A4 Landscape', description: '297 × 210 mm — yard signs & horizontal', physicalSize: 'A4 landscape', useCase: 'Yard sign, truck decal', width: 1754, height: 1240 },
  { id: 'a5-flyer', name: 'A5 Flyer', description: '148 × 210 mm — handouts & inserts', physicalSize: 'A5', useCase: 'Flyer, invitation insert', width: 874, height: 1240 },
  { id: 'desk-stand', name: 'Desk Stand', description: 'Table tent — fold & stand', physicalSize: 'A4 tent', useCase: 'Restaurant table, lobby', width: 1240, height: 1754 },
  { id: 'rollup', name: 'Roll-up Preview', description: '85 × 200 cm scaled preview', physicalSize: '85×200 cm', useCase: 'Event entrance, trade show', width: 850, height: 2000 },
  { id: 'story', name: 'Story / Vertical', description: '1080 × 1920 — social & displays', physicalSize: '9:16', useCase: 'Instagram story, digital screen', width: 1080, height: 1920 },
  { id: 'business-card', name: 'Business Card', description: '85 × 55 mm — contact & networking', physicalSize: '85×55 mm', useCase: 'Business card, badge', width: 1050, height: 650 },
  { id: 'sticker', name: 'Sticker / Label', description: '76 × 76 mm — packaging & shelf', physicalSize: '3×3 in', useCase: 'Product label, Wi‑Fi sticker', width: 900, height: 900 },
  { id: 'table-card', name: 'Table Card', description: '100 × 150 mm — counter & mirror cling', physicalSize: '100×150 mm', useCase: 'Café counter, salon reception', width: 800, height: 1200 },
];

export interface PrintBannerOptions {
  templateId: PrintTemplateId;
  title: string;
  subtitle: string;
  qrContent: string;
  fgColor: string;
  bgColor: string;
  accentColor: string;
  logoDataUrl?: string | null;
  style?: Partial<QRStyleConfig>;
}

function getTemplate(id: PrintTemplateId): PrintTemplate {
  return PRINT_TEMPLATES.find((t) => t.id === id) ?? PRINT_TEMPLATES[0];
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

async function drawQr(
  content: string,
  size: number,
  style: Partial<QRStyleConfig>,
  logoDataUrl?: string | null
): Promise<HTMLCanvasElement> {
  return renderStyledQR(content, { ...style, frameStyle: 'none' }, {
    size: Math.round(size),
    logoUrl: logoDataUrl,
    withFrame: false,
  });
}

function drawRoundedRect(
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

export async function renderPrintBanner(options: PrintBannerOptions): Promise<HTMLCanvasElement> {
  if (options.templateId === 'business-card') {
    return renderBusinessCardBanner(options);
  }
  if (options.templateId === 'sticker') {
    return renderStickerBanner(options);
  }
  if (options.templateId === 'table-card') {
    return renderTableCardBanner(options);
  }
  return renderStandardPrintBanner(options);
}

async function renderBusinessCardBanner(options: PrintBannerOptions): Promise<HTMLCanvasElement> {
  const tpl = getTemplate('business-card');
  const canvas = document.createElement('canvas');
  canvas.width = tpl.width;
  canvas.height = tpl.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  const accent = options.accentColor || '#0071e3';
  const pad = tpl.width * 0.08;
  fillPrintBackground(ctx, tpl.width, tpl.height, options);

  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, tpl.width * 0.04, tpl.height);

  const qrSize = Math.round(tpl.height * 0.7);
  const qrX = tpl.width - qrSize - pad;
  const qrY = (tpl.height - qrSize) / 2;
  const qrStyle = normalizeQRStyle({
    ...options.style,
    fgColor: options.fgColor,
    bgColor: options.bgColor,
    errorCorrection: options.style?.errorCorrection ?? 'H',
  });
  const qrCanvas = await drawQr(options.qrContent, qrSize, qrStyle, options.logoDataUrl);
  ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#1d1d1f';
  ctx.font = `bold ${Math.round(tpl.height * 0.11)}px -apple-system, sans-serif`;
  const title = options.title || 'Scan Me';
  wrapText(ctx, title, qrX - pad * 2).slice(0, 2).forEach((line, i) => {
    ctx.fillText(line, pad, tpl.height * 0.28 + i * tpl.height * 0.14);
  });

  if (options.subtitle) {
    ctx.fillStyle = '#6e6e73';
    ctx.font = `${Math.round(tpl.height * 0.065)}px -apple-system, sans-serif`;
    wrapText(ctx, options.subtitle, qrX - pad * 2).slice(0, 2).forEach((line, i) => {
      ctx.fillText(line, pad, tpl.height * 0.55 + i * tpl.height * 0.09);
    });
  }

  ctx.fillStyle = '#aeaeb2';
  ctx.font = `${Math.round(tpl.height * 0.045)}px -apple-system, sans-serif`;
  ctx.fillText('qrbanner.com', pad, tpl.height - pad * 0.6);
  return canvas;
}

async function renderStickerBanner(options: PrintBannerOptions): Promise<HTMLCanvasElement> {
  const tpl = getTemplate('sticker');
  const canvas = document.createElement('canvas');
  canvas.width = tpl.width;
  canvas.height = tpl.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  const accent = options.accentColor || '#0071e3';
  fillPrintBackground(ctx, tpl.width, tpl.height, options);

  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, tpl.width - 16, tpl.height - 16);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#1d1d1f';
  ctx.font = `bold ${Math.round(tpl.width * 0.055)}px -apple-system, sans-serif`;
  ctx.fillText((options.title || 'Scan Me').slice(0, 24), tpl.width / 2, tpl.width * 0.1);

  const qrSize = Math.round(tpl.width * 0.58);
  const qrY = tpl.width * 0.16;
  const qrStyle = normalizeQRStyle({
    ...options.style,
    fgColor: options.fgColor,
    bgColor: options.bgColor,
    errorCorrection: 'H',
    margin: 10,
  });
  const qrCanvas = await drawQr(options.qrContent, qrSize, qrStyle, options.logoDataUrl);
  ctx.drawImage(qrCanvas, (tpl.width - qrSize) / 2, qrY, qrSize, qrSize);

  ctx.fillStyle = accent;
  ctx.font = `600 ${Math.round(tpl.width * 0.038)}px -apple-system, sans-serif`;
  ctx.fillText('Scan with camera', tpl.width / 2, qrY + qrSize + tpl.width * 0.08);

  ctx.fillStyle = '#86868b';
  ctx.font = `${Math.round(tpl.width * 0.028)}px -apple-system, sans-serif`;
  if (options.subtitle) {
    wrapText(ctx, options.subtitle, tpl.width * 0.85).slice(0, 2).forEach((line, i) => {
      ctx.fillText(line, tpl.width / 2, qrY + qrSize + tpl.width * 0.14 + i * tpl.width * 0.05);
    });
  }

  return canvas;
}

async function renderTableCardBanner(options: PrintBannerOptions): Promise<HTMLCanvasElement> {
  const tpl = getTemplate('table-card');
  const canvas = document.createElement('canvas');
  canvas.width = tpl.width;
  canvas.height = tpl.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  const accent = options.accentColor || '#0071e3';
  const pad = tpl.width * 0.1;
  fillPrintBackground(ctx, tpl.width, tpl.height, options);

  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, tpl.width, tpl.height * 0.018);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#1d1d1f';
  ctx.font = `bold ${Math.round(tpl.width * 0.085)}px -apple-system, sans-serif`;
  wrapText(ctx, options.title || 'Scan Me', tpl.width - pad * 2).slice(0, 2).forEach((line, i) => {
    ctx.fillText(line, tpl.width / 2, tpl.height * 0.12 + i * tpl.width * 0.1);
  });

  if (options.subtitle) {
    ctx.fillStyle = '#6e6e73';
    ctx.font = `${Math.round(tpl.width * 0.042)}px -apple-system, sans-serif`;
    wrapText(ctx, options.subtitle, tpl.width - pad * 2).slice(0, 2).forEach((line, i) => {
      ctx.fillText(line, tpl.width / 2, tpl.height * 0.26 + i * tpl.width * 0.055);
    });
  }

  const qrSize = Math.min(tpl.width * 0.55, tpl.height * 0.38);
  const qrStyle = normalizeQRStyle({
    ...options.style,
    fgColor: options.fgColor,
    bgColor: options.bgColor,
    errorCorrection: options.style?.errorCorrection ?? 'H',
  });
  const qrCanvas = await drawQr(options.qrContent, qrSize, qrStyle, options.logoDataUrl);
  const qrY = tpl.height * 0.34;
  ctx.drawImage(qrCanvas, (tpl.width - qrSize) / 2, qrY, qrSize, qrSize);

  ctx.fillStyle = accent;
  ctx.font = `600 ${Math.round(tpl.width * 0.04)}px -apple-system, sans-serif`;
  ctx.fillText('Scan with your camera', tpl.width / 2, qrY + qrSize + tpl.width * 0.1);

  ctx.fillStyle = '#aeaeb2';
  ctx.font = `${Math.round(tpl.width * 0.03)}px -apple-system, sans-serif`;
  ctx.fillText('qrbanner.com', tpl.width / 2, tpl.height - pad * 0.5);
  return canvas;
}

function fillPrintBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  options: PrintBannerOptions
) {
  const bg2 = options.style?.backgroundGradientColor2 ?? '#f0f4ff';
  if (options.style?.backgroundGradientEnabled) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, options.bgColor || '#ffffff');
    grad.addColorStop(0.5, bg2);
    grad.addColorStop(1, '#ffffff');
    ctx.fillStyle = grad;
  } else {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#f5f5f7');
    grad.addColorStop(1, '#ffffff');
    ctx.fillStyle = grad;
  }
  ctx.fillRect(0, 0, w, h);
}

async function renderStandardPrintBanner(options: PrintBannerOptions): Promise<HTMLCanvasElement> {
  const tpl = getTemplate(options.templateId);
  const canvas = document.createElement('canvas');
  canvas.width = tpl.width;
  canvas.height = tpl.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  const accent = options.accentColor || '#0071e3';
  const pad = tpl.width * 0.08;

  fillPrintBackground(ctx, tpl.width, tpl.height, options);

  // Accent bar
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, tpl.width, tpl.height * 0.012);

  const isDeskStand = options.templateId === 'desk-stand';
  const isRollup = options.templateId === 'rollup';

  // Title area
  const titleY = isRollup ? tpl.height * 0.12 : tpl.height * 0.14;
  ctx.fillStyle = '#1d1d1f';
  ctx.textAlign = 'center';
  ctx.font = `bold ${Math.round(tpl.width * 0.065)}px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif`;
  const titleLines = wrapText(ctx, options.title || 'Scan Me', tpl.width - pad * 2);
  titleLines.forEach((line, i) => {
    ctx.fillText(line, tpl.width / 2, titleY + i * tpl.width * 0.075);
  });

  // Subtitle
  if (options.subtitle) {
    ctx.fillStyle = '#6e6e73';
    ctx.font = `${Math.round(tpl.width * 0.032)}px -apple-system, BlinkMacSystemFont, sans-serif`;
    const subLines = wrapText(ctx, options.subtitle, tpl.width - pad * 2);
    const subStart = titleY + titleLines.length * tpl.width * 0.075 + tpl.width * 0.04;
    subLines.slice(0, 3).forEach((line, i) => {
      ctx.fillText(line, tpl.width / 2, subStart + i * tpl.width * 0.045);
    });
  }

  // QR code
  const qrSize = Math.min(tpl.width * 0.42, tpl.height * 0.32);
  const qrStyle = normalizeQRStyle({
    ...options.style,
    fgColor: options.fgColor,
    bgColor: options.bgColor,
    errorCorrection: options.style?.errorCorrection ?? 'H',
  });
  const qrCanvas = await drawQr(
    options.qrContent,
    qrSize,
    qrStyle,
    options.logoDataUrl
  );

  const qrX = (tpl.width - qrSize) / 2;
  const qrY = isDeskStand
    ? tpl.height * 0.52
    : isRollup
    ? tpl.height * 0.38
    : tpl.height * 0.42;

  // QR shadow card
  ctx.save();
  drawRoundedRect(ctx, qrX - 16, qrY - 16, qrSize + 32, qrSize + 32, 24);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.08)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 12;
  ctx.fill();
  ctx.restore();

  ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

  // CTA pill
  const ctaY = qrY + qrSize + tpl.width * 0.08;
  const ctaText = 'Scan with your camera';
  ctx.font = `600 ${Math.round(tpl.width * 0.028)}px -apple-system, sans-serif`;
  const ctaW = ctx.measureText(ctaText).width + tpl.width * 0.08;
  const ctaH = tpl.width * 0.065;
  const ctaX = (tpl.width - ctaW) / 2;
  drawRoundedRect(ctx, ctaX, ctaY, ctaW, ctaH, ctaH / 2);
  ctx.fillStyle = accent;
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillText(ctaText, tpl.width / 2, ctaY + ctaH * 0.62);

  // Desk stand fold line
  if (isDeskStand) {
    ctx.setLineDash([12, 8]);
    ctx.strokeStyle = '#d2d2d7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pad, tpl.height * 0.48);
    ctx.lineTo(tpl.width - pad, tpl.height * 0.48);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#86868b';
    ctx.font = `${Math.round(tpl.width * 0.022)}px -apple-system, sans-serif`;
    ctx.fillText('— fold here —', tpl.width / 2, tpl.height * 0.46);
  }

  // Footer branding
  ctx.fillStyle = '#aeaeb2';
  ctx.font = `${Math.round(tpl.width * 0.02)}px -apple-system, sans-serif`;
  ctx.fillText('qrbanner.com', tpl.width / 2, tpl.height - pad * 0.5);

  return canvas;
}

export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string) {
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = filename;
  a.click();
}

export function downloadCanvasAsPdf(canvas: HTMLCanvasElement, filename: string) {
  const orientation = canvas.width > canvas.height ? 'landscape' : 'portrait';
  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [canvas.width, canvas.height],
    hotfixes: ['px_scaling'],
  });
  pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, canvas.width, canvas.height);
  pdf.save(filename);
}
