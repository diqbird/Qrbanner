/**
 * Client-side QR decode helpers (jsQR, dynamic import).
 */

type JsQR = typeof import('jsqr').default;

let jsQRModule: JsQR | null = null;

export async function loadJsQR(): Promise<JsQR> {
  if (!jsQRModule) {
    jsQRModule = (await import('jsqr')).default;
  }
  return jsQRModule;
}

export function decodeImageDataWithJsQR(jsQR: JsQR, imageData: ImageData): string | null {
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'attemptBoth',
  });
  return code?.data ?? null;
}

export async function decodeQrFromDataUrl(dataUrl: string): Promise<string | null> {
  const result = await decodeQrFromDataUrlRobust(dataUrl);
  return result.decoded;
}

export type DecodeConfidence = 'high' | 'medium' | 'low';

export async function decodeQrFromDataUrlRobust(dataUrl: string): Promise<{
  decoded: string | null;
  confidence: DecodeConfidence;
  scalesTried: number;
  matchCount: number;
}> {
  const scales = [1, 0.75, 1.25, 1.5, 2];
  const hits: string[] = [];
  for (const scale of scales) {
    const decoded = await decodeQrFromDataUrlAtScale(dataUrl, scale);
    if (decoded) hits.push(decoded);
  }
  if (hits.length === 0) {
    return { decoded: null, confidence: 'low', scalesTried: scales.length, matchCount: 0 };
  }
  const decoded = hits[0];
  const allMatch = hits.every((h) => payloadsMatch(h, decoded));
  const confidence: DecodeConfidence =
    hits.length >= 3 && allMatch ? 'high' : hits.length >= 2 ? 'medium' : 'low';
  return { decoded, confidence, scalesTried: scales.length, matchCount: hits.length };
}

async function decodeQrFromDataUrlAtScale(dataUrl: string, scale: number): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const jsQR = await loadJsQR();
  const img = await loadImage(dataUrl);
  const w = Math.max(64, Math.round(img.naturalWidth * scale));
  const h = Math.max(64, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = scale !== 1;
  ctx.drawImage(img, 0, 0, w, h);
  return decodeImageDataWithJsQR(jsQR, ctx.getImageData(0, 0, w, h));
}

export async function decodeQrFromVideoFrame(video: HTMLVideoElement): Promise<string | null> {
  if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) return null;
  const jsQR = await loadJsQR();
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(video, 0, 0);
  return decodeImageDataWithJsQR(jsQR, ctx.getImageData(0, 0, canvas.width, canvas.height));
}

export function payloadsMatch(decoded: string, expected: string): boolean {
  const norm = (s: string) => s.trim().replace(/\/+$/, '');
  const a = norm(decoded);
  const b = norm(expected);
  if (a === b) return true;
  try {
    return norm(decodeURIComponent(a)) === norm(decodeURIComponent(b));
  } catch {
    return false;
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
